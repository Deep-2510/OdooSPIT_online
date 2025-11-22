// hooks/advanced/useImport.js
import { useState, useCallback } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { parseCSV, validateImportData } from '../../utils/import/dataValidator';

export const useImport = (importService, validationSchema) => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    success: 0,
    errors: 0,
  });

  const { showNotification } = useNotification();

  const validateData = useCallback(async (file) => {
    setLoading(true);
    try {
      const parsedData = await parseCSV(file);
      const validationResults = validateImportData(parsedData, validationSchema);
      
      setData(parsedData);
      setErrors(validationResults.errors);
      
      if (validationResults.errors.length === 0) {
        showNotification('All data is valid and ready for import', 'success');
      } else {
        showNotification(
          `Found ${validationResults.errors.length} validation errors`,
          'warning'
        );
      }
    } catch (error) {
      console.error('Data validation failed:', error);
      showNotification('Failed to validate data', 'error');
      setErrors([{ message: 'Failed to parse file' }]);
    } finally {
      setLoading(false);
    }
  }, [validationSchema, showNotification]);

  const importData = useCallback(async (importData = null) => {
    const dataToImport = importData || data;
    setLoading(true);
    setProgress({ total: dataToImport.length, processed: 0, success: 0, errors: 0 });

    try {
      const results = await importService.bulkImport(dataToImport, (progress) => {
        setProgress(progress);
      });

      setProgress(results);
      
      if (results.errors > 0) {
        showNotification(
          `Import completed with ${results.errors} errors`,
          'warning'
        );
      } else {
        showNotification(
          `Successfully imported ${results.success} items`,
          'success'
        );
      }

      return results;
    } catch (error) {
      console.error('Import failed:', error);
      showNotification('Import failed', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [data, importService, showNotification]);

  const resetImport = useCallback(() => {
    setData([]);
    setErrors([]);
    setProgress({ total: 0, processed: 0, success: 0, errors: 0 });
  }, []);

  return {
    data,
    errors,
    loading,
    progress,
    validateData,
    importData,
    resetImport,
  };
};