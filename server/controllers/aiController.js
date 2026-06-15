const StudySession = require('../models/StudySession')
const SpacedRep = require('../models/SpacedRep')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const logger = require('../utils/logger')

// OpenAI is optional — graceful fallback if key not provided
let openai = null
try {
  if (process.env.OPENAI_API_KEY) {
    const { OpenAI } = require('openai')
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
} catch { /* openai package missing — fallback mode */ }

/** Build a rich profile from the user's session history */
async function buildUserProfile(userId) {
  const [sessions, dueTopics, user] = await Promise.all([
    StudySession.find({ userId }).sort('-date').limit(50).lean(),
    SpacedRep.find({ userId, nextReview: { $lte: new Date() } }).sort('nextReview').limit(10).lean(),
    User.findById(userId).lean(),
  ])

  // Aggregate per-topic stats
  const topicMap = {}
  for (const s of sessions) {
    if (!topicMap[s.topic]) {
      topicMap[s.topic] = { sessions: 0, problems: 0, minutes: 0, difficulties: [], category: s.category }
    }
    topicMap[s.topic].sessions += 1
    topicMap[s.topic].problems += s.problemsSolved || 0
    topicMap[s.topic].minutes += s.timeSpent || 0
    topicMap[s.topic].difficulties.push(s.difficulty)
  }

  // Find weak areas: high time per problem OR mostly hard attempts
  const weakAreas = Object.entries(topicMap)
    .filter(([, v]) => {
      const hardRatio = v.difficulties.filter((d) => d === 'Hard').length / v.difficulties.length
      const timePerProblem = v.problems > 0 ? v.minutes / v.problems : 999
      return hardRatio > 0.6 || timePerProblem > 40 || v.problems === 0
    })
    .map(([topic, v]) => ({ topic, category: v.category, sessions: v.sessions }))
    .slice(0, 5)

  // Days studied this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekSessions = sessions.filter((s) => new Date(s.date) >= weekStart)

  return {
    user: { name: user?.name, streak: user?.currentStreak || 0, targetCompany: user?.targetCompany || '' },
    totalSessions: sessions.length,
    weekSessions: weekSessions.length,
    dueForReview: dueTopics.map((t) => t.topic),
    weakAreas,
    recentTopics: sessions.slice(0, 5).map((s) => s.topic),
    categoryDistribution: sessions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1; return acc
    }, {}),
  }
}

/** Heuristic recommendations when OpenAI is unavailable */
function heuristicRecommendations(profile) {
  const recs = []

  if (profile.dueForReview.length > 0) {
    recs.push({
      type: 'review',
      priority: 'high',
      title: `Review: ${profile.dueForReview[0]}`,
      reason: 'Due for spaced repetition — reviewing now will strengthen long-term retention.',
      action: `Practice ${profile.dueForReview[0]} for 20–30 minutes`,
      timeEstimate: '20–30 min',
    })
  }

  if (profile.weakAreas.length > 0) {
    const wa = profile.weakAreas[0]
    recs.push({
      type: 'weak_area',
      priority: 'high',
      title: `Strengthen: ${wa.topic}`,
      reason: 'You spend a lot of time per problem here — focused practice will improve efficiency.',
      action: `Solve 3 easy/medium problems on ${wa.topic}`,
      timeEstimate: '45 min',
    })
  }

  const cats = profile.categoryDistribution
  const allCats = ['DSA', 'Core CS', 'Tech Stack']
  const neglected = allCats.filter((c) => !cats[c] || cats[c] < 2)
  if (neglected.length > 0) {
    recs.push({
      type: 'balance',
      priority: 'medium',
      title: `Explore: ${neglected[0]}`,
      reason: `You haven't practiced ${neglected[0]} recently. Balanced prep is key for interviews.`,
      action: `Dedicate 1 session to ${neglected[0]} this week`,
      timeEstimate: '30–60 min',
    })
  }

  if (profile.weekSessions < 3) {
    recs.push({
      type: 'consistency',
      priority: 'medium',
      title: 'Build consistency this week',
      reason: `Only ${profile.weekSessions} session${profile.weekSessions !== 1 ? 's' : ''} this week. Aim for 5–7 to build momentum.`,
      action: 'Log at least 1 session per day for the next 3 days',
      timeEstimate: '30 min/day',
    })
  }

  if (profile.user.streak >= 3) {
    recs.push({
      type: 'challenge',
      priority: 'low',
      title: 'Level up: try a Hard problem',
      reason: `You're on a ${profile.user.streak}-day streak 🔥 — you're ready for a challenge!`,
      action: 'Pick a Hard LeetCode problem in your strongest topic',
      timeEstimate: '60 min',
    })
  }

  return recs.slice(0, 4)
}

