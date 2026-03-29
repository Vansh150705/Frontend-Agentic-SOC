import { ArrowUp, ArrowDown } from "lucide-react";

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

export default StatCard;