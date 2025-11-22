import { api } from '../utils'

export const transfersAPI = {
  getAll: (params) => api.get('/transfers', { params }),
  getById: (id) => api.get(`/transfers/${id}`),
  create: (data) => api.post('/transfers', data),
  update: (id, data) => api.put(`/transfers/${id}`, data),
  complete: (id) => api.post(`/transfers/${id}/complete`),
  cancel: (id) => api.post(`/transfers/${id}/cancel`),
}