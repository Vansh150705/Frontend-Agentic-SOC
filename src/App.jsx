import { useState, useEffect } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Shield, AlertTriangle, CheckCircle, Bell, Settings, LogOut,
  ChevronDown, ChevronRight, Eye, X, Menu, Plus, Trash2, Edit2,
  Server, Lock, Zap, Database, BarChart2, AlertOctagon, RefreshCw,
  Download, ExternalLink, Info, ArrowUp, ArrowDown, Radio,
  Terminal, Search, Filter, Activity, Users, Clock, MoreHorizontal,
} from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const threatTrendData = [
  { time: "00:00", critical: 2, high: 5, medium: 8 },
  { time: "02:00", critical: 1, high: 3, medium: 6 },
  { time: "04:00", critical: 0, high: 2, medium: 4 },
  { time: "06:00", critical: 3, high: 7, medium: 11 },
  { time: "08:00", critical: 5, high: 12, medium: 18 },
  { time: "10:00", critical: 8, high: 15, medium: 24 },
  { time: "12:00", critical: 6, high: 11, medium: 19 },
  { time: "14:00", critical: 9, high: 18, medium: 28 },
  { time: "16:00", critical: 7, high: 14, medium: 22 },
  { time: "18:00", critical: 4, high: 9, medium: 16 },
  { time: "20:00", critical: 3, high: 6, medium: 12 },
  { time: "22:00", critical: 2, high: 4, medium: 9 },
];

const severityDist = [
  { name: "Critical", value: 8, color: "#dc2626" },
  { name: "High", value: 23, color: "#ea580c" },
  { name: "Medium", value: 41, color: "#ca8a04" },
  { name: "Low", value: 28, color: "#16a34a" },
];

const recentAlerts = [
  { id: 1, time: "14:32:11", source: "192.168.1.45", type: "SQL Injection", severity: "Critical", status: "Active", geo: "US" },
  { id: 2, time: "14:29:04", source: "10.0.0.132", type: "Brute Force", severity: "High", status: "Investigating", geo: "CN" },
  { id: 3, time: "14:27:55", source: "172.16.0.89", type: "Port Scan", severity: "Medium", status: "Active", geo: "RU" },
  { id: 4, time: "14:25:12", source: "192.168.2.15", type: "Malware C2", severity: "Critical", status: "Contained", geo: "KR" },
  { id: 5, time: "14:22:08", source: "10.10.0.55", type: "Phishing", severity: "High", status: "Resolved", geo: "NG" },
  { id: 6, time: "14:19:33", source: "192.168.3.201", type: "DDoS", severity: "Critical", status: "Active", geo: "BR" },
  { id: 7, time: "14:17:45", source: "10.0.1.77", type: "Insider Threat", severity: "High", status: "Investigating", geo: "US" },
];

const liveThreats = [
  { id: 1, time: "14:35:22", sourceIp: "203.0.113.45", type: "SQL Injection", severity: "Critical", status: "Active", protocol: "HTTP", port: 80 },
  { id: 2, time: "14:34:58", sourceIp: "198.51.100.23", type: "XSS Attack", severity: "High", status: "Active", protocol: "HTTPS", port: 443 },
  { id: 3, time: "14:34:31", sourceIp: "192.0.2.178", type: "Brute Force", severity: "High", status: "Blocked", protocol: "SSH", port: 22 },
  { id: 4, time: "14:33:45", sourceIp: "203.0.113.89", type: "Data Exfiltration", severity: "Critical", status: "Active", protocol: "FTP", port: 21 },
  { id: 5, time: "14:33:12", sourceIp: "198.51.100.67", type: "Ransomware", severity: "Critical", status: "Contained", protocol: "SMB", port: 445 },
  { id: 6, time: "14:32:50", sourceIp: "192.0.2.34", type: "Port Scan", severity: "Medium", status: "Monitoring", protocol: "TCP", port: 8080 },
  { id: 7, time: "14:32:11", sourceIp: "203.0.113.156", type: "DNS Tunneling", severity: "High", status: "Active", protocol: "DNS", port: 53 },
  { id: 8, time: "14:31:44", sourceIp: "198.51.100.9", type: "MITM Attack", severity: "Critical", status: "Investigating", protocol: "ARP", port: 0 },
  { id: 9, time: "14:30:22", sourceIp: "192.0.2.211", type: "Credential Stuffing", severity: "Medium", status: "Blocked", protocol: "HTTPS", port: 443 },
  { id: 10, time: "14:29:55", sourceIp: "203.0.113.72", type: "Malware Beacon", severity: "High", status: "Active", protocol: "HTTP", port: 80 },
];

