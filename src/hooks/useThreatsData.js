import { useState, useEffect } from "react";

const SHEET_ID = "1pz0k4MUBUVreH-yC-H3D2ZYAqfbZys2ef-kafEGFOJI";
const SHEET_NAME = "user history";
const REFRESH_INTERVAL_MS = 10_000;

function mapRow(row) {
  return {
    id:       row["AlertID"]  ?? "",
    user:     row["User"]     ?? "",
    role:     row["Role"]     ?? "",
    type: row["Event"] ?? row["event"] ?? row[" Event"] ?? row["Event "] ?? "",
    date:     row["Date"]     ?? "",
    severity: row["Severity"] ?? "",
  };
}

export function useThreatsData() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchThreats() {
      try {
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          // filter out rows where both id and user are empty/zero
          const clean = data
            .map(mapRow)
            .filter((r) => r.user && r.user !== "0");
          setThreats(clean);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchThreats();

    if (REFRESH_INTERVAL_MS > 0) {
      const timer = setInterval(fetchThreats, REFRESH_INTERVAL_MS);
      return () => { cancelled = true; clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, []);

  return { threats, loading, error };
}