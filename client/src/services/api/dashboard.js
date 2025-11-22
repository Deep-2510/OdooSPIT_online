import { api } from '../utils'

export const dashboardAPI = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getStockAlerts: () => api.get('/dashboard/stock-alerts'),
  getMovementStats: (period) => api.get('/dashboard/movement-stats', { 
    params: { period } 
  }),
}