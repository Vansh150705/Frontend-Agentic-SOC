import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AlertTriangle, CheckCircle, ShieldAlert, AlertOctagon, ExternalLink, Download } from "lucide-react";
import StatCard from "../components/StatCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { Table } from "../components/Table";
import { useAlertsData } from "../hooks/useAlertsData";
import { exportToPDF } from "../utils/exportPDF";

export const DashboardPage = ({ onNewAlerts }) => {
  const { alerts: recentAlerts, stats, severityDist, threatTrend, loading, error } = useAlertsData(onNewAlerts);

  function handleExport() {
    exportToPDF({
      title:   "Recent Alerts Report",
      headers: ["Date", "User", "Event", "Source IP", "Severity", "Status", "Outcome", "Summary"],
      rows:    recentAlerts.map(a => [a.time, a.user, a.type, a.sourceIp, a.severity, a.status, a.outcome, a.summary]),
    });
  }

  return (
    <div className="space-y-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Alerts"    value={loading ? "…" : String(stats.total)}     icon={AlertTriangle} accent="red"    sublabel="All records in sheet" />
        <StatCard label="HIGH Severity"   value={loading ? "…" : String(stats.highCount)} icon={AlertOctagon}  accent="orange" sublabel="Needs attention" />
        <StatCard label="Open Alerts"     value={loading ? "…" : String(stats.openCount)} icon={ShieldAlert}   accent="green"  sublabel="Status = open" />
        <StatCard label="No Action Taken" value={loading ? "…" : String(stats.noAction)}  icon={CheckCircle}   accent="blue"   sublabel="Status = no action" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-800 font-semibold text-sm">Threat Activity</h3>
              <p className="text-slate-400 text-xs mt-0.5">Volume by severity — by date</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-3">
            {[["Critical", "#dc2626"], ["High", "#ea580c"], ["Medium", "#ca8a04"]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded" style={{ background: c }} />
                <span className="text-slate-500 text-xs">{l}</span>
              </div>
            ))}
          </div>
          {loading ? (
            <p className="text-slate-400 text-xs py-10 text-center">Loading chart…</p>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={threatTrend} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  {[["critical", "#dc2626"], ["high", "#ea580c"], ["medium", "#ca8a04"]].map(([k, c]) => (
                    <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#e2e8f0" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "monospace" }} />
                <YAxis stroke="#e2e8f0" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={1.5} fill="url(#g-critical)" name="Critical" dot={false} />
                <Area type="monotone" dataKey="high"     stroke="#ea580c" strokeWidth={1.5} fill="url(#g-high)"     name="High"     dot={false} />
                <Area type="monotone" dataKey="medium"   stroke="#ca8a04" strokeWidth={1.5} fill="url(#g-medium)"   name="Medium"   dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-0.5">Distribution</h3>
          <p className="text-slate-400 text-xs mb-3">By severity — alert record</p>
          {loading ? (
            <p className="text-slate-400 text-xs py-10 text-center">Loading…</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={severityDist} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {severityDist.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {severityDist.map((d) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                    <span className="text-slate-500 text-xs flex-1">{d.name}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                    </div>
                    <span className="text-slate-700 text-xs font-semibold tabular-nums w-6 text-right">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Recent Alerts table ── */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-slate-800 font-semibold text-sm">Recent Alerts</h3>
            <p className="text-slate-400 text-xs mt-0.5">Live data from Google Sheets</p>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && (
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                <Download size={12} /> Export PDF
              </button>
            )}
            <button className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
              All alerts <ExternalLink size={11} />
            </button>
          </div>
        </div>

        {loading && <p className="px-5 py-4 text-slate-400 text-xs">Loading alerts…</p>}
        {error   && <p className="px-5 py-4 text-red-500 text-xs">Failed to load: {error}</p>}

        {!loading && !error && (
          <Table headers={["Date", "User", "Event", "Source IP", "Severity", "Status", "Outcome", "Summary"]}>
            {recentAlerts.map((a, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">{a.time}</td>
                <td className="px-4 py-2.5 font-mono text-blue-600 font-medium text-[11px]">{a.user}</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium text-xs">{a.type}</td>
                <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{a.sourceIp || "—"}</td>
                <td className="px-4 py-2.5"><SeverityBadge severity={a.severity} /></td>
                <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{a.outcome || "—"}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs max-w-xs truncate" title={a.summary}>{a.summary}</td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};