const severityStyles = {
  Critical: "bg-red-50 text-red-700",
  High:     "bg-orange-50 text-orange-700",
  Medium:   "bg-amber-50 text-amber-700",
  Low:      "bg-green-50 text-green-700",
};

const statusStyles = {
  Active:        "bg-red-50 text-red-600",
  Blocked:       "bg-orange-50 text-orange-600",
  Contained:     "bg-amber-50 text-amber-700",
  Monitoring:    "bg-blue-50 text-blue-600",
  Investigating: "bg-purple-50 text-purple-600",
  Resolved:      "bg-green-50 text-green-700",
  "In Progress": "bg-blue-50 text-blue-600",
  Pending:       "bg-gray-100 text-gray-600",
};

export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityStyles[severity] || "bg-gray-100 text-gray-600"}`}>
    {severity}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
    {status}
  </span>
);

export const LogLevelBadge = ({ level }) => {
  const s = {
    CRITICAL: "bg-red-50 text-red-700",
    ERROR:    "bg-orange-50 text-orange-700",
    WARN:     "bg-amber-50 text-amber-700",
    INFO:     "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${s[level] || "bg-gray-100 text-gray-500"}`}>
      {level}
    </span>
  );
};