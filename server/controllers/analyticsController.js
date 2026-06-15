const StudySession = require('../models/StudySession')

/**
 * @desc    Get aggregated performance stats per topic
 * @route   GET /api/analytics/topic-performance
 * @access  Private
 *
 * Returns: For each topic — total problems solved, total time,
 *          session count, average difficulty breakdown
 */
const getTopicPerformance = async (req, res, next) => {
    try {
        const { category } = req.query

        // Build match stage
        const matchStage = { userId: req.user._id }
        if (category) matchStage.category = category

        const performance = await StudySession.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$topic',
                    category: { $first: '$category' },
                    totalProblems: { $sum: '$problemsSolved' },
                    totalTime: { $sum: '$timeSpent' },
                    sessionCount: { $count: {} },
                    avgProblemsPerSession: { $avg: '$problemsSolved' },
                    difficulties: {
                        $push: '$difficulty',
                    },
                },
            },
            {
                $addFields: {
                    // Calculate difficulty distribution
                    easyCount: {
                        $size: {
                            $filter: {
                                input: '$difficulties',
                                cond: { $eq: ['$$this', 'Easy'] },
                            },
                        },
                    },
                    mediumCount: {
                        $size: {
                            $filter: {
                                input: '$difficulties',
                                cond: { $eq: ['$$this', 'Medium'] },
                            },
                        },
                    },
                    hardCount: {
                        $size: {
                            $filter: {
                                input: '$difficulties',
                                cond: { $eq: ['$$this', 'Hard'] },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    topic: '$_id',
                    category: 1,
                    totalProblems: 1,
                    totalTime: 1,
                    sessionCount: 1,
                    avgProblemsPerSession: { $round: ['$avgProblemsPerSession', 1] },
                    difficultyBreakdown: {
                        easy: '$easyCount',
                        medium: '$mediumCount',
                        hard: '$hardCount',
                    },
                },
            },
            { $sort: { totalProblems: -1 } },
        ])

        // Also calculate overall stats
        const overallStats = await StudySession.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalSessions: { $count: {} },
                    totalProblems: { $sum: '$problemsSolved' },
                    totalTime: { $sum: '$timeSpent' },
                    uniqueTopics: { $addToSet: '$topic' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalSessions: 1,
                    totalProblems: 1,
                    totalTimeMinutes: '$totalTime',
                    totalTimeHours: { $round: [{ $divide: ['$totalTime', 60] }, 1] },
                    uniqueTopicsCount: { $size: '$uniqueTopics' },
                },
            },
        ])

        res.json({
            success: true,
            data: {
                topicPerformance: performance,
                overallStats: overallStats[0] || {
                    totalSessions: 0,
                    totalProblems: 0,
                    totalTimeMinutes: 0,
                    totalTimeHours: 0,
                    uniqueTopicsCount: 0,
                },
            },
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @desc    Get weekly progress for the last N weeks
 * @route   GET /api/analytics/weekly-progress
 * @access  Private
 *
 * Query params:
 *   - weeks: Number of weeks to look back (default: 7)
 *
 * Returns: Per-week aggregation of problems solved, time spent, sessions
 */
const getWeeklyProgress = async (req, res, next) => {
    try {
        const weeks = parseInt(req.query.weeks) || 7
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - weeks * 7)

        const weeklyData = await StudySession.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $isoWeekYear: '$date' },
                        week: { $isoWeek: '$date' },
                    },
                    problemsSolved: { $sum: '$problemsSolved' },
                    timeSpent: { $sum: '$timeSpent' },
                    sessions: { $count: {} },
                    startOfWeek: { $min: '$date' },
                },
            },
            {
                $project: {
                    _id: 0,
                    week: {
                        $concat: [
                            'W',
                            { $toString: '$_id.week' },
                            ' ',
                            { $toString: '$_id.year' },
                        ],
                    },
                    weekNumber: '$_id.week',
                    year: '$_id.year',
                    problemsSolved: 1,
                    timeSpent: 1,
                    timeSpentHours: { $round: [{ $divide: ['$timeSpent', 60] }, 1] },
                    sessions: 1,
                    startOfWeek: 1,
                },
            },
            { $sort: { year: 1, weekNumber: 1 } },
        ])

        // Calculate category breakdown for the period
        const categoryBreakdown = await StudySession.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: '$category',
                    totalProblems: { $sum: '$problemsSolved' },
                    totalTime: { $sum: '$timeSpent' },
                    sessions: { $count: {} },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalProblems: 1,
                    totalTime: 1,
                    sessions: 1,
                },
            },
        ])

        res.json({
            success: true,
            data: {
                weeklyProgress: weeklyData,
                categoryBreakdown,
                period: {
                    from: startDate,
                    to: new Date(),
                    weeks,
                },
            },
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getTopicPerformance, getWeeklyProgress, getSummary, getWeakAreas, getCategoryBreakdown, getRecentActivity }

/**
 * @desc    Dashboard summary stats
 * @route   GET /api/analytics/summary
 */
async function getSummary(req, res, next) {
  try {
    const userId = req.user._id
    const [overall] = await StudySession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSessions: { $count: {} },
          totalProblems: { $sum: '$problemsSolved' },
          totalMinutes: { $sum: '$timeSpent' },
          topics: { $addToSet: '$topic' },
        },
      },
    ])
    const user = await require('../models/User').findById(userId)
    res.json({
      success: true,
      data: {
        totalSessions: overall?.totalSessions ?? 0,
        totalProblems: overall?.totalProblems ?? 0,
        totalHours: overall ? Math.round(overall.totalMinutes / 60 * 10) / 10 : 0,
        uniqueTopics: overall?.topics?.length ?? 0,
        currentStreak: user?.currentStreak ?? 0,
        longestStreak: user?.longestStreak ?? 0,
      },
    })
  } catch (error) { next(error) }
}

