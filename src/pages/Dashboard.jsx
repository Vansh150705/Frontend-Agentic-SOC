import {
  BarChart, Bar, PieChart, Pie, Cell,
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
  const { alerts: recentAlerts, stats, severityDist, eventTypeDist, topUsers, loading, error } = useAlertsData(onNewAlerts);

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

        {/* ── Alerts by Event Type — replaces old Threat Activity chart ── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-4">
            <h3 className="text-slate-800 font-semibold text-sm">Alerts by Event Type</h3>
            <p className="text-slate-400 text-xs mt-0.5">Most common threat events — from alert record</p>
          </div>
          {loading ? (
            <p className="text-slate-400 text-xs py-10 text-center">Loading chart…</p>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart
                data={eventTypeDist}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#e2e8f0"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#e2e8f0"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  width={130}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Alerts" fill="#3b82f6" radius={[0, 3, 3, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Right column: Severity Distribution + Top Users ── */}
        <div className="flex flex-col gap-4">

          {/* Donut chart — unchanged */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-slate-800 font-semibold text-sm mb-0.5">Distribution</h3>
            <p className="text-slate-400 text-xs mb-3">By severity — alert record</p>
            {loading ? (
              <p className="text-slate-400 text-xs py-4 text-center">Loading…</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={severityDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" strokeWidth={0}>
                      {severityDist.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {severityDist.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className="text-slate-500 text-xs flex-1">{d.name}</span>
                      <span className="text-slate-700 text-xs font-semibold tabular-nums">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Top Users by Alert Count ── */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-slate-800 font-semibold text-sm mb-0.5">Top Users</h3>
            <p className="text-slate-400 text-xs mb-3">By alert count</p>
            {loading ? (
              <p className="text-slate-400 text-xs py-4 text-center">Loading…</p>
            ) : (
              <div className="space-y-2">
                {topUsers.map((u, i) => {
                  const max = topUsers[0]?.count || 1;
                  return (
                    <div key={u.name} className="flex items-center gap-2">
                      <span className="text-slate-400 text-[10px] w-3 tabular-nums">{i + 1}</span>
                      <span className="text-slate-600 text-xs flex-1 truncate font-medium">{u.name}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(u.count / max) * 100}%` }} />
                      </div>
                      <span className="text-slate-700 text-xs font-semibold tabular-nums w-4 text-right">{u.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Recent Alerts table — unchanged ── */}
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