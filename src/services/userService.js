import api from './api'

const userService = {
  getProfile: async () => {
    const { data } = await api.get('/api/user/profile')
    return data
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/api/user/profile', updates)
    return data
  },

  getStats: async () => {
    const { data } = await api.get('/api/user/stats')
    return data
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put('/api/user/change-password', { currentPassword, newPassword })
    return data
  },
}

export default userService
