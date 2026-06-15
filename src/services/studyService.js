import api from './api'

const studyService = {
  /** Log a new study session */
  logSession: async (sessionData) => {
    const { data } = await api.post('/api/study/log-session', sessionData)
    return data
  },

  /** Get sessions with optional filters */
  getSessions: async (filters = {}) => {
    const { data } = await api.get('/api/study/sessions', { params: filters })
    return data
  },

  /** Delete a session by ID */
  deleteSession: async (id) => {
    const { data } = await api.delete(`/api/study/session/${id}`)
    return data
  },
}

export default studyService
