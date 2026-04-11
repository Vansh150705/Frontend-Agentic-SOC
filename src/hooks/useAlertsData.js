import { useState, useEffect, useRef } from "react";

const API_KEY    = import.meta.env.VITE_GOOGLE_API_KEY;
const ALERTS_ID  = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const THREATS_ID = "1pz0k4MUBUVreH-yC-H3D2ZYAqfbZys2ef-kafEGFOJI";
const REFRESH_MS = 10_000;

function sheetsUrl(spreadsheetId, sheetName) {
  const range = encodeURIComponent(`${sheetName}!A1:Z1000`);
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
}

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

function mapAlertRow(row) {
  return {
    id:                    row["AlertID"]               ?? "",
    time:                  row["Date"]                  ?? "",
    type:                  row["Event"]                 ?? "",
    user:                  row["User"]                  ?? "",
    role:                  row["Role"]                  ?? "",
    sourceIp:              row["SourceIP"]              ?? "",
    service:               row["Service"]              ?? "",
    outcome:               row["Outcome"]               ?? "",
    severity:              row["Severity"]              ?? "",
    noise:                 row["Noise"]                 ?? "",
    requiresInvestigation: row["RequiresInvestigation"] ?? "",
    summary:               row["Summary"]               ?? "",
    reasoning:             row["Reasoning"]             ?? "",
    risk:                  row["Risk"]                  ?? "",
    confidence:            row["Confidence"]            ?? "",
    status:                row["Status"]                ?? "",
    comments:              row["Comments"]              ?? "",
    lastUpdated:           row["LastUpdated"]           ?? "",
  };
}

function mapThreatRow(row) {
  return {
    date: row["Date"] ?? "",
    risk: row["Risk"] ?? "",
    user: row["User"] ?? "",
  };
}

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

// ── Alerts by Event Type — top 6 most common ──────────────────────────────
function computeEventTypeDist(alerts) {
  const counts = {};
  alerts.forEach(a => {
    const type = a.type?.trim();
    if (!type) return;
    // normalize similar event names
    const key = type.toLowerCase()
      .replace(/priviel?ege?\s*escal?a?tion/i, "privilege escalation")
      .replace(/failed?\s*login/i,             "failed login")
      .replace(/iam\s*change/i,                "IAM change")
      .replace(/impossible\s*travel/i,         "impossible travel")
      .replace(/system\s*crash/i,              "system crash");
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }));
}

// ── Top Users by Alert Count — top 6 ─────────────────────────────────────
function computeTopUsers(alerts) {
  const counts = {};
  alerts.forEach(a => {
    const user = a.user?.trim();
    if (!user) return;
    counts[user] = (counts[user] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));
}

function severityToNotifType(severity) {
  const s = severity?.toUpperCase();
  if (s === "CRITICAL") return "critical";
  if (s === "HIGH")     return "high";
  if (s === "MEDIUM")   return "warning";
  return "info";
}

export function useAlertsData(onNewAlerts) {
  const [alerts,         setAlerts]         = useState([]);
  const [stats,          setStats]          = useState({ total: 0, highCount: 0, openCount: 0, noAction: 0 });
  const [severityDist,   setSeverityDist]   = useState([]);
  const [eventTypeDist,  setEventTypeDist]  = useState([]);
  const [topUsers,       setTopUsers]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

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
          setEventTypeDist(computeEventTypeDist(mappedAlerts));
          setTopUsers(computeTopUsers(mappedAlerts));
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

  return { alerts, stats, severityDist, eventTypeDist, topUsers, loading, error };
}