/**
 * @desc    AI-powered study recommendations
 * @route   POST /api/ai/recommend
 * @access  Private
 */
const getRecommendations = async (req, res, next) => {
  try {
    const profile = await buildUserProfile(req.user._id)
    let recommendations = []
    let source = 'heuristic'

    if (openai) {
      try {
        const prompt = `You are an expert coding interview coach. Based on this developer's study profile, give exactly 4 concise, actionable study recommendations. Return ONLY a valid JSON array of objects with keys: type, priority (high/medium/low), title, reason, action, timeEstimate.

Profile:
- Name: ${profile.user.name}
- Current streak: ${profile.user.streak} days
- Target company: ${profile.user.targetCompany || 'Not specified'}
- Total sessions: ${profile.totalSessions}
- Sessions this week: ${profile.weekSessions}
- Category distribution: ${JSON.stringify(profile.categoryDistribution)}
- Weak areas (need improvement): ${profile.weakAreas.map((w) => w.topic).join(', ') || 'None identified'}
- Topics due for review (spaced repetition): ${profile.dueForReview.join(', ') || 'None'}
- Recent topics studied: ${profile.recentTopics.join(', ')}

Be specific, encouraging, and practical.`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
          response_format: { type: 'json_object' },
        })

        const raw = completion.choices[0].message.content
        const parsed = JSON.parse(raw)
        recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || []
        source = 'openai'
      } catch (aiErr) {
        logger.warn(`OpenAI failed, using heuristic: ${aiErr.message}`)
        recommendations = heuristicRecommendations(profile)
      }
    } else {
      recommendations = heuristicRecommendations(profile)
    }

    res.json({
      success: true,
      source,
      data: { recommendations, profile: { ...profile, user: { name: profile.user.name, streak: profile.user.streak } } },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get topics due for review (quick summary for dashboard)
 * @route   GET /api/ai/due-reviews
 * @access  Private
 */
const getDueReviews = async (req, res, next) => {
  try {
    const now = new Date()
    const due = await SpacedRep.find({ userId: req.user._id, nextReview: { $lte: now } })
      .sort('nextReview')
      .limit(parseInt(req.query.limit) || 5)
      .lean()

    res.json({
      success: true,
      count: due.length,
      data: due.map((t) => ({
        topic: t.topic,
        category: t.category,
        daysOverdue: Math.max(0, Math.floor((now - new Date(t.nextReview)) / 86400000)),
        interval: t.interval,
        totalSessions: t.totalSessions,
        lastReviewed: t.lastReviewed,
      })),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all spaced-rep topic records for the user
 * @route   GET /api/ai/topics
 * @access  Private
 */
const getAllTopics = async (req, res, next) => {
  try {
    const topics = await SpacedRep.find({ userId: req.user._id })
      .sort('-totalSessions')
      .lean()

    const now = new Date()
    res.json({
      success: true,
      data: topics.map((t) => ({
        topic: t.topic,
        category: t.category,
        totalSessions: t.totalSessions,
        totalProblems: t.totalProblems,
        avgDifficulty: Math.round(t.avgDifficulty * 10) / 10,
        easinessFactor: Math.round(t.easinessFactor * 100) / 100,
        nextReview: t.nextReview,
        daysUntilReview: Math.ceil((new Date(t.nextReview) - now) / 86400000),
        isDue: new Date(t.nextReview) <= now,
        lastReviewed: t.lastReviewed,
      })),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRecommendations, getDueReviews, getAllTopics }
