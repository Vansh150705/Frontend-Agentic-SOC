export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          {headers.map((h) => (
            <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-medium text-xs">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">{children}</tbody>
    </table>
  </div>
);