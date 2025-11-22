// utils/export/excelExport.js
import * as XLSX from 'xlsx';

export const exportToExcel = (data, headers, filename, options = {}) => {
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: headers,
    skipHeader: options.skipHeader || false,
  });

  // Apply styling if needed
  if (options.columnWidths) {
    worksheet['!cols'] = options.columnWidths.map(width => ({ width }));
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || 'Sheet1');

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportMultipleSheets = (sheets, filename) => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet, index) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data, {
      header: sheet.headers,
    });
    
    if (sheet.columnWidths) {
      worksheet['!cols'] = sheet.columnWidths.map(width => ({ width }));
    }

    XLSX.utils.book_append_sheet(
      workbook, 
      worksheet, 
      sheet.name || `Sheet${index + 1}`
    );
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const generateExcelTemplate = (headers, filename) => {
  const templateData = [headers.reduce((acc, header) => {
    acc[header.key] = header.example || '';
    return acc;
  }, {})];

  exportToExcel(templateData, headers.map(h => h.key), filename, {
    skipHeader: false,
  });
};