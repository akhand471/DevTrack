import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token')
            if (token) {
                try {
                    const res = await authService.getMe()
                    if (res.success) {
                        setUser(res.data)
                    } else {
                        localStorage.removeItem('auth_token')
                    }
                } catch (error) {
                    localStorage.removeItem('auth_token')
                }
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const login = async (credentials) => {
        const res = await authService.login(credentials)
        if (res.success) {
            setUser(res.data)
            return res.data
        }
        // Propagate the status code for email-not-verified error (403)
        const err = new Error(res.error || 'Login failed')
        err.status = res.status
        throw err
    }

    // Register — in dev mode auto-logs in; in production shows check-email screen
    const register = async (userData) => {
        const res = await authService.register(userData)
        if (res.success) {
            // Dev mode: backend returns token + user data directly
            if (res.data?.token) {
                setUser(res.data)
            }
            return res
        }
        throw new Error(res.error || 'Registration failed')
    }

    // Called by VerifyEmail.jsx after backend returns the JWT
    const setUserFromToken = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        authService.logout()
        setUser(null)
    }

    const value = { user, loading, login, register, logout, setUserFromToken }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
