import { useState, useEffect } from "react";

const API_KEY    = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID   = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const SHEET_NAME = "Sheet1";
const REFRESH_MS = 10_000;

function sheetsUrl(spreadsheetId, sheetName) {
  const range = encodeURIComponent(`${sheetName}!A1:Z1000`);
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
}

// ── Fixed parseSheet — handles short/incomplete rows ──────────────────────
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
    timestamp: row["Date"]    ?? "",
    level:     severityToLevel(row["Severity"]),
    source:    row["User"]    ?? "",
    event:     row["Summary"] ?? row["Event"] ?? "",
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
        const res  = await fetch(sheetsUrl(SHEET_ID, SHEET_NAME));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setLogs(parseSheet(json).map(mapRow));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLogs();
    const timer = setInterval(fetchLogs, REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { logs, loading, error };
}