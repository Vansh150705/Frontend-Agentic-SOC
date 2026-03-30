import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, trend, sublabel, accent }) => {
  const accentMap = {
    red:    { bg: "bg-red-50",    icon: "text-red-500"    },
    orange: { bg: "bg-orange-50", icon: "text-orange-500" },
    green:  { bg: "bg-green-50",  icon: "text-green-600"  },
    blue:   { bg: "bg-blue-50",   icon: "text-blue-500"   },
    slate:  { bg: "bg-gray-100",  icon: "text-gray-500"   },
  };
  const a = accentMap[accent] || accentMap.slate;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${a.bg}`}>
          <Icon size={16} className={a.icon} />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? "text-red-500" : "text-green-600"}`}>
            {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
};

export default StatCard;