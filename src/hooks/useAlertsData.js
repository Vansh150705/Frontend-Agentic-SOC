import { useState, useEffect } from "react";

const SHEET_ID = "1t8DDSoJ3-YTvvQgPt11yW6mqcGpqKQh4VTThUq0vVuc";
const SHEET_NAME = "Sheet1"; // exact tab name in your Google Sheet
const REFRESH_INTERVAL_MS = 10_000; // auto-refresh every 10 seconds (set to 0 to disable)

function mapRow(row) {
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

export function useAlertsData() {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlerts() {
      try {
        const encodedName = encodeURIComponent(SHEET_NAME);
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodedName}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setAlerts(data.map(mapRow));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAlerts();

    if (REFRESH_INTERVAL_MS > 0) {
      const timer = setInterval(fetchAlerts, REFRESH_INTERVAL_MS);
      return () => { cancelled = true; clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, []);

  return { alerts, loading, error };
}