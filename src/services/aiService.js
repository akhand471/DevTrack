import api from './api'

const aiService = {
  /** Get personalized AI recommendations */
  getRecommendations: async () => {
    const { data } = await api.post('/api/ai/recommend')
    return data
  },

  /** Get topics due for spaced-rep review */
  getDueReviews: async (limit = 5) => {
    const { data } = await api.get('/api/ai/due-reviews', { params: { limit } })
    return data
  },

  /** Get all tracked topics with SM-2 scores */
  getAllTopics: async () => {
    const { data } = await api.get('/api/ai/topics')
    return data
  },
}

export default aiService
