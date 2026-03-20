import api from './api'

const studyService = {
    logSession: async (sessionData) => {
        const response = await api.post('/api/study/log-session', sessionData)
        return response.data
    },

    getSessions: async (filters = {}) => {
        // Convert filter object to query string points
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
        })

        const queryString = params.toString()
        const url = queryString ? `/api/study/sessions?${queryString}` : '/api/study/sessions'

        const response = await api.get(url)
        return response.data
    },

    deleteSession: async (id) => {
        const response = await api.delete(`/api/study/session/${id}`)
        return response.data
    }
}

export default studyService
