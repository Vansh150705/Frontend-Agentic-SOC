import { useState } from "react";
import { Plus, ChevronRight, X, Users, Clock, CheckCircle } from "lucide-react";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { incidents } from "../data/incidentsData";

export const IncidentsPage = () => {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = statusFilter === "All" ? incidents : incidents.filter((i) => i.status === statusFilter);

  return (
    <div className="flex gap-4 h-full">
      {/* List */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Pending", "In Progress", "Resolved"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}>
              {s}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
            <Plus size={12} /> New Incident
          </button>
        </div>

        {filtered.map((inc) => (
          <div key={inc.id} onClick={() => setSelected(inc)}
            className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${selected?.id === inc.id ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">{inc.id}</span>
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
                <p className="text-slate-800 text-sm font-semibold">{inc.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1"><Users size={11} /> {inc.assignee}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {inc.updated}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-300 shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-88 shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col" style={{ width: 340 }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <span className="font-mono text-xs text-slate-500 font-semibold">{selected.id}</span>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 p-0.5"><X size={15} /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-slate-800 font-bold text-sm leading-snug mb-2.5">{selected.title}</h2>
              <div className="flex gap-2"><SeverityBadge severity={selected.severity} /><StatusBadge status={selected.status} /></div>
            </div>

            <div className="p-5 border-b border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                {[["Assignee", selected.assignee], ["Created", selected.created.split(" ")[0]], ["Updated", selected.updated.split(" ")[0]], ["Impacted", selected.systems.length + " systems"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">{k}</p>
                    <p className="text-slate-700 text-xs font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-b border-slate-100">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-2">Description</p>
              <p className="text-slate-600 text-xs leading-relaxed">{selected.description}</p>
            </div>

            <div className="p-5 border-b border-slate-100">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-2">Affected Systems</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.systems.map((s) => <span key={s} className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-1 rounded">{s}</span>)}
              </div>
            </div>

            <div className="p-5 border-b border-slate-100">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-2">Actions Taken</p>
              <ul className="space-y-2">
                {selected.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" /> {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-2.5">Set Status</p>
              <div className="flex gap-2 flex-wrap">
                {["Pending", "In Progress", "Resolved"].map((s) => (
                  <button key={s} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selected.status === s ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
