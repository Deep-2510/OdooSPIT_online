import { api } from '../utils'

export const warehousesAPI = {
  getAll: () => api.get('/warehouses'),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  getStock: (id) => api.get(`/warehouses/${id}/stock`),
  getLocations: (id) => api.get(`/warehouses/${id}/locations`),
}