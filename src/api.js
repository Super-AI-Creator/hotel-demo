const API_BASE = import.meta.env.VITE_API_BASE || 'https://hhs-hotel-demo-backend-2ysyg.ondigitalocean.app/api'
// 'https://hhs-hotel-demo-backend-2ysyg.ondigitalocean.app/api'
import { useNavigate } from 'react-router-dom';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token'); // Make sure this matches your backend storage key
  opts.headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (res.status === 401) {
    localStorage.removeItem('token');
    const navigate = useNavigate();
    navigate('/login');
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }

  return data;
}

export async function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}
// export async function register(email, password) {
//   return request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) })
// }
// export async function listHotels() { return request('/hotels') }
export async function getAuto(payload) { return request('/sync/auto_trigger', { method: 'POST', body: JSON.stringify(payload) }) }
export async function getLockData(hotelId,payload) { return request(`/hotels/${hotelId}/locks`, { method: 'POST', body: JSON.stringify(payload) }) }
export async function getRoomData(hotelId,payload) { return request(`/hotels/${hotelId}/rooms`, { method: 'POST', body: JSON.stringify(payload) }) }
export async function getPinHistory() { return request('/sync/history') }
export async function updateHotel(hotelId, payload) { return request(`/hotels/${hotelId}`, { method: 'PUT', body: JSON.stringify(payload) }) }
export async function listDoors(hotelId) { return request(`/hotels/${hotelId}/doors`) }
export async function addDoor(hotelId, payload) { return request(`/hotels/${hotelId}/doors`, { method: 'POST', body: JSON.stringify(payload) }) }
export async function triggerSync(hotelId, payload) { return request(`/sync/trigger/${hotelId}`, { method: 'POST', body: JSON.stringify(payload) }) }

export async function listBookings(hotelId, payload) {
  return request(`/sync/bookings/${hotelId}`, { method: 'POST', body: JSON.stringify(payload) })
}
export async function setLockID(hotelId, payload) {
  return request(`/hotels/${hotelId}/setlock`, { method: 'POST', body: JSON.stringify(payload) })
}
export async function register(userId, password, inviteCode) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ userId, password, inviteCode }),
  });
}