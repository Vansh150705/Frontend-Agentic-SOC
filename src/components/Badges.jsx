const severityStyles = {
  Critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
  High:     "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  Medium:   "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Low:      "bg-green-50 text-green-700 ring-1 ring-green-200",
};

const statusStyles = {
  Active:        "bg-red-50 text-red-600",
  Blocked:       "bg-orange-50 text-orange-600",
  Contained:     "bg-amber-50 text-amber-700",
  Monitoring:    "bg-blue-50 text-blue-600",
  Investigating: "bg-violet-50 text-violet-600",
  Resolved:      "bg-green-50 text-green-700",
  "In Progress": "bg-blue-50 text-blue-600",
  Pending:       "bg-slate-100 text-slate-600",
};

export const SeverityBadge = ({ severity }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${severityStyles[severity] || "bg-slate-100 text-slate-600"}`}>
    {severity}
  </span>
);

export const StatusBadge = ({ status, pulse }) => {
  const shouldPulse = pulse ?? ["Active", "Investigating", "In Progress"].includes(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
      {shouldPulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status}
    </span>
  );
};

export const LogLevelBadge = ({ level }) => {
  const s = { CRITICAL: "bg-red-50 text-red-700", ERROR: "bg-orange-50 text-orange-700", WARN: "bg-amber-50 text-amber-700", INFO: "bg-slate-100 text-slate-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${s[level] || "bg-slate-100 text-slate-500"}`}>{level}</span>;
};
