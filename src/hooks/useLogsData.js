// src/hooks/useLogsData.js
import { useState, useEffect } from "react";

const SHEET_ID   = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const SHEET_NAME = "Sheet1";
const REFRESH_INTERVAL_MS = 10_000;

// map sheet Severity to log level
function severityToLevel(severity) {
  const s = severity?.toUpperCase();
  if (s === "CRITICAL") return "CRITICAL";
  if (s === "HIGH")     return "ERROR";
  if (s === "MEDIUM")   return "WARN";
  return "INFO";
}

function mapRow(row, index) {
  return {
    id:        index,
    timestamp: row["Date"]      ?? "",
    level:     severityToLevel(row["Severity"]),
    source:    row["User"]      ?? "",
    event:     row["Summary"]   ?? row["Event"] ?? "",
  };
}

export function useLogsData() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLogs() {
      try {
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setLogs(data.map(mapRow));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLogs();

    if (REFRESH_INTERVAL_MS > 0) {
      const timer = setInterval(fetchLogs, REFRESH_INTERVAL_MS);
      return () => { cancelled = true; clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, []);

  return { logs, loading, error };
}