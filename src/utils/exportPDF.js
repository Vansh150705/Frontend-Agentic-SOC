// src/utils/exportPDF.js
// Uses browser's built-in print API to generate PDF — no external libraries needed

export function exportToPDF({ title, headers, rows }) {
  const date = new Date().toLocaleString();

  const tableRows = rows.map(row =>
    `<tr>${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}</tr>`
  ).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #111827; padding-bottom: 12px; }
        .logo { font-size: 18px; font-weight: 700; color: #111827; }
        .logo span { font-size: 11px; font-weight: 400; color: #6b7280; display: block; margin-top: 2px; }
        .meta { text-align: right; font-size: 10px; color: #6b7280; }
        h2 { font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #111827; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #111827; color: white; text-align: left; padding: 8px 10px; font-weight: 600; }
        td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; color: #374151; }
        tr:nth-child(even) td { background: #f9fafb; }
        .footer { margin-top: 20px; font-size: 10px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 15px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          Cyber SOC
          <span>Agentic SOC Platform · Internal Use Only</span>
        </div>
        <div class="meta">
          <div><strong>Report:</strong> ${title}</div>
          <div><strong>Generated:</strong> ${date}</div>
          <div><strong>Total Records:</strong> ${rows.length}</div>
        </div>
      </div>
      <h2>${title}</h2>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">Cyber SOC · Confidential · Generated on ${date}</div>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 500);
}