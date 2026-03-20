const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

/**
 * User Schema
 * Stores developer account information with email verification & streak tracking
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        githubUsername: {
            type: String,
            trim: true,
            default: '',
        },
        bio: {
            type: String,
            trim: true,
            default: '',
            maxlength: [250, 'Bio cannot exceed 250 characters'],
        },
        targetCompany: {
            type: String,
            trim: true,
            default: '',
        },

        // ── Email Verification ────────────────────────────────────────────
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        emailVerificationExpires: {
            type: Date,
            select: false,
        },

        // ── Password Reset ────────────────────────────────────────────────
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },

        // ── Study Streak ──────────────────────────────────────────────────
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        lastStudyDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

/**
 * Pre-save hook: Hash password before saving
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

/**
 * Compare entered password with hashed password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

/**
 * Generate email verification token (raw token returned, hashed version stored)
 */
userSchema.methods.generateEmailVerificationToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex')

    // Store hashed version in DB for security
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex')

    // Token expires in 24 hours
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000

    return rawToken // Return plain token (sent in email)
}

/**
 * Generate password reset token (raw token returned, hashed version stored)
 * Expires in 15 minutes
 */
userSchema.methods.generatePasswordResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex')

    // Token expires in 15 minutes
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000

    return rawToken
}

/**
 * Update study streak based on the last study date
 */
userSchema.methods.updateStreak = function () {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!this.lastStudyDate) {
        // First session ever
        this.currentStreak = 1
    } else {
        const lastDate = new Date(this.lastStudyDate)
        lastDate.setHours(0, 0, 0, 0)

        const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            // Already studied today — no change to streak
        } else if (diffDays === 1) {
            // Consecutive day — increment streak
            this.currentStreak += 1
        } else {
            // Streak broken
            this.currentStreak = 1
        }
    }

    // Update longest streak if needed
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak
    }

    this.lastStudyDate = new Date()
}

module.exports = mongoose.model('User', userSchema)
