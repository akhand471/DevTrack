import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Mail, ArrowLeft, Loader } from 'lucide-react'
import api from '../services/api'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('Please enter your email address')
            return
        }

        setLoading(true)
        try {
            await api.post('/api/auth/forgot-password', { email })
            setSent(true)
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.')
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

                {!sent ? (
                    <>
                        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                        <p className="text-gray-400 mb-8 text-sm">
                            Enter the email you registered with. We'll send you a link to reset your password.
                        </p>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
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
                                    <><Loader className="animate-spin" size={18} /> Sending...</>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-primary-400 hover:text-primary-300 inline-flex items-center gap-1">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="text-emerald-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">Check Your Email</h2>
                        <p className="text-gray-400 text-sm">
                            If an account exists for <strong className="text-white">{email}</strong>, we've sent a password reset link. Check your inbox and spam folder.
                        </p>
                        <p className="text-xs text-gray-500">The link expires in 15 minutes.</p>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => { setSent(false); setEmail('') }}
                                className="btn-secondary w-full"
                            >
                                Try Another Email
                            </button>
                            <Link to="/login" className="block text-sm text-primary-400 hover:text-primary-300">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
