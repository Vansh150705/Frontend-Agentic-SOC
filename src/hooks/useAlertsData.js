import { useState, useEffect, useRef } from "react";

const API_KEY        = "AIzaSyCsyetR0952FRT2gpbv3f2K4fB0Sx0N3xo";
const ALERTS_ID      = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const THREATS_ID     = "1pz0k4MUBUVreH-yC-H3D2ZYAqfbZys2ef-kafEGFOJI";
const REFRESH_MS     = 10_000;

// ── Google Sheets API URL builder ─────────────────────────────────────────
function sheetsUrl(spreadsheetId, sheetName) {
  const range = encodeURIComponent(`${sheetName}!A1:Z1000`);
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
}

// ── Convert raw API response to array of objects ──────────────────────────
function parseSheet(json) {
  const values = json.values ?? [];
  if (values.length < 2) return [];
  const headers = values[0];
  const rows = values.slice(1);
  return rows
    .filter(row => row.length > 0 && row.some(cell => String(cell).trim() !== ""))
    .map(row =>
      Object.fromEntries(headers.map((h, i) => [h, (row[i] ?? "").toString().trim()]))
    );
}
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
  threats.filter(t => t.user && t.user !== "0").forEach(t => {
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
    return new Date(`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`);
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

  const seenIds = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [alertsRes, threatsRes] = await Promise.all([
          fetch(sheetsUrl(ALERTS_ID,  "Sheet1")),
          fetch(sheetsUrl(THREATS_ID, "user history")),
        ]);

        if (!alertsRes.ok)  throw new Error(`Alerts: HTTP ${alertsRes.status}`);
        if (!threatsRes.ok) throw new Error(`Threats: HTTP ${threatsRes.status}`);

        const [alertsJson, threatsJson] = await Promise.all([
          alertsRes.json(),
          threatsRes.json(),
        ]);

        if (!cancelled) {
          const mappedAlerts  = parseSheet(alertsJson).map(mapAlertRow);
          const mappedThreats = parseSheet(threatsJson).map(mapThreatRow);

          const makeKey = (a) => `${a.id}-${a.user}-${a.time}`;
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
    const timer = setInterval(fetchAll, REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { alerts, stats, severityDist, threatTrend, loading, error };
}