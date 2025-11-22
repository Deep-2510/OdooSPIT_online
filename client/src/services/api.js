const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  const res = await fetch(url, Object.assign({}, options, { headers }));
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || res.statusText || 'Request failed');
    return json;
  } catch (err) {
    if (!res.ok) throw err;
    return text;
  }
}

export default apiFetch;
