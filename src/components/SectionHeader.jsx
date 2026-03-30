export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-gray-800 font-semibold text-sm">{title}</h2>
      {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);