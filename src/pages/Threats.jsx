import { useState } from "react";
import { Search, X } from "lucide-react";
import { SeverityBadge } from "../components/Badges";
import { Table } from "../components/Table";


import { useThreatsData } from "../hooks/useThreatsData";

export const ThreatsPage = () => {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");


  const { threats, loading, error } = useThreatsData();

  const filtered = threats.filter((t) => {
    const sev = severityFilter === "All" || t.severity === severityFilter;
 
    const q = !search ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());
    return sev && q;
  });

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            className="text-gray-700 text-sm outline-none flex-1 placeholder-gray-400 bg-transparent"

            placeholder="Search by user or threat type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-1">
          {["All", "Critical", "HIGH", "MEDIUM", "LOW"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                severityFilter === s
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="ml-auto text-gray-400 text-xs">{filtered.length} results</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        {loading && (
          <p className="px-5 py-4 text-slate-400 text-xs">Loading threats…</p>
        )}
        {error && (
          <p className="px-5 py-4 text-red-500 text-xs">Failed to load threats: {error}</p>
        )}


        {!loading && !error && (
          <Table headers={["ID", "Date", "User", "Role", "Threat Type", "Severity"]}>
            {filtered.map((t, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors ${
                  t.severity === "Critical" ? "border-l-2 border-red-400" : ""
                }`}
              >
                <td className="px-4 py-3 font-mono text-gray-400 text-xs">{t.id}</td>
                <td className="px-4 py-3 font-mono text-gray-400 text-xs whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3 font-mono text-blue-600 text-xs">{t.user}</td>
                <td className="px-4 py-3">
                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono">{t.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{t.type}</td>
                <td className="px-4 py-3"><SeverityBadge severity={t.severity} /></td>
              </tr>
            ))}
          </Table>
        )}
      </div>

    </div>
  );
};