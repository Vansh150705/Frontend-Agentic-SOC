import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AlertTriangle, CheckCircle, Server, AlertOctagon } from "lucide-react";
import StatCard from "../components/StatCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { Table } from "../components/Table";
import { threatTrendData, severityDist } from "../data/threatsData";
import { recentAlerts } from "../data/alertsData";

export const DashboardPage = () => (
  <div className="space-y-6">

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Threats" value="247" icon={AlertTriangle} trend={12} accent="red" sublabel="Last 24 hours" />
      <StatCard label="Active Incidents" value="8" icon={AlertOctagon} trend={3} accent="orange" sublabel="Needs attention" />
      <StatCard label="Resolved Today" value="186" icon={CheckCircle} trend={-8} accent="green" sublabel="22 more than yesterday" />
      <StatCard label="Systems Online" value="99.2%" icon={Server} accent="blue" sublabel="847 of 854 healthy" />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Threat trend chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
        <div className="mb-4">
          <h3 className="text-gray-800 font-semibold text-sm">Threat Activity (Last 24 hours)</h3>
          <p className="text-gray-400 text-xs mt-0.5">Grouped by severity level</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3">
          {[["Critical", "#dc2626"], ["High", "#ea580c"], ["Medium", "#ca8a04"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: c }} />
              <span className="text-gray-500 text-xs">{l}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={threatTrendData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              {[["critical", "#dc2626"], ["high", "#ea580c"], ["medium", "#ca8a04"]].map(([k, c]) => (
                <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#e2e8f0" tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <YAxis stroke="#e2e8f0" tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={1.5} fill="url(#g-critical)" name="Critical" dot={false} />
            <Area type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={1.5} fill="url(#g-high)" name="High" dot={false} />
            <Area type="monotone" dataKey="medium" stroke="#ca8a04" strokeWidth={1.5} fill="url(#g-medium)" name="Medium" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Severity distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-gray-800 font-semibold text-sm mb-1">Severity Breakdown</h3>
        <p className="text-gray-400 text-xs mb-3">Active threats only</p>

        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={severityDist}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {severityDist.map((e) => (
                <Cell key={e.name} fill={e.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Simple legend list */}
        <div className="mt-3 space-y-2">
          {severityDist.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="text-gray-500 text-xs">{d.name}</span>
              </div>
              <span className="text-gray-700 text-xs font-semibold">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Alerts */}
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-gray-800 font-semibold text-sm">Recent Alerts</h3>
      </div>
      <Table headers={["Time", "Source IP", "Type", "Severity", "Status", "Geo"]}>
        {recentAlerts.map((a) => (
          <tr key={a.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-2.5 font-mono text-gray-400 text-xs">{a.time}</td>
            <td className="px-4 py-2.5 font-mono text-blue-600 text-xs">{a.source}</td>
            <td className="px-4 py-2.5 text-gray-700 text-sm">{a.type}</td>
            <td className="px-4 py-2.5"><SeverityBadge severity={a.severity} /></td>
            <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
            <td className="px-4 py-2.5">
              <span className="text-gray-500 text-xs">{a.geo}</span>
            </td>
          </tr>
        ))}
      </Table>
    </div>

  </div>
);