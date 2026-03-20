import React, { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { allDsaTopics } from '../data/dsaTopics'
import studyService from '../services/studyService'

const StudyLog = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [formData, setFormData] = useState({
    topic: '',
    category: 'DSA',
    platform: 'LeetCode',
    problems: '',
    difficulty: 'Medium',
    time: '',
  })

  const categories = ['DSA', 'Core CS', 'Tech Stack']
  const platforms = {
    DSA: ['LeetCode', 'Codeforces', 'HackerRank', 'AtCoder', 'GeeksforGeeks'],
    'Core CS': ['YouTube', 'Coursera', 'MIT OpenCourseWare', 'Udemy', 'Documentation'],
    'Tech Stack': ['Official Docs', 'Tutorials', 'Projects', 'Courses', 'GitHub'],
  }

  const difficulties = ['Easy', 'Medium', 'Hard']

  const topicsByCategory = {
    DSA: allDsaTopics,
    'Core CS': [
      'Operating Systems',
      'Database Management',
      'Computer Networks',
      'System Design',
      'Data Structures Theory',
      'Algorithms Theory',
      'Compiler Design',
      'Distributed Systems',
    ],
    'Tech Stack': [
      'React',
      'Node.js',
      'Python',
      'JavaScript',
      'TypeScript',
      'Docker',
      'Kubernetes',
      'AWS',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'REST APIs',
    ],
  }

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const res = await studyService.getSessions()
      if (res.success) {
        setSessions(res.data)
      }
    } catch (err) {
      setError('Failed to fetch sessions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.topic || !formData.problems || !formData.time) {
      alert('Please fill all fields')
      return
    }

    try {
      const sessionData = {
        ...formData,
        problemsSolved: parseInt(formData.problems),
        timeSpent: parseInt(formData.time),
      }

      const res = await studyService.logSession(sessionData)
      if (res.success) {
        setSessions([res.data, ...sessions])
        setFormData({ topic: '', category: 'DSA', platform: 'LeetCode', problems: '', difficulty: 'Medium', time: '' })
        setFormOpen(false)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to log session')
      console.error(err)
    }
  }

  const deleteSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await studyService.deleteSession(id)
        setSessions(sessions.filter(s => s._id !== id))
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete session')
      }
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Study Log</h1>
          <p className="text-gray-400">Track your coding practice sessions</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Log Session
        </button>
      </div>

      {/* Add Session Form */}
      {formOpen && (
        <div className="card-glass rounded-lg p-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Study Session</h2>
            <button
              onClick={() => setFormOpen(false)}
              className="p-2 hover:bg-dark-800 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value, platform: '' })
                }}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="input-field"
              >
                <option value="">Select a topic</option>
                {topicsByCategory[formData.category]?.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="input-field"
              >
                <option value="">Select a platform</option>
                {platforms[formData.category]?.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Problems Solved */}
            <div>
              <label className="block text-sm font-medium mb-2">Problems/Units Covered</label>
              <input
                type="number"
                min="0"
                value={formData.problems}
                onChange={(e) => setFormData({ ...formData, problems: e.target.value })}
                placeholder="Enter number"
                className="input-field"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty/Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="input-field"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Time Spent */}
            <div>
              <label className="block text-sm font-medium mb-2">Time Spent (minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="Enter minutes"
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-primary flex-1">
                Save Session
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Sessions</h2>
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-4 py-2 rounded-lg transition ${filterCategory === 'All'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white'
                }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg transition ${filterCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card-glass rounded-lg p-12 text-center text-primary-500">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="card-glass rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No sessions logged yet</p>
            <button
              onClick={() => setFormOpen(true)}
              className="btn-primary"
            >
              Log Your First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions
              .filter(session => filterCategory === 'All' || session.category === filterCategory)
              .map(session => (
                <div
                  key={session._id}
                  className="card-glass rounded-lg p-6 hover:border-primary-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold">{session.topic}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${session.category === 'DSA'
                            ? 'bg-blue-500/20 text-blue-400'
                            : session.category === 'Core CS'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-green-500/20 text-green-400'
                            }`}
                        >
                          {session.category}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${session.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : session.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                            }`}
                        >
                          {session.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{session.platform}</p>
                    </div>
                    <button
                      onClick={() => deleteSession(session._id)}
                      className="p-2 hover:bg-dark-800 rounded-lg transition text-gray-400 hover:text-red-400"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dark-700/50">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Problems Solved</p>
                      <p className="text-lg font-bold text-primary-400">{session.problemsSolved || session.problems}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time Spent</p>
                      <p className="text-lg font-bold text-primary-400">{session.timeSpent || session.time} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-lg font-bold text-primary-400">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyLog
