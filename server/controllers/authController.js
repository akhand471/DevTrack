const crypto = require('crypto')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const ApiError = require('../utils/ApiError')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService')

/**
 * @desc    Register user — sends verification email (no JWT yet)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, githubUsername } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return next(new ApiError('An account with this email already exists', 400))
        }

        const user = await User.create({
            name,
            email,
            password,
            githubUsername: githubUsername || '',
        })

        // Generate and store hashed verification token
        const rawToken = user.generateEmailVerificationToken()
        await user.save({ validateBeforeSave: false })

        // Build the verification URL
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}`

        try {
            await sendVerificationEmail(user.email, user.name, verificationUrl)

            res.status(201).json({
                success: true,
                message: 'Account created! Please check your email to verify your account.',
                data: { email: user.email, name: user.name },
            })
        } catch (emailErr) {
            // DEV MODE: auto-verify if email sending fails
            if (process.env.NODE_ENV === 'development') {
                user.isEmailVerified = true
                user.emailVerificationToken = undefined
                user.emailVerificationExpires = undefined
                await user.save({ validateBeforeSave: false })

                const token = generateToken(user._id)

                return res.status(201).json({
                    success: true,
                    message: 'Account created! (Dev mode: auto-verified, no email needed)',
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        githubUsername: user.githubUsername,
                        isEmailVerified: true,
                        currentStreak: user.currentStreak,
                        longestStreak: user.longestStreak,
                        token,
                    },
                })
            }

            // PRODUCTION: fail cleanly
            user.emailVerificationToken = undefined
            user.emailVerificationExpires = undefined
            await user.save({ validateBeforeSave: false })
            return next(new ApiError('Registration succeeded but verification email failed to send. Please try again.', 500))
        }
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Verify email with token from the email link
 * @route   GET /api/auth/verify-email?token=xxx
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query
        if (!token) return next(new ApiError('Verification token is missing', 400))

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() },
        }).select('+emailVerificationToken +emailVerificationExpires')

        if (!user) {
            return next(new ApiError('Invalid or expired verification token. Please request a new one.', 400))
        }

        user.isEmailVerified = true
        user.emailVerificationToken = undefined
        user.emailVerificationExpires = undefined
        await user.save({ validateBeforeSave: false })

        const jwtToken = generateToken(user._id)

        res.json({
            success: true,
            message: 'Email verified! Welcome to DevTrack 🎉',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                isEmailVerified: true,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                token: jwtToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpires')

        if (!user) return next(new ApiError('No account found with this email', 404))
        if (user.isEmailVerified) return next(new ApiError('This email is already verified', 400))

        const rawToken = user.generateEmailVerificationToken()
        await user.save({ validateBeforeSave: false })

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}`
        await sendVerificationEmail(user.email, user.name, verificationUrl)

        res.json({ success: true, message: 'Verification email resent. Please check your inbox.' })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Login user — requires email to be verified first
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select('+password')
        if (!user) return next(new ApiError('Invalid email or password', 401))

        const isMatch = await user.matchPassword(password)
        if (!isMatch) return next(new ApiError('Invalid email or password', 401))

        if (!user.isEmailVerified) {
            return next(new ApiError('Please verify your email address before logging in. Check your inbox or request a new verification email.', 403))
        }

        const token = generateToken(user._id)

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                isEmailVerified: user.isEmailVerified,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                token,
            },
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        res.json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Request password reset — sends reset email with token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            // Don't reveal whether email exists — always return success
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            })
        }

        const rawToken = user.generatePasswordResetToken()
        await user.save({ validateBeforeSave: false })

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`

        try {
            await sendPasswordResetEmail(user.email, user.name, resetUrl)

            res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            })
        } catch (emailErr) {
            // Clear the token if email fails
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })

            return next(new ApiError('Failed to send reset email. Please try again later.', 500))
        }
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Reset password using token from email
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body

        if (!token) return next(new ApiError('Reset token is required', 400))
        if (!password || password.length < 8) {
            return next(new ApiError('Password must be at least 8 characters', 400))
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        }).select('+passwordResetToken +passwordResetExpires +password')

        if (!user) {
            return next(new ApiError('Invalid or expired reset token. Please request a new one.', 400))
        }

        // Set new password (will be hashed by pre-save hook)
        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        // Also verify email if not already (they proved ownership of the email)
        if (!user.isEmailVerified) {
            user.isEmailVerified = true
            user.emailVerificationToken = undefined
            user.emailVerificationExpires = undefined
        }

        await user.save()

        const jwtToken = generateToken(user._id)

        res.json({
            success: true,
            message: 'Password has been reset successfully!',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                isEmailVerified: true,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                token: jwtToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, getMe, verifyEmail, resendVerification, forgotPassword, resetPassword }
