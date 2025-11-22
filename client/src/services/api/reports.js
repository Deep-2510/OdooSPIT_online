// services/api/reports.js
import api from './base';

export const reportAPI = {
  // Get available report templates
  getReportTemplates: () => api.get('/reports/templates'),
  
  // Save custom report configuration
  saveReport: (reportConfig) => api.post('/reports/save', reportConfig),
  
  // Get saved reports
  getSavedReports: () => api.get('/reports/saved'),
  
  // Delete saved report
  deleteReport: (reportId) => api.delete(`/reports/${reportId}`),
  
  // Generate report preview
  previewReport: (reportConfig) => api.post('/reports/preview', reportConfig),
  
  // Run and export report
  runReport: (reportId, format = 'excel') => 
    api.get(`/reports/run/${reportId}`, {
      params: { format },
      responseType: 'blob',
    }),
  
  // Schedule report
  scheduleReport: (reportId, schedule) => 
    api.post(`/reports/schedule/${reportId}`, schedule),
  
  // Get scheduled reports
  getScheduledReports: () => api.get('/reports/scheduled'),
};

// Advanced analytics endpoints
export const analyticsAPI = {
  getAdvancedAnalytics: (params = {}) => 
    api.get('/analytics/advanced', { params }),
  
  getStockForecast: (productId, params = {}) =>
    api.get(`/analytics/forecast/${productId}`, { params }),
  
  getWarehouseAnalytics: (warehouseId, params = {}) =>
    api.get(`/analytics/warehouse/${warehouseId}`, { params }),
  
  getMovementAnalytics: (params = {}) =>
    api.get('/analytics/movement', { params }),
  
  getPerformanceMetrics: (params = {}) =>
    api.get('/analytics/performance', { params }),
};