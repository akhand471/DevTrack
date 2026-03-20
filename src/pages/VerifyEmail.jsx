import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader, Code2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const { setUserFromToken } = useAuth()

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token')
            if (!token) {
                setStatus('error')
                setMessage('No verification token found. Please check your email link.')
                return
            }

            try {
                const res = await api.get(`/api/auth/verify-email?token=${token}`)

                if (res.data.success) {
                    // Store JWT and log user in automatically
                    const { token: jwt, ...userData } = res.data.data
                    localStorage.setItem('auth_token', jwt)
                    setUserFromToken(userData)

                    setStatus('success')
                    setMessage(res.data.message || 'Email verified successfully!')

                    // Redirect to dashboard after 2.5s
                    setTimeout(() => navigate('/dashboard'), 2500)
                }
            } catch (err) {
                setStatus('error')
                setMessage(
                    err.response?.data?.error ||
                    'This verification link has expired or is invalid. Please request a new one.'
                )
            }
        }

        verifyToken()
    }, [searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />

            <div className="card-glass max-w-md w-full p-10 rounded-2xl text-center border border-dark-700/50 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-gradient mb-8">
                    <Code2 size={24} className="text-primary-500" />
                    <span>DevTrack</span>
                </Link>

                {status === 'loading' && (
                    <div className="space-y-4">
                        <Loader className="mx-auto text-primary-500 animate-spin" size={52} />
                        <p className="text-xl font-semibold">Verifying your email...</p>
                        <p className="text-gray-400 text-sm">Please wait while we activate your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle className="mx-auto text-emerald-500" size={64} />
                        <p className="text-2xl font-bold text-white">You're verified! 🎉</p>
                        <p className="text-gray-400">{message}</p>
                        <p className="text-sm text-primary-400 animate-pulse">Redirecting to your dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-5">
                        <XCircle className="mx-auto text-red-500" size={64} />
                        <p className="text-2xl font-bold text-white">Verification Failed</p>
                        <p className="text-gray-400">{message}</p>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link to="/login" className="btn-primary text-center">
                                Back to Login
                            </Link>
                            <p className="text-xs text-gray-500">
                                Need a new link? Go to login and tap "Resend verification email".
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
