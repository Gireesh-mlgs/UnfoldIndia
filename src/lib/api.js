import { getToken } from './auth';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, method='GET', body=null, token=null) {
  const headers = { 'Content-Type': 'application/json' };
  const t = token || getToken();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch(e) { data = { raw: text }; }
  if (!res.ok) {
    const message = data.error || data.message || text || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const api = {
  auth: {
    register: (email, password) => request('/v1/auth/register', 'POST', { email, password }),
    login: (email, password) => request('/v1/auth/login', 'POST', { email, password })
  },
  chat: {
    send: (message, sessionId) => request('/v1/chat', 'POST', { message, sessionId })
  },
  translate: {
    text: (text, target='en') => request('/v1/translate', 'POST', { text, target })
  },
  maps: {
    searchPlaces: (query, proximity) => request(`/v1/maps/places/search?query=${encodeURIComponent(query)}${proximity?`&proximity=${encodeURIComponent(proximity)}`:''}`),
    route: (origin, destination, profile='driving') => request('/v1/maps/routes', 'POST', { origin, destination, profile })
  },
  safety: {
    report: (lat,lng,description) => request('/v1/safety/report','POST',{lat,lng,description}),
    alerts: (lat,lng) => request(`/v1/safety/alerts?lat=${lat}&lng=${lng}`)
  }
};
