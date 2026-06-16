/**
 * AuthContext.jsx — Production-ready auth state management
 * - Calls real backend API
 * - Stores access token in memory (NOT localStorage) for security
 * - Uses httpOnly cookie for refresh token (handled by browser automatically)
 * - Auto-refreshes access token on 401 responses
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const refreshTimerRef = useRef(null)

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearSession = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
  }, [])

  /** Parse JWT exp field (in seconds) */
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 // convert to ms
    } catch {
      return null
    }
  }

  /** Schedule a proactive token refresh 1 minute before expiry */
  const scheduleRefresh = useCallback((token) => {
    const expiry = getTokenExpiry(token)
    if (!expiry) return
    const delay = expiry - Date.now() - 60_000 // 1 min early
    if (delay <= 0) return silentRefresh()
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = setTimeout(() => silentRefresh(), Math.max(delay, 0))
  }, [])

  /** Call /api/auth/refresh using the httpOnly cookie */
  const silentRefresh = useCallback(async () => {
    try {
      const { data } = await api.post('/api/auth/refresh', {}, { skipAuthRefresh: true })
      if (data?.data?.accessToken) {
        const newToken = data.data.accessToken
        setAccessToken(newToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        scheduleRefresh(newToken)
        return newToken
      }
    } catch {
      clearSession()
    }
    return null
  }, [clearSession, scheduleRefresh])

  // ── Bootstrap: check if session exists on mount ───────────────────────────
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await silentRefresh()
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const { data } = await api.get('/api/auth/me')
          if (data?.data) setUser(data.data)
        }
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
    return () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth Actions ──────────────────────────────────────────────────────────

  const login = async ({ email, password }) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    const { user: userData, accessToken: token } = data.data
    setUser(userData)
    setAccessToken(token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    scheduleRefresh(token)
    return userData
  }

  const register = async (userData) => {
    const { data } = await api.post('/api/auth/register', userData)
    // In dev mode, server auto-verifies and returns a token
    if (data.data?.accessToken) {
      const { user: u, accessToken: token } = data.data
      setUser(u)
      setAccessToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      scheduleRefresh(token)
    }
    return data
  }

  const logout = async () => {
    try { await api.post('/api/auth/logout') } catch { /* ignore */ }
    delete api.defaults.headers.common['Authorization']
    clearSession()
  }

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  /** Used after email verification redirect */
  const setUserFromToken = (userData, token) => {
    setUser(userData)
    if (token) {
      setAccessToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      scheduleRefresh(token)
    }
  }

  const loginAsDemo = async () => {
    try {
      // 1. Try to login with demo credentials
      const { data } = await api.post('/api/auth/login', {
        email: 'demo@devtrack.app',
        password: 'demopassword123',
      })
      const { user: userData, accessToken: token } = data.data
      setUser(userData)
      setAccessToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      scheduleRefresh(token)
      return userData
    } catch (err) {
      // 2. If it fails, register the demo user first
      try {
        await api.post('/api/auth/register', {
          name: 'Demo User',
          email: 'demo@devtrack.app',
          password: 'demopassword123',
        })
        
        // 3. Login now that registration has succeeded
        const { data: loginData } = await api.post('/api/auth/login', {
          email: 'demo@devtrack.app',
          password: 'demopassword123',
        })
        const { user: userData, accessToken: token } = loginData.data
        setUser(userData)
        setAccessToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        scheduleRefresh(token)
        return userData
      } catch (regErr) {
        console.error('Demo login/register failed:', regErr)
        throw regErr
      }
    }
  }

  const value = {
    user,
    loading,
    accessToken,
    login,
    register,
    logout,
    updateUser,
    setUserFromToken,
    silentRefresh,
    loginAsDemo,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
