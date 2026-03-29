import { useState } from "react";
import { Search, X, Download } from "lucide-react";
import { LogLevelBadge } from "../components/Badges";
import { securityLogs } from "../data/logsData";

export const LogsPage = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = securityLogs.filter((l) => {
    const lvl = levelFilter === "All" || l.level === levelFilter;
    const q = !search || l.event.toLowerCase().includes(search.toLowerCase()) || l.source.includes(search) || l.userIp.includes(search);
    return lvl && q;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[160px]">
          <Search size={13} className="text-slate-400 shrink-0" />
          <input className="bg-transparent text-slate-700 text-xs outline-none flex-1 placeholder-slate-400" placeholder="Search events, IPs, sources…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          {search && <button onClick={() => setSearch("")}><X size={11} className="text-slate-400" /></button>}
        </div>
        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
          {["All", "CRITICAL", "ERROR", "WARN", "INFO"].map((l) => (
            <button key={l} onClick={() => { setLevelFilter(l); setPage(1); }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${levelFilter === l ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
              {l}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs font-medium transition-colors ml-auto">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Timestamp", "Level", "Source", "Event", "IP Address"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">{l.timestamp}</td>
                  <td className="px-4 py-2.5"><LogLevelBadge level={l.level} /></td>
                  <td className="px-4 py-2.5 font-mono text-blue-600 text-[11px] whitespace-nowrap">{l.source}</td>
                  <td className="px-4 py-2.5 text-slate-600 max-w-xs truncate">{l.event}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{l.userIp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/30">
          <p className="text-slate-400 text-xs">{((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium transition-colors">← Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${page === p ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};
