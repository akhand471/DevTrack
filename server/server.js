const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Route files
const authRoutes = require('./routes/authRoutes')
const studyRoutes = require('./routes/studyRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const userRoutes = require('./routes/userRoutes')
const goalsRoutes = require('./routes/goalsRoutes')
const resourcesRoutes = require('./routes/resourcesRoutes')

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet()) // Set secure HTTP headers
app.use(mongoSanitize()) // Prevent NoSQL injection attacks

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// Stricter limit on auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts, please try again after 15 minutes.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10kb' })) // Limit payload size

// ── Mount Routers ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/study', studyRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/resources', resourcesRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: '🚀 DevTrack API is running' })
})

// Custom error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})
