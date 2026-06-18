import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, ArrowRight, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login, loginAsDemo } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(formData)
            navigate('/dashboard')
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to login. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = () => {
        loginAsDemo()
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />

            <div className="card-glass max-w-md w-full p-8 rounded-2xl relative z-10 border border-dark-700/50 fade-in">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-gradient mb-4">
                        <Code2 size={28} className="text-primary-500" />
                        <span>DevTrack</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
                    <p className="text-gray-400 mt-2 text-sm">Sign in to track your coding journey</p>
                </div>

                {/* Demo Login Button */}
                <button
                    onClick={handleDemoLogin}
                    id="demo-login-btn"
                    className="w-full mb-6 py-3 px-6 flex items-center justify-center gap-3 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] group"
                >
                    <Zap size={18} className="group-hover:animate-pulse" />
                    Try Demo — No signup needed
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-dark-700" />
                    <span className="text-xs text-gray-500 font-medium">or sign in</span>
                    <div className="flex-1 h-px bg-dark-700" />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
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
                        className="w-full btn-secondary py-3 flex justify-center items-center gap-2 group"
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
