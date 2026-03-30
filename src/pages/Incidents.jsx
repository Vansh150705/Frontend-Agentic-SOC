import { useState } from "react";
import { Plus, ChevronRight, X, CheckCircle } from "lucide-react";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { incidents } from "../data/incidentsData";

export const IncidentsPage = () => {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered =
    statusFilter === "All"
      ? incidents
      : incidents.filter((i) => i.status === statusFilter);

  return (
    <div className="flex gap-4 h-full">

      {/* List */}
      <div className="flex-1 min-w-0 space-y-3">

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Pending", "In Progress", "Resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:text-gray-800"
              }`}
            >
              {s}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={12} /> New Incident
          </button>
        </div>

        {/* Incident cards */}
        {filtered.map((inc) => (
          <div
            key={inc.id}
            onClick={() => setSelected(inc)}
            className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
              selected?.id === inc.id
                ? "border-blue-300 ring-1 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-medium">
                    {inc.id}
                  </span>
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
                <p className="text-gray-800 text-sm font-semibold">{inc.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-gray-400 text-xs">
                  <span>{inc.assignee}</span>
                  <span>·</span>
                  <span>{inc.updated}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-300 shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
          style={{ width: 340 }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <span className="text-xs text-gray-500 font-semibold">{selected.id}</span>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* Title + badges */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-gray-800 font-semibold text-sm leading-snug mb-2.5">
                {selected.title}
              </h2>
              <div className="flex gap-2">
                <SeverityBadge severity={selected.severity} />
                <StatusBadge status={selected.status} />
              </div>
            </div>

            {/* Meta */}
            <div className="p-5 border-b border-gray-100 space-y-2">
              {[
                ["Assignee", selected.assignee],
                ["Created", selected.created.split(" ")[0]],
                ["Updated", selected.updated.split(" ")[0]],
                ["Systems affected", selected.systems.length],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-700 text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-gray-500 text-xs font-medium mb-1.5">Description</p>
              <p className="text-gray-600 text-xs leading-relaxed">{selected.description}</p>
            </div>

            {/* Affected systems */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-gray-500 text-xs font-medium mb-2">Affected Systems</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.systems.map((s) => (
                  <span
                    key={s}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions taken */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-gray-500 text-xs font-medium mb-2">Actions Taken</p>
              <ul className="space-y-2">
                {selected.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Update status */}
            <div className="p-5">
              <p className="text-gray-500 text-xs font-medium mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {["Pending", "In Progress", "Resolved"].map((s) => (
                  <button
                    key={s}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selected.status === s
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};