const incidents = [
  { id: "INC-2024-001", title: "Critical SQL Injection on API Gateway", severity: "Critical", status: "In Progress", assignee: "Alex Chen", created: "2024-01-15 09:23", updated: "2024-01-15 14:32", systems: ["api-gateway-01", "db-prod-03"], description: "Multiple SQL injection attempts detected targeting the /api/users endpoint. Potential data breach in progress. Immediate containment required.", actions: ["Blocked attacking IPs at perimeter", "Isolated affected database instance", "Notified DBA team"] },
  { id: "INC-2024-002", title: "Ransomware Activity — Finance Dept", severity: "Critical", status: "Pending", assignee: "Sarah Kim", created: "2024-01-15 11:45", updated: "2024-01-15 13:20", systems: ["fin-ws-012", "fin-ws-019", "file-srv-02"], description: "Ransomware detected on multiple workstations in Finance department. File encryption in progress.", actions: ["Isolated affected workstations", "Contacted backup team"] },
  { id: "INC-2024-003", title: "Suspected Insider Threat — Data Exfil", severity: "High", status: "In Progress", assignee: "Marcus Johnson", created: "2024-01-15 08:10", updated: "2024-01-15 14:10", systems: ["hr-srv-01", "nas-02"], description: "Anomalous large-volume data transfer detected from HR server to external storage. User account under investigation.", actions: ["Account suspended", "DLP logs captured", "Legal notified"] },
  { id: "INC-2024-004", title: "DDoS Attack — Public Web Servers", severity: "High", status: "Resolved", assignee: "Priya Patel", created: "2024-01-15 06:30", updated: "2024-01-15 10:45", systems: ["web-01", "web-02", "lb-01"], description: "Volumetric DDoS attack targeting public-facing web infrastructure. Peak: 47 Gbps. Mitigated via CDN rate limiting.", actions: ["Enabled CDN DDoS protection", "Blackholed source ASNs", "Service restored at 10:45"] },
  { id: "INC-2024-005", title: "Phishing Campaign — Executive Spear", severity: "Medium", status: "Resolved", assignee: "Tom Bradley", created: "2024-01-14 14:22", updated: "2024-01-15 09:00", systems: ["mail-srv-01"], description: "Targeted phishing emails sent to 3 C-suite executives. MFA prevented unauthorized access.", actions: ["Accounts secured", "Passwords reset", "Security awareness sent"] },
];

