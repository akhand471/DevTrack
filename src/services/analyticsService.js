import api from './api'

const analyticsService = {
  getSummary: async () => {
    const { data } = await api.get('/api/analytics/summary')
    return data
  },

  getTopicPerformance: async () => {
    const { data } = await api.get('/api/analytics/topic-performance')
    return data
  },

  getWeeklyProgress: async () => {
    const { data } = await api.get('/api/analytics/weekly-progress')
    return data
  },

  getWeakAreas: async () => {
    const { data } = await api.get('/api/analytics/weak-areas')
    return data
  },

  getCategoryBreakdown: async () => {
    const { data } = await api.get('/api/analytics/category-breakdown')
    return data
  },

  getRecentActivity: async (days = 30) => {
    const { data } = await api.get('/api/analytics/recent-activity', { params: { days } })
    return data
  },
}

export default analyticsService
