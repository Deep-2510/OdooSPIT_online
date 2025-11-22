import apiFetch from './api';

export default {
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => apiFetch('/auth/forgot', { method: 'POST', body: JSON.stringify(data) }),
  me: (token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return apiFetch('/auth/me', { headers });
  }
};
