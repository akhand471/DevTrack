import React, { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Code2, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setUserFromToken } = useAuth()

    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(token ? 'form' : 'error') // 'form' | 'success' | 'error'
    const [error, setError] = useState(token ? '' : 'No reset token found. Please request a new password reset link.')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/api/auth/reset-password', { token, password })

            if (res.data.success) {
                // Auto-login
                const { token: jwt, ...userData } = res.data.data
                localStorage.setItem('auth_token', jwt)
                setUserFromToken(userData)

                setStatus('success')
                setTimeout(() => navigate('/dashboard'), 2500)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.')
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />

            <div className="card-glass max-w-md w-full p-10 rounded-2xl border border-dark-700/50 relative z-10 fade-in">
                <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-gradient mb-8">
                    <Code2 size={24} className="text-primary-500" />
                    <span>DevTrack</span>
                </Link>

                {status === 'form' && (
                    <>
                        <h2 className="text-2xl font-bold mb-2">Set New Password</h2>
                        <p className="text-gray-400 mb-8 text-sm">
                            Choose a strong password — at least 8 characters.
                        </p>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className="input-field pl-10 pr-10"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className="input-field pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader className="animate-spin" size={18} /> Resetting...</>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    </>
                )}

                {status === 'success' && (
                    <div className="text-center space-y-4">
                        <CheckCircle className="mx-auto text-emerald-500" size={64} />
                        <h2 className="text-2xl font-bold">Password Reset! 🎉</h2>
                        <p className="text-gray-400">Your password has been updated successfully.</p>
                        <p className="text-sm text-primary-400 animate-pulse">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center space-y-5">
                        <XCircle className="mx-auto text-red-500" size={64} />
                        <h2 className="text-2xl font-bold">Reset Failed</h2>
                        <p className="text-gray-400">{error}</p>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link to="/forgot-password" className="btn-primary text-center">
                                Request New Link
                            </Link>
                            <Link to="/login" className="text-sm text-primary-400 hover:text-primary-300">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
