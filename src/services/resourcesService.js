import api from './api'

/**
 * Resources service — CRUD operations for learning resources
 */
const resourcesService = {
    /**
     * Create a new resource
     */
    createResource: async (data) => {
        const res = await api.post('/api/resources', data)
        return res.data
    },

    /**
     * Get all resources for the logged-in user
     * @param {Object} params - Optional filters { category, type, favorites }
     */
    getResources: async (params = {}) => {
        const res = await api.get('/api/resources', { params })
        return res.data
    },

    /**
     * Update a resource by ID (toggle favorite, rating, notes, etc.)
     */
    updateResource: async (id, updates) => {
        const res = await api.put(`/api/resources/${id}`, updates)
        return res.data
    },

    /**
     * Delete a resource by ID
     */
    deleteResource: async (id) => {
        const res = await api.delete(`/api/resources/${id}`)
        return res.data
    },
}

export default resourcesService
