import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import analyticsService from '../services/analyticsService'

const Analytics = () => {
  const [topicData, setTopicData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const [topicRes, weeklyRes] = await Promise.all([
          analyticsService.getTopicPerformance(),
          analyticsService.getWeeklyProgress(),
        ])

        if (topicRes.success) setTopicData(topicRes.data)
        if (weeklyRes.success) setWeeklyData(weeklyRes.data)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Calculate weak and strong topics from real data
  const weakTopics = [...topicData]
    .filter(t => t.totalProblems > 0)
    .sort((a, b) => (a.avgDifficulty || 0) - (b.avgDifficulty || 0))
    .slice(0, 3)

  const strongTopics = [...topicData]
    .filter(t => t.totalProblems > 0)
    .sort((a, b) => b.totalProblems - a.totalProblems)
    .slice(0, 3)

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[60vh]">
        <p className="text-primary-500 text-lg">Loading analytics...</p>
      </div>
    )
  }

  const hasData = topicData.length > 0 || weeklyData.length > 0

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Deep insights into your coding practice</p>
      </div>

      {!hasData ? (
        <div className="card-glass rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No analytics data yet</p>
          <p className="text-gray-500 text-sm">Start logging study sessions to see your performance insights here.</p>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic-wise Distribution */}
            {topicData.length > 0 && (
              <div className="card-glass rounded-lg p-8">
                <h2 className="text-xl font-bold mb-6">Problems by Topic</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topicData.filter(t => t.totalProblems > 0).map(t => ({
                        name: t.topic || t._id,
                        value: t.totalProblems,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weekly Progress */}
            {weeklyData.length > 0 && (
              <div className="card-glass rounded-lg p-8">
                <h2 className="text-xl font-bold mb-6">Weekly Productivity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData.map((w, i) => ({
                    week: `Week ${i + 1}`,
                    problems: w.totalProblems || w.problems || 0,
                    hours: Math.round(((w.totalTime || w.time || 0) / 60) * 10) / 10,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="problems"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ fill: '#0ea5e9', r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Weak Topics Analysis */}
          {weakTopics.length > 0 && (
            <div className="card-glass rounded-lg p-8">
              <h2 className="text-xl font-bold mb-6">Topics Needing Improvement 📊</h2>
              <div className="space-y-4">
                {weakTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-dark-800/50 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{item.topic || item._id}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.totalProblems} problems solved</p>
                      </div>
                      <span className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-sm font-medium">
                        {item.totalSessions} sessions
                      </span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-rose-400 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((item.totalProblems / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">💡 Recommendation: Practice more problems in this area</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Performing Topics */}
          {strongTopics.length > 0 && (
            <div className="card-glass rounded-lg p-8">
              <h2 className="text-xl font-bold mb-6">Top Performing Topics ⭐</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strongTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20"
                  >
                    <h3 className="font-semibold text-white mb-2">{item.topic || item._id}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-emerald-400">{item.totalProblems}</span>
                      <span className="text-xs text-gray-500">{item.totalSessions} sessions</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-1 mt-3">
                      <div
                        className="bg-emerald-400 h-1 rounded-full"
                        style={{ width: `${Math.min((item.totalProblems / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Analytics
