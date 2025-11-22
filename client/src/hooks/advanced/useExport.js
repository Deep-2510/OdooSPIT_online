// hooks/advanced/useExport.js
import { useState } from 'react';
import { exportAPI } from '../../services/api/export';
import { useNotification } from '../../contexts/NotificationContext';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { showNotification } = useNotification();

  const exportData = async (exportType, filters = {}, filename = null) => {
    setIsExporting(true);
    try {
      let response;
      
      switch (exportType) {
        case 'products':
          response = await exportAPI.exportProducts(filters);
          break;
        case 'stock-report':
          response = await exportAPI.exportStockReport(filters);
          break;
        case 'movement-report':
          response = await exportAPI.exportMovementReport(filters);
          break;
        default:
          throw new Error(`Unknown export type: ${exportType}`);
      }

      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename if not provided
      const exportFilename = filename || `${exportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
      link.download = exportFilename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification(`Export completed successfully`, 'success');
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Export failed. Please try again.', 'error');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToFormat = async (exportType, format, filters = {}) => {
    // Implementation for different formats (PDF, CSV, Excel)
    switch (format) {
      case 'excel':
        return await exportData(exportType, filters);
      case 'pdf':
        // PDF export implementation
        break;
      case 'csv':
        // CSV export implementation
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  return {
    isExporting,
    exportData,
    exportToFormat,
  };
};