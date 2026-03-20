import api from './api'

const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/api/auth/register', userData)
            // In dev mode, a token is returned (auto-verified) — store it
            if (response.data.data?.token) {
                localStorage.setItem('auth_token', response.data.data.token)
            }
            return response.data
        } catch (error) {
            throw new Error(
                error.response?.data?.error || 'Registration failed. Please try again.'
            )
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials)
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('auth_token', response.data.data.token)
            }
            return response.data
        } catch (error) {
            const err = new Error(
                error.response?.data?.error || 'Login failed. Please try again.'
            )
            err.status = error.response?.status
            throw err
        }
    },

    logout: () => {
        localStorage.removeItem('auth_token')
    },

    getMe: async () => {
        const response = await api.get('/api/auth/me')
        return response.data
    },
}

export default authService

