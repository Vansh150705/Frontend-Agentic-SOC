import { Bell, ChevronDown, LogOut } from "lucide-react";
import NotifPanel from "./NotifPanel";

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

export default Topbar;