const securityLogs = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - i * 180000).toISOString().replace("T", " ").slice(0, 19),
  level: ["INFO", "WARN", "ERROR", "CRITICAL"][Math.floor(Math.random() * 4)],
  source: ["firewall-01", "ids-sensor-02", "auth-srv", "api-gateway", "vpn-concentrator", "endpoint-mgr"][Math.floor(Math.random() * 6)],
  event: [
    "Authentication failure for user admin@corp.com",
    "Firewall rule 487 triggered — blocked outbound traffic",
    "IDS signature match: ET SCAN Nmap SYN Scan",
    "SSL certificate expiry warning: 7 days remaining",
    "Successful login from new geo-location: Tokyo, JP",
    "DLP policy violation: PII data in email attachment",
    "VPN connection established from 203.0.113.45",
    "Privilege escalation attempt detected on auth-srv",
    "Antivirus definition update completed on 842 endpoints",
    "Critical patch MS23-047 applied to 156 hosts",
  ][Math.floor(Math.random() * 10)],
  userIp: `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
}));

const users = [
  { id: 1, name: "Alex Chen", email: "alex.chen@soc.corp", role: "Admin", status: "Active", lastLogin: "2 mins ago", mfa: true },
  { id: 2, name: "Sarah Kim", email: "sarah.kim@soc.corp", role: "Senior Analyst", status: "Active", lastLogin: "15 mins ago", mfa: true },
  { id: 3, name: "Marcus Johnson", email: "m.johnson@soc.corp", role: "Security Analyst", status: "Active", lastLogin: "1 hr ago", mfa: true },
  { id: 4, name: "Priya Patel", email: "p.patel@soc.corp", role: "Security Analyst", status: "Active", lastLogin: "3 hrs ago", mfa: false },
  { id: 5, name: "Tom Bradley", email: "t.bradley@soc.corp", role: "Security Analyst", status: "Inactive", lastLogin: "2 days ago", mfa: true },
  { id: 6, name: "Lena Müller", email: "l.muller@soc.corp", role: "Threat Hunter", status: "Active", lastLogin: "30 mins ago", mfa: true },
];

const notificationsData = [
  { id: 1, type: "critical", message: "Ransomware detected on FIN-WS-012", time: "2 min ago", read: false },
  { id: 2, type: "high", message: "Brute force attack exceeding threshold on auth-srv", time: "8 min ago", read: false },
  { id: 3, type: "info", message: "INC-2024-004 resolved by Priya Patel", time: "23 min ago", read: false },
  { id: 4, type: "warning", message: "SSL Certificate expiring in 7 days on api.corp.com", time: "1 hr ago", read: true },
  { id: 5, type: "info", message: "Patch scan completed — 156 hosts updated", time: "2 hrs ago", read: true },
];

// ─── BADGE COMPONENTS ─────────────────────────────────────────────────────────

const severityStyles = {
  Critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
  High:     "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  Medium:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Low:      "bg-green-50 text-green-700 ring-1 ring-green-200",
};

const statusStyles = {
  Active:        "bg-red-50 text-red-600",
  Blocked:       "bg-orange-50 text-orange-600",
  Contained:     "bg-amber-50 text-amber-700",
  Monitoring:    "bg-blue-50 text-blue-600",
  Investigating: "bg-violet-50 text-violet-600",
  Resolved:      "bg-green-50 text-green-700",
  "In Progress": "bg-blue-50 text-blue-600",
  Pending:       "bg-slate-100 text-slate-600",
};

const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${severityStyles[severity] || "bg-slate-100 text-slate-600"}`}>
    {severity}
  </span>
);

const StatusBadge = ({ status, pulse }) => {
  const shouldPulse = pulse ?? ["Active", "Investigating", "In Progress"].includes(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
      {shouldPulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status}
    </span>
  );
};

const LogLevelBadge = ({ level }) => {
  const s = { CRITICAL: "bg-red-50 text-red-700", ERROR: "bg-orange-50 text-orange-700", WARN: "bg-amber-50 text-amber-700", INFO: "bg-slate-100 text-slate-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${s[level] || "bg-slate-100 text-slate-500"}`}>{level}</span>;
};

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="text-slate-500 font-mono mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-medium" style={{ color: p.color }}>{p.name}: <span className="text-slate-800">{p.value}</span></p>
      ))}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, trend, sublabel, accent }) => {
  const accentMap = {
    red:   { bg: "bg-red-50",   icon: "text-red-500",   ring: "ring-red-100" },
    orange:{ bg: "bg-orange-50",icon: "text-orange-500",ring: "ring-orange-100" },
    green: { bg: "bg-green-50", icon: "text-green-600", ring: "ring-green-100" },
    blue:  { bg: "bg-blue-50",  icon: "text-blue-500",  ring: "ring-blue-100" },
    slate: { bg: "bg-slate-100",icon: "text-slate-500", ring: "ring-slate-200" },
  };
  const a = accentMap[accent] || accentMap.slate;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${a.bg} ring-1 ${a.ring}`}>
          <Icon size={16} className={a.icon} />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend > 0 ? "text-red-500" : "text-green-600"}`}>
            {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
      <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Overview", icon: BarChart2 },
  { id: "threats",   label: "Threat Monitor", icon: Radio },
  { id: "incidents", label: "Incidents", icon: AlertOctagon },
  { id: "logs",      label: "Security Logs", icon: Terminal },
  { id: "admin",     label: "Admin", icon: Settings },
];

