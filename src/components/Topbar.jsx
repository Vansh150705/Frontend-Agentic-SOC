import { Bell, LogOut } from "lucide-react";
import NotifPanel from "./NotifPanel";

const Topbar = ({ page, notifs, showNotif, setShowNotif, markAllAsRead }) => {
  const unread = notifs.filter((n) => !n.read).length;
  const titles = {
    dashboard: "Overview",
    threats:   "Threat Monitor",
    incidents: "Incident Management",
    logs:      "Security Logs",
    admin:     "Admin",
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0">
      <h1 className="text-gray-800 font-semibold text-base">{titles[page]}</h1>

      <div className="ml-auto flex items-center gap-3">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {/* ── pass markAllAsRead to NotifPanel ── */}
          {showNotif && (
            <NotifPanel
              notifs={notifs}
              onClose={() => setShowNotif(false)}
              markAllAsRead={markAllAsRead}
            />
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-[10px] font-bold">
            AC
          </div>
          <div>
            <p className="text-gray-700 text-xs font-semibold leading-none">Alex Chen</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <LogOut size={16} />
        </button>

      </div>
    </header>
  );
};

export default Topbar;