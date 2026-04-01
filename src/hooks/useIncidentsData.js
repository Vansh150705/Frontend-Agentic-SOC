import { useState, useEffect } from "react";

const API_KEY    = "AIzaSyCsyetR0952FRT2gpbv3f2K4fB0Sx0N3xo";
const SHEET_ID   = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const SHEET_NAME = "Sheet1";
const REFRESH_MS = 10_000;

function sheetsUrl(spreadsheetId, sheetName) {
  const range = encodeURIComponent(`${sheetName}!A1:Z1000`);
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
}

function parseSheet(json) {
  const [headers, ...rows] = json.values ?? [];
  if (!headers) return [];
  return rows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
  );
}

function mapRow(row, index) {
  const alertId = row["AlertID"] ?? "";
  return {
    id:          `INC-${String(alertId).padStart(3, "0")}`,
    title:       row["Event"]       ?? "Untitled Incident",
    assignee:    row["User"]        ?? "Unassigned",
    role:        row["Role"]        ?? "",
    severity:    row["Severity"]    ?? "",
    status:      row["Status"]      ?? "",
    description: row["Summary"]     ?? "No description available.",
    created:     row["Date"]        ?? "",
    updated:     row["LastUpdated"] ?? row["Date"] ?? "",
    _index:      index,
  };
}

export function useIncidentsData() {
  const [incidents, setIncidents] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchIncidents() {
      try {
        const res = await fetch(sheetsUrl(SHEET_ID, SHEET_NAME));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setIncidents(parseSheet(json).map(mapRow));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchIncidents();
    const timer = setInterval(fetchIncidents, REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { incidents, loading, error };
}