import { useState } from "react";
import { Search, X } from "lucide-react";
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

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
        
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            className="text-gray-700 text-sm outline-none flex-1 placeholder-gray-400 bg-transparent"
            placeholder="Search by IP or threat type"
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
          {["All", "Critical", "High", "Medium", "Low"].map((s) => (
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
        <Table headers={["Time", "Source IP", "Threat Type", "Protocol", "Port", "Severity", "Status", "Action"]}>
          {filtered.map((t) => (
            <tr
              key={t.id}
              className={`hover:bg-gray-50 transition-colors ${
                t.severity === "Critical" ? "border-l-2 border-red-400" : ""
              }`}
            >
              <td className="px-4 py-3 font-mono text-gray-400 text-xs whitespace-nowrap">{t.time}</td>
              <td className="px-4 py-3 font-mono text-blue-600 text-xs">{t.sourceIp}</td>
              <td className="px-4 py-3 text-gray-700 text-sm">{t.type}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{t.protocol}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{t.port || "—"}</td>
              <td className="px-4 py-3"><SeverityBadge severity={t.severity} /></td>
              <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3">
                <button className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs transition-colors">
                  Block
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

    </div>
  );
};