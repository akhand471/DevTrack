const { z } = require('zod')

/**
 * Zod validation middleware factory.
 * Usage: validate(z.object({ ... }))
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(err)
  }
}

// ── Schemas ──────────────────────────────────────────────────────────────────
const schemas = {
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    githubUsername: z.string().max(40).optional(),
  }),

  login: z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),

  forgotPassword: z.object({
    email: z.string().email('Please provide a valid email'),
  }),

  resetPassword: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),

  logSession: z.object({
    topic: z.string().min(1, 'Topic is required').max(100),
    category: z.enum(['DSA', 'Core CS', 'Tech Stack', 'System Design', 'Behavioral']),
    platform: z.string().max(50).optional(),
    problemsSolved: z.number().int().min(0).max(500).optional().default(0),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    timeSpent: z.number().min(0).max(1440, 'Max 24 hours').optional().default(0),
    date: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),

  createGoal: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    targetDate: z.string().optional(),
    category: z.string().max(50).optional(),
  }),

  createResource: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    url: z.string().url('Please provide a valid URL').optional().or(z.literal('')),
    type: z.enum(['article', 'video', 'book', 'course', 'other']).optional(),
    category: z.string().max(50).optional(),
    notes: z.string().max(500).optional(),
  }),
}

module.exports = { validate, schemas }
