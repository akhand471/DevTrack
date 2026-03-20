import api from './api'

/**
 * Goals service — CRUD operations for learning goals
 */
const goalsService = {
    /**
     * Create a new goal
     */
    createGoal: async (data) => {
        const res = await api.post('/api/goals', data)
        return res.data
    },

    /**
     * Get all goals for the logged-in user
     * @param {Object} params - Optional filters { status, category }
     */
    getGoals: async (params = {}) => {
        const res = await api.get('/api/goals', { params })
        return res.data
    },

    /**
     * Update a goal by ID
     * @param {string} id - Goal ID
     * @param {Object} updates - Fields to update
     */
    updateGoal: async (id, updates) => {
        const res = await api.put(`/api/goals/${id}`, updates)
        return res.data
    },

    /**
     * Delete a goal by ID
     */
    deleteGoal: async (id) => {
        const res = await api.delete(`/api/goals/${id}`)
        return res.data
    },
}

export default goalsService
