const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/generateToken')
const ApiError = require('../utils/ApiError')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService')
const logger = require('../utils/logger')

/** Build the safe user object returned in responses */
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  githubUsername: user.githubUsername,
  bio: user.bio,
  targetCompany: user.targetCompany,
  isEmailVerified: user.isEmailVerified,
  currentStreak: user.currentStreak,
  longestStreak: user.longestStreak,
  theme: user.theme || 'dark',
  createdAt: user.createdAt,
})

/**
 * @desc    Register — sends verification email (no token returned yet)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, githubUsername } = req.body

    const existing = await User.findOne({ email })
    if (existing) return next(new ApiError('An account with this email already exists', 400))

    const user = await User.create({ name, email, password, githubUsername: githubUsername || '' })
    const rawToken = user.generateEmailVerificationToken()
    await user.save({ validateBeforeSave: false })

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`

    try {
      await sendVerificationEmail(user.email, user.name, verificationUrl)
      return res.status(201).json({
        success: true,
        message: 'Account created! Check your email to verify your account.',
        data: { email: user.email, name: user.name },
      })
    } catch (emailErr) {
      if (process.env.NODE_ENV === 'development') {
        // Auto-verify in dev when no SMTP is configured
        user.isEmailVerified = true
        user.emailVerificationToken = undefined
        user.emailVerificationExpires = undefined
        await user.save({ validateBeforeSave: false })

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)
        setRefreshCookie(res, refreshToken)

        logger.info(`[DEV] Auto-verified: ${user.email}`)
        return res.status(201).json({
          success: true,
          message: 'Account created & auto-verified (dev mode — no SMTP configured).',
          data: { user: sanitizeUser(user), accessToken },
        })
      }
      user.emailVerificationToken = undefined
      user.emailVerificationExpires = undefined
      await user.save({ validateBeforeSave: false })
      return next(new ApiError('Registration succeeded but verification email failed. Try again.', 500))
    }
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Login — returns access token in body + refresh token in httpOnly cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError('Invalid email or password', 401))
    }

    if (!user.isEmailVerified) {
      return next(new ApiError(
        'Please verify your email before logging in. Check your inbox or request a new link.',
        403
      ))
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      data: { user: sanitizeUser(user), accessToken },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Refresh access token using httpOnly cookie
 * @route   POST /api/auth/refresh
 * @access  Public (needs valid refresh cookie)
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return next(new ApiError('No refresh token', 401))

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return next(new ApiError('Invalid or expired refresh token', 401))
    }

    const user = await User.findById(decoded.id)
    if (!user) return next(new ApiError('User not found', 401))

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)
    setRefreshCookie(res, newRefreshToken)

    res.json({ success: true, data: { accessToken: newAccessToken } })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Logout — clears refresh cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  clearRefreshCookie(res)
  res.json({ success: true, message: 'Logged out successfully' })
}

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Verify email
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

    if (!user) return next(new ApiError('Invalid or expired verification token.', 400))

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save({ validateBeforeSave: false })

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      message: 'Email verified! Welcome to DevTrack 🎉',
      data: { user: sanitizeUser(user), accessToken },
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
    if (user.isEmailVerified) return next(new ApiError('Email already verified', 400))

    const rawToken = user.generateEmailVerificationToken()
    await user.save({ validateBeforeSave: false })
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`
    await sendVerificationEmail(user.email, user.name, url)

    res.json({ success: true, message: 'Verification email sent. Check your inbox.' })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      // Silent success — don't reveal if email exists
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
    }

    const rawToken = user.generatePasswordResetToken()
    await user.save({ validateBeforeSave: false })
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl)
      res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
    } catch {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })
      return next(new ApiError('Failed to send reset email. Try again later.', 500))
    }
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Reset password
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

    if (!user) return next(new ApiError('Invalid or expired reset token.', 400))

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    if (!user.isEmailVerified) user.isEmailVerified = true
    await user.save()

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      message: 'Password reset successfully!',
      data: { user: sanitizeUser(user), accessToken },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register, login, logout, refreshToken,
  getMe, verifyEmail, resendVerification,
  forgotPassword, resetPassword,
}
