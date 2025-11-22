import { api } from '../utils'

export const adjustmentsAPI = {
  getAll: (params) => api.get('/adjustments', { params }),
  getById: (id) => api.get(`/adjustments/${id}`),
  create: (data) => api.post('/adjustments', data),
  update: (id, data) => api.put(`/adjustments/${id}`, data),
  approve: (id) => api.post(`/adjustments/${id}/approve`),
  cancel: (id) => api.post(`/adjustments/${id}/cancel`),
}