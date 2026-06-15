import api from './api'

const goalsService = {
  getGoals: async () => {
    const { data } = await api.get('/api/goals')
    return data
  },

  createGoal: async (goalData) => {
    const { data } = await api.post('/api/goals', goalData)
    return data
  },

  updateGoal: async (id, updates) => {
    const { data } = await api.put(`/api/goals/${id}`, updates)
    return data
  },

  deleteGoal: async (id) => {
    const { data } = await api.delete(`/api/goals/${id}`)
    return data
  },
}

export default goalsService
