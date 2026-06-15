const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')

// Route files
const authRoutes = require('./routes/authRoutes')
const studyRoutes = require('./routes/studyRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const userRoutes = require('./routes/userRoutes')
const goalsRoutes = require('./routes/goalsRoutes')
const resourcesRoutes = require('./routes/resourcesRoutes')
const aiRoutes = require('./routes/aiRoutes')

dotenv.config()

// Connect to database first
connectDB()

const app = express()

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(mongoSanitize())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, error: 'Too many auth attempts, please try again later.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ── Core Middleware ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// Dev-only request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Mount Routers ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/study', studyRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/user', userRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 DevTrack API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// Custom error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)

  // ── Daily cron: recalculate streaks at midnight ──────────────────
  try {
    const cron = require('node-cron')
    const User = require('./models/User')

    // Run at 00:01 every day
    cron.schedule('1 0 * * *', async () => {
      logger.info('⏰ Running daily streak maintenance job...')
      try {
        // Break streaks for users who didn't study yesterday
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const endOfYesterday = new Date(yesterday)
        endOfYesterday.setHours(23, 59, 59, 999)

        const StudySession = require('./models/StudySession')
        // Find users who have an active streak but no session yesterday
        const usersWithStreak = await User.find({ currentStreak: { $gt: 0 } })
        let reset = 0
        for (const u of usersWithStreak) {
          const hadSession = await StudySession.exists({
            userId: u._id,
            date: { $gte: yesterday, $lte: endOfYesterday },
          })
          if (!hadSession) {
            u.currentStreak = 0
            await u.save({ validateBeforeSave: false })
            reset++
          }
        }
        logger.info(`✅ Streak job done — reset ${reset} user streaks`)
      } catch (cronErr) {
        logger.error(`Streak cron error: ${cronErr.message}`)
      }
    })
    logger.info('⏰ Daily streak cron job scheduled (00:01 every day)')
  } catch (cronErr) {
    logger.warn(`node-cron not available: ${cronErr.message}`)
  }
})

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE') return // ignore broken pipe
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})
