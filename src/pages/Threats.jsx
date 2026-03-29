import { useState } from "react";
import { Search, X, Eye } from "lucide-react";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { Table } from "../components/Table";
import { liveThreats } from "../data/threatsData";

export const ThreatsPage = () => {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = liveThreats.filter((t) => {
    const sev = severityFilter === "All" || t.severity === severityFilter;
    const q = !search || t.sourceIp.includes(search) || t.type.toLowerCase().includes(search.toLowerCase());
    return sev && q;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[160px]">
          <Search size={13} className="text-slate-400 shrink-0" />
          <input className="bg-transparent text-slate-700 text-xs outline-none flex-1 placeholder-slate-400" placeholder="Search IP or threat type…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")}><X size={11} className="text-slate-400 hover:text-slate-600" /></button>}
        </div>
        <div className="flex items-center gap-1.5">
          {["All", "Critical", "High", "Medium", "Low"].map((s) => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${severityFilter === s ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-slate-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {filtered.length} events
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table headers={["Time", "Source IP", "Threat Type", "Protocol", "Port", "Severity", "Status", ""]}>
          {filtered.map((t) => (
            <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${t.severity === "Critical" ? "border-l-2 border-red-400" : ""}`}>
              <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">{t.time}</td>
              <td className="px-4 py-2.5 font-mono text-blue-600 font-semibold text-[11px]">{t.sourceIp}</td>
              <td className="px-4 py-2.5 text-slate-700 font-medium">{t.type}</td>
              <td className="px-4 py-2.5 font-mono text-slate-500 text-[11px]">{t.protocol}</td>
              <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{t.port || "—"}</td>
              <td className="px-4 py-2.5"><SeverityBadge severity={t.severity} /></td>
              <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-semibold transition-colors">Block</button>
                  <button className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><Eye size={12} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};
