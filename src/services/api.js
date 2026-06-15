import axios from 'axios'

// In dev: Vite proxy forwards /api/* → http://localhost:5000
// In prod: set VITE_API_URL to your backend domain
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // send httpOnly refresh cookie automatically
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor — handle 401 with silent token refresh ─────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Skip retry for refresh endpoint itself or already-retried requests
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.skipAuthRefresh &&
      !original.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue other 401 requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers['Authorization'] = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post('/api/auth/refresh', {}, { skipAuthRefresh: true })
        const newToken = data?.data?.accessToken
        if (newToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          original.headers['Authorization'] = `Bearer ${newToken}`
          processQueue(null, newToken)
          return api(original)
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        // Redirect to login if refresh also fails
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