/**
 * @desc    Compute weak areas (low problems + high time per session)
 * @route   GET /api/analytics/weak-areas
 */
async function getWeakAreas(req, res, next) {
  try {
    const data = await StudySession.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$topic',
          category: { $first: '$category' },
          sessions: { $count: {} },
          totalProblems: { $sum: '$problemsSolved' },
          totalTime: { $sum: '$timeSpent' },
          avgTime: { $avg: '$timeSpent' },
          avgProblems: { $avg: '$problemsSolved' },
        },
      },
      {
        $addFields: {
          // Weak = high time per problem OR very few problems solved
          efficiencyScore: {
            $cond: [
              { $gt: ['$avgProblems', 0] },
              { $divide: ['$avgProblems', '$avgTime'] },
              0,
            ],
          },
        },
      },
      { $sort: { efficiencyScore: 1 } }, // lowest efficiency first
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          topic: '$_id',
          category: 1,
          sessions: 1,
          totalProblems: 1,
          avgTimeMinutes: { $round: ['$avgTime', 0] },
          avgProblems: { $round: ['$avgProblems', 1] },
          efficiencyScore: { $round: ['$efficiencyScore', 3] },
        },
      },
    ])
    res.json({ success: true, data })
  } catch (error) { next(error) }
}

/**
 * @desc    Category breakdown (pie chart data)
 * @route   GET /api/analytics/category-breakdown
 */
async function getCategoryBreakdown(req, res, next) {
  try {
    const data = await StudySession.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$category',
          sessions: { $count: {} },
          totalProblems: { $sum: '$problemsSolved' },
          totalTime: { $sum: '$timeSpent' },
        },
      },
      { $project: { _id: 0, category: '$_id', sessions: 1, totalProblems: 1, totalTime: 1 } },
      { $sort: { totalProblems: -1 } },
    ])
    res.json({ success: true, data })
  } catch (error) { next(error) }
}

/**
 * @desc    Recent daily activity for heatmap
 * @route   GET /api/analytics/recent-activity
 */
async function getRecentActivity(req, res, next) {
  try {
    const days = parseInt(req.query.days) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)

    const data = await StudySession.aggregate([
      { $match: { userId: req.user._id, date: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          sessions: { $count: {} },
          problems: { $sum: '$problemsSolved' },
          minutes: { $sum: '$timeSpent' },
        },
      },
      { $project: { _id: 0, date: '$_id', sessions: 1, problems: 1, minutes: 1 } },
      { $sort: { date: 1 } },
    ])
    res.json({ success: true, data })
  } catch (error) { next(error) }
}
