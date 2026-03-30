export const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs">
      <p className="text-gray-500 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-gray-700">
          {p.name}:{" "}
          <span className="font-semibold" style={{ color: p.color }}>
            {p.value}
          </span>
        </p>
      ))}
    </div>
  );
};