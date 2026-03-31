// src/hooks/useIncidentsData.js
import { useState, useEffect } from "react";

const SHEET_ID   = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const SHEET_NAME = "Sheet1";
const REFRESH_INTERVAL_MS = 10_000;

function mapRow(row, index) {
  const alertId = row["AlertID"] ?? "";
  return {
    id:          `INC-${String(alertId).padStart(3, "0")}`,
    title:       row["Event"]    ?? "Untitled Incident",
    assignee:    row["User"]     ?? "Unassigned",
    role:        row["Role"]     ?? "",
    severity:    row["Severity"] ?? "",
    status:      row["Status"]   ?? "",
    description: row["Summary"]  ?? "No description available.",
    created:     row["Date"]     ?? "",
    updated:     row["LastUpdated"] ?? row["Date"] ?? "",
    _index:      index, // used as unique key since AlertID has duplicates
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
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setIncidents(data.map(mapRow));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchIncidents();

    if (REFRESH_INTERVAL_MS > 0) {
      const timer = setInterval(fetchIncidents, REFRESH_INTERVAL_MS);
      return () => { cancelled = true; clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, []);

  return { incidents, loading, error };
}