import { useState, useEffect } from "react";

const API_KEY    = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID   = "1pz0k4MUBUVreH-yC-H3D2ZYAqfbZys2ef-kafEGFOJI";
const SHEET_NAME = "user history";
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

// ── Updated mapRow with new columns ───────────────────────────────────────
function mapRow(row) {
  return {
    id:         row["AlertID"]    ?? "",
    user:       row["User"]       ?? "",
    role:       row["Role"]       ?? "",
    type:       row["Event"]      ?? "",
    date:       row["Date"]       ?? "",
    summary:    row["Summary"]    ?? "",
    risk:       row["Risk"]       ?? "",
    confidence: row["Confidence"] ?? "",
  };
}

export function useThreatsData() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchThreats() {
      try {
        const res = await fetch(sheetsUrl(SHEET_ID, SHEET_NAME));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          const clean = parseSheet(json)
            .map(mapRow)
            .filter(r => r.user && r.user !== "0" && r.user !== "null" && r.user !== "unknown");
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
    const timer = setInterval(fetchThreats, REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { threats, loading, error };
}