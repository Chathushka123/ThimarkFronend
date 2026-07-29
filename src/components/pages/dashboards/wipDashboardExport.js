import ExcelJS from 'exceljs';

// Shared Excel-export building blocks for the WIP dashboards. Plain `xlsx`
// (SheetJS Community Edition, used elsewhere in this app) can't write cell
// fills/fonts or frozen panes — only ExcelJS supports that, so the export
// path for these two dashboards lives on its own here.

export const XLS_WHITE = 'FFFFFFFF';
export const XLS_INK = 'FF181B20';
export const XLS_NAVY = 'FF1F3864';

// One accent per data category — mirrors the on-screen status colors
// (green = good, red = danger, amber = rework/caution) plus the section
// accent hues from wipDashboardUI's ACCENT, so the Overview sheet's color
// coding means the same thing here as it does on screen.
export const XLS_ACCENT = {
  banner: 'FF4F46E5',
  teams: 'FF4F46E5',
  output: 'FF0D9488',
  throughput: 'FF7C3AED',
  floor: 'FFC2185B',
  success: 'FF1A9D5C',
  danger: 'FFE0393E',
  amber: 'FFDD9426',
};

function styleHeaderRow(row, { bg = XLS_NAVY, color = XLS_WHITE } = {}) {
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    cell.font = { bold: true, color: { argb: color } };
    cell.alignment = { vertical: 'middle' };
  });
  row.height = 20;
}

function freezeHeader(worksheet, rows = 1) {
  worksheet.views = [{ state: 'frozen', ySplit: rows }];
}

// Standard "column-header row + data rows" table sheet: navy header, white
// bold text, frozen top row — the shape most sheets in these reports share,
// so the fill/font/freeze/width boilerplate lives here once instead of
// being repeated per sheet.
export function addTableSheet(workbook, { name, headers, rows, widths }) {
  const ws = workbook.addWorksheet(name);
  ws.addRow(headers);
  styleHeaderRow(ws.getRow(1));
  rows.forEach((r) => ws.addRow(r));
  if (widths) widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  freezeHeader(ws, 1);
  return ws;
}

// The report's cover sheet: a colorful banner title, plain subtitle lines,
// then a Metric/Value table whose header uses a bright accent (not navy —
// deliberately distinct from the tabular sheets) and whose rows are each
// tinted by what the metric means (good/bad/caution/identity), so the sheet
// reads at a glance instead of as one flat block of numbers.
export function addOverviewSheet(workbook, { title, subtitleLines = [], metrics }) {
  const ws = workbook.addWorksheet('Overview');
  ws.mergeCells('A1:B1');
  const titleRow = ws.getRow(1);
  titleRow.height = 28;
  [1, 2].forEach((c) => {
    const cell = titleRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XLS_ACCENT.banner } };
  });
  titleRow.getCell(1).value = title;
  titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: XLS_WHITE } };
  titleRow.getCell(1).alignment = { vertical: 'middle' };

  let rowIdx = 2;
  subtitleLines.forEach((line) => {
    ws.mergeCells(`A${rowIdx}:B${rowIdx}`);
    ws.getRow(rowIdx).getCell(1).value = line;
    ws.getRow(rowIdx).getCell(1).font = { italic: true, color: { argb: 'FF6B7280' } };
    rowIdx += 1;
  });
  rowIdx += 1;

  const headerRowIdx = rowIdx;
  const headerRow = ws.getRow(headerRowIdx);
  headerRow.getCell(1).value = 'Metric';
  headerRow.getCell(2).value = 'Value';
  styleHeaderRow(headerRow, { bg: XLS_ACCENT.output, color: XLS_WHITE });
  rowIdx += 1;

  metrics.forEach((m) => {
    const r = ws.getRow(rowIdx);
    r.getCell(1).value = m.label;
    r.getCell(2).value = m.value;
    const bg = m.color || XLS_ACCENT.teams;
    const textColor = m.tone === 'amber' ? XLS_INK : XLS_WHITE;
    [1, 2].forEach((c) => {
      r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      r.getCell(c).font = { bold: c === 1, color: { argb: textColor } };
    });
    rowIdx += 1;
  });

  ws.getColumn(1).width = 34;
  ws.getColumn(2).width = 20;
  freezeHeader(ws, headerRowIdx);
  return ws;
}

export async function downloadWorkbook(workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export { ExcelJS };
