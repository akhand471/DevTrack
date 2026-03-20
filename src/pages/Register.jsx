import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, ArrowRight, Mail, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        githubUsername: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const navigate = useNavigate()
    const { register } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }

        setLoading(true)

        try {
            const { confirmPassword, ...dataToSend } = formData
            const res = await register(dataToSend)

            // Dev mode: token returned → go straight to dashboard
            if (res.data?.token) {
                return navigate('/dashboard')
            }
            // Production: show check-email screen
            setRegisteredEmail(formData.email)
        } catch (err) {
            setError(err.message || 'Failed to register')
        } finally {
            setLoading(false)
        }
    }

    // Show success screen after registration
    if (registeredEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                <div className="card-glass max-w-md w-full p-10 rounded-2xl relative z-10 border border-dark-700/50 text-center space-y-5">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="text-emerald-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Check your inbox!</h2>
                    <p className="text-gray-400">
                        We sent a verification link to <span className="text-emerald-400 font-semibold">{registeredEmail}</span>.
                        Click it to activate your account.
                    </p>
                    <p className="text-sm text-gray-500">The link will expire in 24 hours.</p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-primary-400 font-medium hover:text-primary-300 transition-colors text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

            <div className="card-glass max-w-md w-full p-8 rounded-2xl relative z-10 border border-dark-700/50">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-gradient mb-4">
                        <Code2 size={28} className="text-emerald-500" />
                        <span>DevTrack</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
                    <p className="text-gray-400 mt-2 text-sm">Start tracking your coding journey today</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="input-field py-2"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="input-field py-2"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Username (Optional)</label>
                        <input
                            type="text"
                            name="githubUsername"
                            className="input-field py-2"
                            placeholder="johndoe"
                            value={formData.githubUsername}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="input-field py-2"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="input-field py-2"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary bg-emerald-600 hover:bg-emerald-700 mt-2 py-3 flex justify-center items-center gap-2 group"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
