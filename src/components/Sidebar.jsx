import {
  BarChart2,
  Radio,
  AlertOctagon,
  Terminal,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Overview", icon: BarChart2 },
  { id: "threats",   label: "Threat Monitor", icon: Radio },
  { id: "incidents", label: "Incidents", icon: AlertOctagon },
  { id: "logs",      label: "Security Logs", icon: Terminal },
  { id: "admin",     label: "Admin", icon: Settings },
];

const Sidebar = ({ active, setActive }) => (
  <aside className="flex flex-col bg-white border-r border-gray-200 w-52 shrink-0">

    {/* Logo */}
    <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
      <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
        <Shield size={14} className="text-white" />
      </div>
      <div>
        <p className="text-gray-900 font-bold text-sm leading-none">Cyber SOC</p>
        <p className="text-gray-400 text-[10px] mt-0.5">Agentic SOC</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 py-3 px-2 space-y-0.5">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-gray-900 text-white font-semibold"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium"
            }`}
          >
            <Icon size={15} className={isActive ? "text-white" : "text-gray-400"} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>

    {/* Bottom user info */}
    <div className="px-4 py-3 border-t border-gray-100">
      <p className="text-gray-400 text-xs">Logged in as</p>
      <p className="text-gray-700 text-sm font-medium">Vansh Mahajan</p>
    </div>

  </aside>
);

export default Sidebar;