const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => (
  <aside className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-14" : "w-56"} shrink-0`}>
    {/* Logo */}
    <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-100">
      <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
        <Shield size={14} className="text-white" />
      </div>
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-bold text-sm leading-none">CyberSOC</p>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono">v2.4 · Agentic</p>
        </div>
      )}
      <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-slate-600 transition-colors ml-auto">
        <Menu size={15} />
      </button>
    </div>

    {/* Nav */}
    <nav className="flex-1 py-3 px-2 space-y-0.5">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
            }`}>
            <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
            {!collapsed && <span>{label}</span>}
          </button>
        );
      })}
    </nav>

    {/* Health */}
    {!collapsed && (
      <div className="px-3 py-3 border-t border-slate-100 space-y-1.5">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold px-1 mb-2">System</p>
        {[["Firewall", true], ["IDS/IPS", true], ["SIEM", true], ["Agents", false]].map(([label, ok]) => (
          <div key={label} className="flex items-center justify-between px-1">
            <span className="text-slate-500 text-xs">{label}</span>
            <span className={`text-xs font-medium ${ok ? "text-green-600" : "text-red-500"}`}>{ok ? "OK" : "ERR"}</span>
          </div>
        ))}
      </div>
    )}
  </aside>
);

// ─── NOTIF PANEL ──────────────────────────────────────────────────────────────

const NotifPanel = ({ notifs, onClose }) => {
  const dot = { critical: "bg-red-500", high: "bg-orange-400", warning: "bg-amber-400", info: "bg-blue-400" };
  return (
    <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <p className="text-slate-800 font-semibold text-sm">Notifications</p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
        {notifs.map((n) => (
          <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${n.read ? "opacity-50" : ""}`}>
            <span className={`w-2 h-2 rounded-full ${dot[n.type] || "bg-slate-400"} shrink-0 mt-1.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-xs leading-snug">{n.message}</p>
              <p className="text-slate-400 text-[10px] mt-1 font-mono">{n.time}</p>
            </div>
            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100">
        <button className="text-blue-600 text-xs font-medium hover:text-blue-700">Mark all as read</button>
      </div>
    </div>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────

const Topbar = ({ page, notifs, showNotif, setShowNotif }) => {
  const unread = notifs.filter((n) => !n.read).length;
  const titles = { dashboard: "Overview", threats: "Threat Monitor", incidents: "Incident Management", logs: "Security Logs", admin: "Admin" };

  return (
    <header className="h-13 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0" style={{height: 52}}>
      <div>
        <h1 className="text-slate-900 font-semibold text-sm">{titles[page]}</h1>
      </div>

      {/* Live pill */}
      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 ml-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-green-700 text-xs font-semibold">Live</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notif */}
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">{unread}</span>
            )}
          </button>
          {showNotif && <NotifPanel notifs={notifs} onClose={() => setShowNotif(false)} />}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-[11px] font-bold">AC</div>
          <div className="hidden md:block">
            <p className="text-slate-800 text-xs font-semibold leading-none">Alex Chen</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Admin</p>
          </div>
          <ChevronDown size={12} className="text-slate-400" />
        </div>

        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-slate-800 font-semibold text-sm">{title}</h2>
      {subtitle && <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── TABLE WRAPPER ────────────────────────────────────────────────────────────

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-slate-100">
          {headers.map((h) => (
            <th key={h} className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">{children}</tbody>
    </table>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

const DashboardPage = () => (
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

// ─── THREATS ──────────────────────────────────────────────────────────────────

const ThreatsPage = () => {
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

// ─── INCIDENTS ────────────────────────────────────────────────────────────────

const IncidentsPage = () => {
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

// ─── LOGS ─────────────────────────────────────────────────────────────────────

const LogsPage = () => {
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

// ─── ADMIN ────────────────────────────────────────────────────────────────────

const AdminPage = () => {
  const [tab, setTab] = useState("users");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-slate-200">
        {[["users", "Users"], ["config", "Configuration"], ["activity", "Activity"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-slate-800 font-semibold text-sm">Team Members</h3>
              <p className="text-slate-400 text-xs mt-0.5">{users.length} users, {users.filter((u) => u.status === "Active").length} active</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
              <Plus size={12} /> Add User
            </button>
          </div>
          <Table headers={["User", "Role", "Status", "Last Login", "MFA", ""]}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-slate-700 font-semibold text-xs">{u.name}</p>
                      <p className="text-slate-400 text-[10px]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">{u.role}</span></td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium w-fit ${u.status === "Active" ? "text-green-600" : "text-slate-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />{u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.mfa ? "text-green-600" : "text-red-500"}`}>{u.mfa ? "On" : "Off"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 size={12} /></button>
                    <button className="p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {tab === "config" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "SIEM", icon: Database, fields: [["Retention", "90 days"], ["Shards", "8"], ["Refresh", "5s"]] },
            { title: "Firewall", icon: Shield, fields: [["Active Rules", "2,847"], ["Blocked IPs", "14,392"], ["Allow List", "218"]] },
            { title: "IDS / IPS", icon: Zap, fields: [["Signature DB", "2024.01.15"], ["Mode", "Active"], ["Sensitivity", "High"]] },
            { title: "Alerting", icon: Bell, fields: [["Email", "Enabled"], ["Slack", "Connected"], ["PagerDuty", "Enabled"]] },
          ].map(({ title, icon: Icon, fields }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg"><Icon size={15} className="text-slate-600" /></div>
                <h3 className="text-slate-800 font-semibold text-sm">{title}</h3>
                <button className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={15} /></button>
              </div>
              <div className="space-y-0">
                {fields.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-500 text-xs">{k}</span>
                    <span className="text-slate-800 text-xs font-semibold font-mono">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-slate-800 font-semibold text-sm">Recent Admin Actions</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { user: "Alex Chen", initials: "AC", action: "Modified firewall ruleset #487", time: "14:32" },
              { user: "Sarah Kim", initials: "SK", action: "Closed INC-2024-004 as Resolved", time: "10:45" },
              { user: "Marcus Johnson", initials: "MJ", action: "Added new IDS signature — ET EXPLOIT", time: "09:12" },
              { user: "Alex Chen", initials: "AC", action: "Revoked API key for integration svc-03", time: "08:55" },
              { user: "Priya Patel", initials: "PP", action: "Exported log bundle for 2024-01-14", time: "08:30" },
              { user: "Alex Chen", initials: "AC", action: "Added user lena.muller@soc.corp", time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0">{a.initials}</div>
                <div className="flex-1 text-xs">
                  <span className="text-slate-800 font-semibold">{a.user}</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-600">{a.action}</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-80 bg-slate-900 p-10 shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-slate-900" />
            </div>
            <span className="text-white font-bold text-base">CyberSOC</span>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug mb-3">Security Operations, unified.</h2>
          <p className="text-slate-400 text-sm leading-relaxed">Monitor, detect, and respond to threats across your entire infrastructure from a single pane of glass.</p>
        </div>

        <div className="space-y-3">
          {[
            { label: "Firewall", ok: true },
            { label: "IDS / IPS", ok: true },
            { label: "SIEM Indexer", ok: true },
            { label: "Agent Fleet", ok: false },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs">{label}</span>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${ok ? "text-green-400" : "text-red-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${ok ? "animate-none" : "animate-pulse"}`} />
                {ok ? "Operational" : "Degraded"}
              </div>
            </div>
          ))}
          <p className="text-slate-600 text-[10px] font-mono pt-1">Last sync: 12 seconds ago</p>
        </div>
      </div>

      {/* Right / form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-slate-900 font-bold">CyberSOC</span>
          </div>

          <h1 className="text-slate-900 font-bold text-2xl mb-1">Sign in</h1>
          <p className="text-slate-400 text-sm mb-7">Enter your credentials to access the SOC platform.</p>

          {/* Role tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
            {["Admin", "Analyst"].map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${role === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-600 text-xs font-semibold block mb-1.5">Work email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 placeholder-slate-300 transition-all bg-white" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-600 text-xs font-semibold">Password</label>
                <button className="text-blue-600 text-xs hover:text-blue-700">Forgot password?</button>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 placeholder-slate-300 transition-all bg-white" />
            </div>
          </div>

          <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 1100); }} disabled={loading}
            className="mt-5 w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><RefreshCw size={14} className="animate-spin" />Signing in…</> : <><Lock size={13} />Sign in securely</>}
          </button>

          <p className="text-slate-400 text-[11px] text-center mt-5">Protected by TLS 1.3 · MFA enforced · SOC 2 Type II</p>
        </div>
      </div>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const pages = {
    dashboard: <DashboardPage />,
    threats:   <ThreatsPage />,
    incidents: <IncidentsPage />,
    logs:      <LogsPage />,
    admin:     <AdminPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar page={page} notifs={notificationsData} showNotif={showNotif} setShowNotif={setShowNotif} />
        <main className="flex-1 overflow-y-auto p-5" onClick={() => showNotif && setShowNotif(false)}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
