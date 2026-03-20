import api from './api'

/**
 * User service — profile and stats operations
 */
const userService = {
    /**
     * Get full user profile
     */
    getProfile: async () => {
        const res = await api.get('/api/user/profile')
        return res.data
    },

    /**
     * Update user profile
     * @param {Object} data - { name, bio, githubUsername, location }
     */
    updateProfile: async (data) => {
        const res = await api.put('/api/user/profile', data)
        return res.data
    },

    /**
     * Get user stats (streaks, days since joining, etc.)
     */
    getStats: async () => {
        const res = await api.get('/api/user/stats')
        return res.data
    },
}

export default userService
