export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-slate-100">
          {headers.map((h) => (
            <th key={h} className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">{children}</tbody>
    </table>
  </div>
);
