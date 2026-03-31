import { useState } from "react";
import { Search, X } from "lucide-react";
import { LogLevelBadge } from "../components/Badges";

// ── ONLY CHANGE: replaced static securityLogs import with live Google Sheets hook ──
import { useLogsData } from "../hooks/useLogsData";

export const LogsPage = () => {
  const [search,      setSearch]      = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [page,        setPage]        = useState(1);
  const perPage = 12;

  // ── ONLY CHANGE: fetch logs dynamically ──
  const { logs: securityLogs, loading, error } = useLogsData();

  const filtered = securityLogs.filter((l) => {
    const lvl = levelFilter === "All" || l.level === levelFilter;
    const q =
      !search ||
      l.event.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase());
    return lvl && q;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center">

        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            className="text-gray-700 text-sm outline-none flex-1 placeholder-gray-400 bg-transparent"
            // ── ONLY CHANGE: updated placeholder to reflect available columns ──
            placeholder="Search events or users"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Level filter — unchanged, levels are derived from severity */}
        <div className="flex items-center gap-1">
          {["All", "CRITICAL", "ERROR", "WARN", "INFO"].map((l) => (
            <button
              key={l}
              onClick={() => { setLevelFilter(l); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                levelFilter === l
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {loading && <p className="px-5 py-4 text-slate-400 text-xs">Loading logs…</p>}
        {error   && <p className="px-5 py-4 text-red-500 text-xs">Failed to load: {error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {/* ── ONLY CHANGE: removed IP Address column header ── */}
                  {["Timestamp", "Level", "Source", "Event"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-gray-400 text-xs whitespace-nowrap">{l.timestamp}</td>
                    <td className="px-4 py-2.5"><LogLevelBadge level={l.level} /></td>
                    {/* ── ONLY CHANGE: source is now User column ── */}
                    <td className="px-4 py-2.5 text-blue-600 text-xs whitespace-nowrap">{l.source}</td>
                    {/* ── ONLY CHANGE: event is now Summary column ── */}
                    <td className="px-4 py-2.5 text-gray-600 text-xs max-w-xs truncate">{l.event}</td>
                    {/* ── ONLY CHANGE: IP Address td removed ── */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-gray-400 text-xs">
              Showing {filtered.length === 0 ? 0 : ((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};