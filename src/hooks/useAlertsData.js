import { useState, useEffect, useRef } from "react";

// ── Sheet 1: alert record ──────────────────────────────────────────────────
const ALERTS_SHEET_ID   = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const ALERTS_SHEET_NAME = "Sheet1";

// ── Sheet 2: user history ──────────────────────────────────────────────────
const THREATS_SHEET_ID   = "1pz0k4MUBUVreH-yC-H3D2ZYAqfbZys2ef-kafEGFOJI";
const THREATS_SHEET_NAME = "user history";

const REFRESH_INTERVAL_MS = 10_000;

// ── Row mappers ────────────────────────────────────────────────────────────
function mapAlertRow(row) {
  return {
    id:          row["AlertID"]     ?? "",
    time:        row["Date"]        ?? "",
    type:        row["Event"]       ?? "",
    user:        row["User"]        ?? "",
    role:        row["Role"]        ?? "",
    severity:    row["Severity"]    ?? "",
    status:      row["Status"]      ?? "",
    summary:     row["Summary"]     ?? "",
    lastUpdated: row["LastUpdated"] ?? "",
  };
}

function mapThreatRow(row) {
  return {
    date:     row["Date"]     ?? "",
    severity: row["Severity"] ?? "",
    user:     row["User"]     ?? "",
  };
}

// ── Derived computations ───────────────────────────────────────────────────
function computeStats(alerts) {
  const total     = alerts.length;
  const highCount = alerts.filter(a => a.severity?.toUpperCase() === "HIGH").length;
  const openCount = alerts.filter(a => a.status?.toLowerCase() === "open").length;
  const noAction  = alerts.filter(a => a.status?.toLowerCase() === "no action").length;
  return { total, highCount, openCount, noAction };
}

function computeSeverityDist(alerts) {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  alerts.forEach(a => {
    const s = a.severity?.toUpperCase();
    if (s in counts) counts[s]++;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return [
    { name: "Critical", value: Math.round((counts.CRITICAL / total) * 100), color: "#dc2626" },
    { name: "High",     value: Math.round((counts.HIGH     / total) * 100), color: "#ea580c" },
    { name: "Medium",   value: Math.round((counts.MEDIUM   / total) * 100), color: "#ca8a04" },
    { name: "Low",      value: Math.round((counts.LOW      / total) * 100), color: "#16a34a" },
  ].filter(d => d.value > 0);
}

function computeThreatTrend(threats) {
  const map = {};
  threats
    .filter(t => t.user && t.user !== "0")
    .forEach(t => {
      const date = t.date || "Unknown";
      if (!map[date]) map[date] = { time: date, critical: 0, high: 0, medium: 0 };
      const s = t.severity?.toUpperCase();
      if      (s === "CRITICAL") map[date].critical++;
      else if (s === "HIGH")     map[date].high++;
      else if (s === "MEDIUM")   map[date].medium++;
    });

  const parseDate = (d) => {
    if (!d || d === "Unknown") return new Date(0);
    if (d.includes("-")) return new Date(d);
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  return Object.values(map).sort((a, b) => parseDate(a.time) - parseDate(b.time));
}

function severityToNotifType(severity) {
  const s = severity?.toUpperCase();
  if (s === "CRITICAL") return "critical";
  if (s === "HIGH")     return "high";
  if (s === "MEDIUM")   return "warning";
  return "info";
}

// ── Main hook ──────────────────────────────────────────────────────────────
export function useAlertsData(onNewAlerts) {
  const [alerts,       setAlerts]       = useState([]);
  const [stats,        setStats]        = useState({ total: 0, highCount: 0, openCount: 0, noAction: 0 });
  const [severityDist, setSeverityDist] = useState([]);
  const [threatTrend,  setThreatTrend]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // track seen rows across fetches using composite key
  const seenIds = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [alertsRes, threatsRes] = await Promise.all([
          fetch(`https://opensheet.elk.sh/${ALERTS_SHEET_ID}/${encodeURIComponent(ALERTS_SHEET_NAME)}`),
          fetch(`https://opensheet.elk.sh/${THREATS_SHEET_ID}/${encodeURIComponent(THREATS_SHEET_NAME)}`),
        ]);

        if (!alertsRes.ok)  throw new Error(`Alerts sheet: HTTP ${alertsRes.status}`);
        if (!threatsRes.ok) throw new Error(`Threats sheet: HTTP ${threatsRes.status}`);

        const [alertsRaw, threatsRaw] = await Promise.all([
          alertsRes.json(),
          threatsRes.json(),
        ]);

        if (!cancelled) {
          const mappedAlerts  = alertsRaw.map(mapAlertRow);
          const mappedThreats = threatsRaw.map(mapThreatRow);

          // composite key so duplicate AlertIDs don't collide
          const makeKey = (a) => `${a.id}-${a.user}-${a.time}`;

          // find ALL rows not seen yet — includes existing rows on first load
          const newRows = mappedAlerts.filter(a => !seenIds.current.has(makeKey(a)));

          if (newRows.length > 0 && onNewAlerts) {
            const newNotifs = newRows.map((a, i) => ({
              id:      Date.now() + i,
              type:    severityToNotifType(a.severity),
              message: a.summary
                ? `${a.user}: ${a.summary}`
                : `New alert — ${a.type} by ${a.user} (${a.severity})`,
              time:    a.time || "just now",
              read:    false,
            }));
            onNewAlerts(newNotifs);
            newRows.forEach(a => seenIds.current.add(makeKey(a)));
          }

          setAlerts(mappedAlerts);
          setStats(computeStats(mappedAlerts));
          setSeverityDist(computeSeverityDist(mappedAlerts));
          setThreatTrend(computeThreatTrend(mappedThreats));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    if (REFRESH_INTERVAL_MS > 0) {
      const timer = setInterval(fetchAll, REFRESH_INTERVAL_MS);
      return () => { cancelled = true; clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, []);

  return { alerts, stats, severityDist, threatTrend, loading, error };
}