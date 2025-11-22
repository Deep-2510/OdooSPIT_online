// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    signup: async (email: string, password: string, role: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      return response.json();
    },
  },

  // Products endpoints
  products: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    getById: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    create: async (product: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      return response.json();
    },
    update: async (id: string, product: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      return response.json();
    },
    delete: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },

  // Stock endpoints
  stock: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/stock`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    getByWarehouse: async (warehouseId: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/stock/warehouse/${warehouseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },

  // Operations endpoints
  operations: {
    receipt: async (data: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/operations/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delivery: async (data: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/operations/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    transfer: async (data: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/operations/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getMoves: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/operations/moves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },

  // Warehouses endpoints
  warehouses: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/warehouses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
};
