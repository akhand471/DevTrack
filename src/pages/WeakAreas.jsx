import React, { useState, useEffect } from 'react'
import { AlertCircle, TrendingDown, Zap, CheckCircle, Book, Clock, Loader } from 'lucide-react'
import analyticsService from '../services/analyticsService'

const WeakAreasPage = () => {
  const [weakAreas, setWeakAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchWeakAreas = async () => {
      try {
        setLoading(true)
        const res = await analyticsService.getWeakAreas()
        if (res?.success) {
          setWeakAreas(res.data || [])
          if (res.data?.length > 0) setSelectedArea(res.data[0])
        } else {
          setError('Failed to load weak areas data.')
        }
      } catch (err) {
        setError('Failed to load weak areas data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeakAreas()
  }, [])

  const categories = ['All', 'DSA', 'Core CS', 'Tech Stack']

  const severityColors = {
    Critical: 'text-red-400 bg-red-500/20 border-red-500/30',
    High: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    Medium: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    Low: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  }

  const filteredAreas = weakAreas.filter(area =>
    selectedCategory === 'All' || area.category === selectedCategory
  )

  const criticalCount = weakAreas.filter(a => a.severity === 'Critical').length
  const avgAccuracy = weakAreas.length
    ? Math.round(weakAreas.reduce((sum, a) => sum + (a.accuracy || 0), 0) / weakAreas.length)
    : 0

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-primary-400">
          <Loader size={24} className="animate-spin" />
          <span className="text-lg">Analysing your study sessions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Weak Areas Analysis 🔍</h1>
        <p className="text-gray-400">Identify your weak spots and get targeted improvement plans</p>
      </div>

      {error && (
        <div className="card-glass rounded-lg p-4 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass rounded-lg p-6 border-red-500/30">
          <AlertCircle className="text-red-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Critical Weak Areas</p>
          <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
        </div>

        <div className="card-glass rounded-lg p-6 border-primary-500/30">
          <TrendingDown className="text-primary-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Total Weak Topics</p>
          <p className="text-3xl font-bold">{weakAreas.length}</p>
        </div>

        <div className="card-glass rounded-lg p-6 border-emerald-500/30">
          <Zap className="text-emerald-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Average Accuracy</p>
          <p className="text-3xl font-bold text-emerald-400">{avgAccuracy}%</p>
        </div>
      </div>

      {weakAreas.length === 0 ? (
        /* ── Empty State ─────────────────────────────────────── */
        <div className="card-glass rounded-xl p-12 text-center space-y-4">
          <CheckCircle size={48} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">No weak areas detected yet</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Weak areas are automatically identified after you log study sessions with difficulty ratings.
            Log at least a few sessions to see your personal analysis here.
          </p>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Filter by Category</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weak Areas List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-lg font-bold mb-4">Areas to Focus ({filteredAreas.length})</h2>
              {filteredAreas.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No weak areas in this category yet.</p>
              ) : (
                filteredAreas.map(area => (
                  <button
                    key={area._id || area.topic}
                    onClick={() => setSelectedArea(area)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedArea?._id === area._id || selectedArea?.topic === area.topic
                        ? 'card-glass border-primary-500/50 ring-2 ring-primary-500/30'
                        : 'card-glass hover:border-primary-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{area.topic}</h3>
                      {area.severity && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium border ${severityColors[area.severity] || severityColors.Low}`}
                        >
                          {area.severity}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (area.accuracy || 0) >= 70
                            ? 'bg-emerald-500'
                            : (area.accuracy || 0) >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${area.accuracy || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{area.accuracy ?? 0}% accuracy · {area.totalSessions || 0} sessions</p>
                  </button>
                ))
              )}
            </div>

            {/* Selected Area Details */}
            <div className="lg:col-span-2">
              {selectedArea ? (
                <div className="card-glass rounded-lg p-8 space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold">{selectedArea.topic}</h2>
                      {selectedArea.severity && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium border ${severityColors[selectedArea.severity] || severityColors.Low}`}
                        >
                          {selectedArea.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Category: <span className="text-primary-400 font-medium">{selectedArea.category}</span>
                    </p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-dark-800/50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Accuracy Rate</p>
                      <p className="text-2xl font-bold text-primary-400">{selectedArea.accuracy ?? 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold">{selectedArea.totalSessions || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Problems Solved</p>
                      <p className="text-2xl font-bold">{selectedArea.totalProblems || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avg. Difficulty</p>
                      <p className="text-2xl font-bold">{selectedArea.avgDifficulty?.toFixed(1) ?? '—'}</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div>
                    <p className="text-sm font-medium mb-3">Performance Overview</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="font-semibold">{selectedArea.accuracy ?? 0}%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-red-500 to-emerald-500"
                          style={{ width: `${selectedArea.accuracy ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommendations (from backend if present) */}
                  {selectedArea.recommendations?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-amber-400" />
                        Recommended Action Plan
                      </h3>
                      <div className="space-y-3">
                        {selectedArea.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-dark-800/50 rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                                {idx + 1}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  {selectedArea.relatedTopics?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Book size={20} className="text-emerald-400" />
                        Related Topics to Strengthen
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedArea.relatedTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-glass rounded-lg p-12 text-center text-gray-500">
                  Select a topic from the list to view details.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* General Tips — always shown, these are genuine advice, not fake data */}
      <div className="card-glass rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="text-emerald-400" size={24} />
          General Improvement Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Spaced Repetition', desc: 'Review weak topics every 3–5 days to strengthen memory.' },
            { title: 'Break It Down', desc: 'Divide complex topics into smaller, manageable chunks.' },
            { title: 'Active Recall', desc: 'Test yourself frequently without looking at solutions.' },
            { title: 'Teach Others', desc: 'Explain concepts to peers or write blog posts about them.' },
            { title: 'Real Projects', desc: 'Apply concepts in real projects to deepen understanding.' },
            { title: 'Consistent Practice', desc: 'Practice daily, even if just for 30 minutes.' },
          ].map((tip, idx) => (
            <div key={idx} className="p-4 bg-dark-800/50 rounded-lg">
              <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeakAreasPage
