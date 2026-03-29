import { X } from "lucide-react";

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

export default NotifPanel;
