import { 
  BarChart2, 
  Radio, 
  AlertOctagon, 
  Terminal, 
  Settings, 
  Shield, 
  Menu 
} from "lucide-react";

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

export default Sidebar;