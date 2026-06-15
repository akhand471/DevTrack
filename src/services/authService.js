import api from './api'

const authService = {
  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData)
    return data
  },

  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials)
    return data
  },

  logout: async () => {
    await api.post('/api/auth/logout')
  },

  getMe: async () => {
    const { data } = await api.get('/api/auth/me')
    return data
  },

  verifyEmail: async (token) => {
    const { data } = await api.get(`/api/auth/verify-email?token=${token}`)
    return data
  },

  resendVerification: async (email) => {
    const { data } = await api.post('/api/auth/resend-verification', { email })
    return data
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/api/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token, password) => {
    const { data } = await api.post('/api/auth/reset-password', { token, password })
    return data
  },
}

export default authService
