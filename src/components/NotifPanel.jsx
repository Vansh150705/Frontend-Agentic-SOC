import { X } from "lucide-react";

const NotifPanel = ({ notifs, onClose }) => {
  const dot = {
    critical: "bg-red-500",
    high:     "bg-orange-400",
    warning:  "bg-amber-400",
    info:     "bg-blue-400",
  };

  return (
    <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-gray-800 font-semibold text-sm">Notifications</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${n.read ? "opacity-50" : ""}`}
          >
            <span className={`w-2 h-2 rounded-full ${dot[n.type] || "bg-gray-400"} shrink-0 mt-1`} />
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-xs leading-snug">{n.message}</p>
              <p className="text-gray-400 text-xs mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100">
        <button className="text-blue-600 text-xs hover:text-blue-700">
          Mark all as read
        </button>
      </div>

    </div>
  );
};

export default NotifPanel;