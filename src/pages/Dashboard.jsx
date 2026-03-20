import React, { useState, useEffect } from 'react'
import dsaSubcategories from '../data/dsaTopics'
import { TrendingUp, BookOpen, Clock, Target, Flame, Award } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import ChartComponent from '../components/ChartComponent'
import HeatmapChart from '../components/HeatmapChart'
import QuickStatsBar from '../components/QuickStatsBar'
import ProgressTracker from '../components/ProgressTracker'
import ComparisonChart from '../components/ComparisonChart'
import { useAuth } from '../context/AuthContext'
import analyticsService from '../services/analyticsService'
import studyService from '../services/studyService'
import goalsService from '../services/goalsService'

const Dashboard = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState({
    totalProblems: 0,
    totalTimeHours: 0,
    uniqueTopicsCount: 0,
    totalSessions: 0
  })
  const [topicPerformance, setTopicPerformance] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [recentSessions, setRecentSessions] = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [goalsStats, setGoalsStats] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all needed data in parallel
        const [perfRes, progressRes, sessionsRes, allSessionsRes, goalsRes] = await Promise.all([
          analyticsService.getTopicPerformance(),
          analyticsService.getWeeklyProgress(),
          studyService.getSessions({ limit: 4 }), // Get 4 most recent
          studyService.getSessions(), // Get all sessions for heatmap
          goalsService.getGoals() // Get goals for quick stats
        ])

        if (perfRes.success) {
          setStatsData(perfRes.data.overallStats)
          setTopicPerformance(perfRes.data.topicPerformance.slice(0, 4)) // Top 4
        }

        if (progressRes.success) {
          // Calculate category percentages
          const totalCatProblems = progressRes.data.categoryBreakdown.reduce((acc, curr) => acc + curr.totalProblems, 0)

          const breakdown = progressRes.data.categoryBreakdown.map(cat => ({
            name: cat.category,
            problems: cat.totalProblems,
            percentage: totalCatProblems ? Math.round((cat.totalProblems / totalCatProblems) * 100) : 0,
            color: cat.category === 'DSA' ? 'bg-blue-500' : cat.category === 'Core CS' ? 'bg-purple-500' : 'bg-green-500'
          }))

          setCategoryBreakdown(breakdown.sort((a, b) => b.problems - a.problems))
          setWeeklyProgress(progressRes.data.weeklyProgress || progressRes.data)
        }

        if (sessionsRes.success) {
          setRecentSessions(sessionsRes.data)
        }

        if (allSessionsRes.success) {
          setAllSessions(allSessionsRes.data)
        }

        if (goalsRes.success) {
          const goals = goalsRes.data
          const completed = goals.filter(g => g.status === 'Completed').length
          setGoalsStats({ completed, total: goals.length })
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Map to the format StatsCard expects
  const stats = [
    {
      icon: BookOpen,
      label: 'Total Units Studied',
      value: statsData.totalProblems.toString(),
      change: 'Lifetime progress',
      color: 'primary',
    },
    {
      icon: Clock,
      label: 'Study Hours',
      value: statsData.totalTimeHours.toString(),
      change: 'Lifetime progress',
      color: 'emerald',
    },
    {
      icon: Target,
      label: 'Sessions Logged',
      value: statsData.totalSessions.toString(),
      change: 'Keep going!',
      color: 'amber',
    },
    {
      icon: Flame,
      label: 'Topics Covered',
      value: statsData.uniqueTopicsCount.toString(),
      change: 'Broaden your knowledge',
      color: 'rose',
    },
  ]

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[500px]">
        <div className="text-xl text-primary-500 animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Developer'}! 👋</h1>
        <p className="text-gray-400">Track your coding progress and level up your interview skills</p>
      </div>

      {/* Quick Stats Bar */}
      <QuickStatsBar stats={{
        streak: user?.currentStreak || 0,
        goalsCompleted: goalsStats.completed,
        totalGoals: goalsStats.total,
        weakAreas: topicPerformance.filter(t => (t.avgDifficulty || 0) < 2).length || 0
      }} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <div className="lg:col-span-2 card-glass rounded-lg p-6">
          <ChartComponent data={
            Array.isArray(weeklyProgress)
              ? weeklyProgress.map((w, i) => ({
                day: `Week ${i + 1}`,
                problems: w.totalProblems || w.problems || 0
              }))
              : []
          } />
        </div>

        {/* Category Breakdown */}
        <div className="card-glass rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Study Breakdown</h2>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.problems} units ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No data yet. Log some sessions!</p>
          )}
        </div>
      </div>

      {/* Top Topics Section */}
      <div className="card-glass rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Top Performing Topics</h2>
        {topicPerformance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-in">
            {topicPerformance.map((item, idx) => {
              // Calculate percentage based on max problems across all top topics
              const maxProblems = Math.max(...topicPerformance.map(t => t.totalProblems)) || 1
              const percentage = Math.round((item.totalProblems / maxProblems) * 100)

              return (
                <div key={idx} className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50 card-hover">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white truncate pr-2">{item.topic}</h3>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${item.category === 'DSA'
                        ? 'bg-blue-500/20 text-blue-400'
                        : item.category === 'Core CS'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-green-500/20 text-green-400'
                        }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.totalProblems} units</p>
                  <div className="w-full bg-dark-700 rounded-full h-1">
                    <div
                      className="bg-primary-500 h-1 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">Log some study sessions to see your top topics here.</p>
        )}
      </div>

      {/* DSA Topic Breakdown */}
      <div className="card-glass rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">DSA Topic Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {dsaSubcategories.map((sub, idx) => (
            <div key={idx} className="bg-dark-800/50 rounded-lg p-4 border border-dark-700/50 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{sub.icon}</span>
                <h3 className="font-semibold text-white text-sm">{sub.name}</h3>
                <span className="ml-auto text-xs text-gray-500">{sub.topics.length} topics</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sub.topics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-2 py-1 rounded-full bg-primary-500/10 text-primary-400/80 border border-primary-500/20"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Chart */}
      <ComparisonChart data={topicPerformance} />

      {/* Coding Heatmap */}
      <HeatmapChart sessions={allSessions} />

      {/* Learning Path & Progress Tracker */}
      <ProgressTracker />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="card-glass rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Study Sessions</h2>
          {recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-dark-800/50 rounded-lg border border-dark-700/30 hover:border-primary-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{session.topic}</h3>
                      <p className="text-xs text-gray-500">{session.platform}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${session.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : session.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                        }`}
                    >
                      {session.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{session.problemsSolved || session.problems} units</span>
                    <span>{session.timeSpent || session.time} min</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No recent sessions.</p>
          )}
        </div>

        {/* Achievements */}
        <div className="card-glass rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Achievements 🏆</h2>
          <div className="space-y-4">
            {[
              { icon: '🔥', title: 'Start the Fire', desc: '1 day streak', earned: (user?.currentStreak || 0) >= 1 },
              { icon: '⭐', title: 'First Steps', desc: 'Solved 10 problems', earned: statsData.totalProblems >= 10 },
              { icon: '⚡', title: 'Speed Demon', desc: 'Solved 50 problems', earned: statsData.totalProblems >= 50 },
              { icon: '🎯', title: 'Consistency King', desc: '30-day streak', earned: (user?.longestStreak || 0) >= 30 },
            ].map((achievement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg flex items-start gap-3 transition-colors ${achievement.earned
                  ? 'bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20'
                  : 'bg-dark-800/30 border border-dark-700/30 opacity-50'
                  }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">{achievement.title}</h3>
                  <p className="text-xs text-gray-500">{achievement.desc}</p>
                  {achievement.earned && <p className="text-xs text-emerald-400 mt-1">✓ Earned!</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
