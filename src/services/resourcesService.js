import api from './api'

const resourcesService = {
  getResources: async (filters = {}) => {
    const { data } = await api.get('/api/resources', { params: filters })
    return data
  },

  createResource: async (resourceData) => {
    const { data } = await api.post('/api/resources', resourceData)
    return data
  },

  updateResource: async (id, updates) => {
    const { data } = await api.put(`/api/resources/${id}`, updates)
    return data
  },

  deleteResource: async (id) => {
    const { data } = await api.delete(`/api/resources/${id}`)
    return data
  },
}

export default resourcesService
