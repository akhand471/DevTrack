import api from './api'

const analyticsService = {
    getTopicPerformance: async (category) => {
        const url = category
            ? `/api/analytics/topic-performance?category=${encodeURIComponent(category)}`
            : '/api/analytics/topic-performance'

        const response = await api.get(url)
        return response.data
    },

    getWeeklyProgress: async (weeks = 7) => {
        const response = await api.get(`/api/analytics/weekly-progress?weeks=${weeks}`)
        return response.data
    }
}

export default analyticsService
