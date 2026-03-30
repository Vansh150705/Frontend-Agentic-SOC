const severityStyles = {
  Critical: "bg-red-600 text-white",
  HIGH:     "bg-orange-500 text-white",
  High:     "bg-orange-500 text-white",
  MEDIUM:   "bg-amber-400 text-white",
  Medium:   "bg-amber-400 text-white",
  LOW:      "bg-green-500 text-white",
  Low:      "bg-green-500 text-white",
};

const statusStyles = {
  Active:        "bg-red-500 text-white",
  Blocked:       "bg-orange-500 text-white",
  Contained:     "bg-amber-500 text-white",
  Monitoring:    "bg-blue-500 text-white",
  Investigating: "bg-purple-500 text-white",
  Resolved:      "bg-green-500 text-white",
  "In Progress": "bg-blue-400 text-white",
  Pending:       "bg-gray-400 text-white",
  open:          "bg-red-500 text-white",
  "no action":   "bg-gray-400 text-white",
};

export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${severityStyles[severity] || "bg-gray-400 text-white"}`}>
    {severity}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[status] || "bg-gray-400 text-white"}`}>
    {status}
  </span>
);

export const LogLevelBadge = ({ level }) => {
  const s = {
    CRITICAL: "bg-red-600 text-white",
    ERROR:    "bg-orange-500 text-white",
    WARN:     "bg-amber-400 text-white",
    INFO:     "bg-gray-400 text-white",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${s[level] || "bg-gray-400 text-white"}`}>
      {level}
    </span>
  );
};