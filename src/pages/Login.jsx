import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, ArrowRight, Mail, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showResend, setShowResend] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setShowResend(false)
        setLoading(true)

        try {
            await login(formData)
            navigate('/dashboard')
        } catch (err) {
            const msg = err.message || 'Failed to login'
            setError(msg)
            // Show "Resend verification" button if user's email is not yet verified
            if (msg.toLowerCase().includes('verify your email') || err.status === 403) {
                setShowResend(true)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendVerification = async () => {
        setResendLoading(true)
        setResendSuccess('')
        try {
            await api.post('/api/auth/resend-verification', { email: formData.email })
            setResendSuccess('Verification email sent! Check your inbox.')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend. Try again later.')
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />

            <div className="card-glass max-w-md w-full p-8 rounded-2xl relative z-10 border border-dark-700/50">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-gradient mb-4">
                        <Code2 size={28} className="text-primary-500" />
                        <span>DevTrack</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
                    <p className="text-gray-400 mt-2 text-sm">Sign in to track your coding journey</p>
                </div>

                {/* Generic error */}
                {error && !showResend && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Email-not-verified banner */}
                {showResend && (
                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
                        <div className="flex items-start gap-3">
                            <Mail className="text-amber-400 mt-0.5 shrink-0" size={18} />
                            <p className="text-amber-300 text-sm">{error}</p>
                        </div>
                        {resendSuccess ? (
                            <p className="text-emerald-400 text-sm font-medium pl-7">{resendSuccess}</p>
                        ) : (
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || !formData.email}
                                className="ml-7 flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors disabled:opacity-50"
                            >
                                <RefreshCw size={14} className={resendLoading ? 'animate-spin' : ''} />
                                {resendLoading ? 'Sending...' : 'Resend verification email'}
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="input-field"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 flex justify-center items-center gap-2 group"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
