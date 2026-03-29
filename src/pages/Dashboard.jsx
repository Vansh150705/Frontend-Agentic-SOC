import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AlertTriangle, CheckCircle, Server, AlertOctagon, ExternalLink } from "lucide-react";
import StatCard from "../components/StatCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { Table } from "../components/Table";
import { threatTrendData, severityDist } from "../data/threatsData";
import { recentAlerts } from "../data/alertsData";

export const DashboardPage = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Threats" value="247" icon={AlertTriangle} trend={12} accent="red" sublabel="Last 24 hours" />
      <StatCard label="Active Incidents" value="8" icon={AlertOctagon} trend={3} accent="orange" sublabel="Needs attention" />
      <StatCard label="Resolved Today" value="186" icon={CheckCircle} trend={-8} accent="green" sublabel="↑ 22 since yesterday" />
      <StatCard label="Systems Online" value="99.2%" icon={Server} accent="blue" sublabel="847 of 854 healthy" />
    </div>

    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Threat trend */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-800 font-semibold text-sm">Threat Activity</h3>
            <p className="text-slate-400 text-xs mt-0.5">Volume by severity — last 24 hours</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
            {["1h", "6h", "24h", "7d"].map((t) => (
              <button key={t} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${t === "24h" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3">
          {[["Critical", "#dc2626"], ["High", "#ea580c"], ["Medium", "#ca8a04"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 rounded" style={{ background: c }} />
              <span className="text-slate-500 text-xs">{l}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={threatTrendData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
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
            <Area type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={1.5} fill="url(#g-high)" name="High" dot={false} />
            <Area type="monotone" dataKey="medium" stroke="#ca8a04" strokeWidth={1.5} fill="url(#g-medium)" name="Medium" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Severity dist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-slate-800 font-semibold text-sm mb-0.5">Distribution</h3>
        <p className="text-slate-400 text-xs mb-3">By severity, active only</p>
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
      </div>
    </div>

    {/* Recent Alerts */}
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm">Recent Alerts</h3>
          <p className="text-slate-400 text-xs mt-0.5">Last 7 events across all sensors</p>
        </div>
        <button className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
          All alerts <ExternalLink size={11} />
        </button>
      </div>
      <Table headers={["Time", "Source IP", "Type", "Severity", "Status", "Geo"]}>
        {recentAlerts.map((a) => (
          <tr key={a.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">{a.time}</td>
            <td className="px-4 py-2.5 font-mono text-blue-600 font-medium text-[11px]">{a.source}</td>
            <td className="px-4 py-2.5 text-slate-700 font-medium">{a.type}</td>
            <td className="px-4 py-2.5"><SeverityBadge severity={a.severity} /></td>
            <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
            <td className="px-4 py-2.5">
              <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono">{a.geo}</span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  </div>
);
