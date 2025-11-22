// services/api/settings.js
import api from './base';

export const settingsAPI = {
  // Get system settings
  getSettings: () => api.get('/settings'),
  
  // Update system settings
  updateSettings: (settings) => api.put('/settings', settings),
  
  // Get user preferences
  getUserPreferences: () => api.get('/settings/preferences'),
  
  // Update user preferences
  updateUserPreferences: (preferences) => api.put('/settings/preferences', preferences),
  
  // Get audit logs
  getAuditLogs: (params = {}) => api.get('/settings/audit-logs', { params }),
  
  // Export audit logs
  exportAuditLogs: (params = {}) => 
    api.get('/settings/audit-logs/export', {
      params,
      responseType: 'blob',
    }),
  
  // System maintenance
  runMaintenance: (operation) => api.post('/settings/maintenance', { operation }),
  
  // Backup operations
  createBackup: () => api.post('/settings/backup'),
  restoreBackup: (backupId) => api.post(`/settings/restore/${backupId}`),
  getBackups: () => api.get('/settings/backups'),
};