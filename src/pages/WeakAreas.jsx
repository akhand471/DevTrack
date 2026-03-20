import React, { useState } from 'react'
import { AlertCircle, TrendingDown, Zap, CheckCircle, Book, Clock } from 'lucide-react'

const WeakAreasPage = () => {
  const [weakAreas] = useState([
    {
      id: 1,
      topic: 'Graph Algorithms - DFS/BFS',
      category: 'DSA',
      accuracy: 42,
      attempts: 15,
      failureRate: 58,
      severity: 'Critical',
      suggestedTime: 10,
      recommendations: [
        'Watch DFS/BFS video tutorials',
        'Practice basic graph problems (Easy)',
        'Build mental model with diagrams',
        'Solve 5 medium-level problems',
      ],
      relatedTopics: ['Tree Traversal', 'Recursion', 'Backtracking'],
    },
    {
      id: 2,
      topic: 'Dynamic Programming',
      category: 'DSA',
      accuracy: 55,
      attempts: 12,
      failureRate: 45,
      severity: 'High',
      suggestedTime: 8,
      recommendations: [
        'Master the DP patterns (memoization vs tabulation)',
        'Solve bottom-up DP problems',
        'Practice knapsack variations',
      ],
      relatedTopics: ['Recursion', 'Greedy', 'Mathematical Logic'],
    },
    {
      id: 3,
      topic: 'Database Optimization - Indexes',
      category: 'Core CS',
      accuracy: 48,
      attempts: 8,
      failureRate: 52,
      severity: 'Critical',
      suggestedTime: 7,
      recommendations: [
        'Understand B-tree and hash index structures',
        'Study query optimization',
        'Hands-on: Create indexes and measure performance',
      ],
      relatedTopics: ['SQL', 'Database Design', 'Performance Tuning'],
    },
    {
      id: 4,
      topic: 'System Design - Scalability',
      category: 'Core CS',
      accuracy: 60,
      attempts: 5,
      failureRate: 40,
      severity: 'Medium',
      suggestedTime: 6,
      recommendations: [
        'Study load balancing strategies',
        'Learn about database sharding',
        'Understand caching mechanisms',
      ],
      relatedTopics: ['Databases', 'Networking', 'Distributed Systems'],
    },
    {
      id: 5,
      topic: 'Advanced React Patterns',
      category: 'Tech Stack',
      accuracy: 65,
      attempts: 10,
      failureRate: 35,
      severity: 'Medium',
      suggestedTime: 5,
      recommendations: [
        'Deep dive into render props pattern',
        'Master compound components',
        'Practice custom hooks',
      ],
      relatedTopics: ['JavaScript', 'Hooks', 'Performance'],
    },
  ])

  const [selectedArea, setSelectedArea] = useState(weakAreas[0])
  const [selectedCategory, setSelectedCategory] = useState('All')

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
  const totalWeakAreas = weakAreas.length
  const avgAccuracy = Math.round(weakAreas.reduce((sum, a) => sum + a.accuracy, 0) / weakAreas.length)

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Weak Areas Analysis 🔍</h1>
        <p className="text-gray-400">Identify your weak spots and get targeted improvement plans</p>
      </div>

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
          <p className="text-3xl font-bold">{totalWeakAreas}</p>
        </div>

        <div className="card-glass rounded-lg p-6 border-emerald-500/30">
          <Zap className="text-emerald-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Average Accuracy</p>
          <p className="text-3xl font-bold text-emerald-400">{avgAccuracy}%</p>
        </div>
      </div>

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
          {filteredAreas.map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedArea.id === area.id
                  ? 'card-glass border-primary-500/50 ring-2 ring-primary-500/30'
                  : 'card-glass hover:border-primary-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{area.topic}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium border ${severityColors[area.severity]}`}
                >
                  {area.severity}
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    area.accuracy >= 70
                      ? 'bg-emerald-500'
                      : area.accuracy >= 50
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${area.accuracy}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{area.accuracy}% accuracy</p>
            </button>
          ))}
        </div>

        {/* Selected Area Details */}
        <div className="lg:col-span-2">
          {selectedArea && (
            <div className="card-glass rounded-lg p-8 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{selectedArea.topic}</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border ${severityColors[selectedArea.severity]}`}
                  >
                    {selectedArea.severity}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Category: <span className="text-primary-400 font-medium">{selectedArea.category}</span>
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-dark-800/50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-primary-400">{selectedArea.accuracy}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Failure Rate</p>
                  <p className="text-2xl font-bold text-red-400">{selectedArea.failureRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Attempts</p>
                  <p className="text-2xl font-bold">{selectedArea.attempts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Est. Study Time</p>
                  <p className="text-2xl font-bold">{selectedArea.suggestedTime}h</p>
                </div>
              </div>

              {/* Performance Bar */}
              <div>
                <p className="text-sm font-medium mb-3">Performance Overview</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="font-semibold">{selectedArea.accuracy}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-red-500 to-emerald-500"
                      style={{ width: `${selectedArea.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
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

              {/* Related Topics */}
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-dark-700/50">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Clock size={18} />
                  Start Study Session
                </button>
                <button className="btn-secondary flex-1">View Resources</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Improvement Tips */}
      <div className="card-glass rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="text-emerald-400" size={24} />
          General Improvement Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Spaced Repetition',
              desc: 'Review weak topics every 3-5 days to strengthen memory',
            },
            {
              title: 'Break It Down',
              desc: 'Divide complex topics into smaller, manageable chunks',
            },
            {
              title: 'Active Recall',
              desc: 'Test yourself frequently without looking at solutions',
            },
            {
              title: 'Teach Others',
              desc: 'Explain concepts to peers or write blog posts about them',
            },
            {
              title: 'Real Projects',
              desc: 'Apply concepts in real projects to deepen understanding',
            },
            {
              title: 'Consistent Practice',
              desc: 'Practice daily, even if just for 30 minutes',
            },
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
