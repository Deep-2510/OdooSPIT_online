import { api } from '../utils'

export const receiptsAPI = {
  getAll: (params) => api.get('/receipts', { params }),
  getById: (id) => api.get(`/receipts/${id}`),
  create: (data) => api.post('/receipts', data),
  update: (id, data) => api.put(`/receipts/${id}`, data),
  validate: (id) => api.post(`/receipts/${id}/validate`),
  cancel: (id) => api.post(`/receipts/${id}/cancel`),
}

// Backwards-compatible helpers used by pages/components
export const listReceipts = (q, params = {}) => {
  const p = Object.assign({}, params)
  if (q) p.q = q
  return receiptsAPI.getAll(p).then((res) => res.data)
}

export const getReceipt = (id) => receiptsAPI.getById(id).then((res) => res.data)

export default receiptsAPI