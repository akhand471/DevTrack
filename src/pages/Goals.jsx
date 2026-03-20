import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Target, TrendingUp } from 'lucide-react'
import goalsService from '../services/goalsService'

const GoalsPage = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'DSA',
    targetProblems: '',
    deadline: '',
    priority: 'Medium',
  })

  const categories = ['DSA', 'Core CS', 'Tech Stack']
  const priorities = ['Low', 'Medium', 'High']

  // ── Fetch goals from API ──────────────────────────────────────────
  const fetchGoals = async () => {
    try {
      setLoading(true)
      const res = await goalsService.getGoals()
      if (res.success) setGoals(res.data)
    } catch (err) {
      setError('Failed to load goals')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGoals() }, [])

  // ── Create goal ───────────────────────────────────────────────────
  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.targetProblems || !formData.deadline) {
      alert('Please fill all fields')
      return
    }

    try {
      const res = await goalsService.createGoal({
        ...formData,
        targetProblems: parseInt(formData.targetProblems),
      })
      if (res.success) {
        setGoals([res.data, ...goals])
        setFormData({ title: '', category: 'DSA', targetProblems: '', deadline: '', priority: 'Medium' })
        setFormOpen(false)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create goal')
    }
  }

  // ── Delete goal ───────────────────────────────────────────────────
  const deleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try {
      await goalsService.deleteGoal(id)
      setGoals(goals.filter(g => g._id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete goal')
    }
  }

  // ── Update progress ───────────────────────────────────────────────
  const updateProgress = async (id, increment) => {
    const goal = goals.find(g => g._id === id)
    if (!goal) return

    const newCurrent = Math.max(0, Math.min(goal.currentProblems + increment, goal.targetProblems))

    try {
      const res = await goalsService.updateGoal(id, { currentProblems: newCurrent })
      if (res.success) {
        setGoals(goals.map(g => g._id === id ? res.data : g))
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update progress')
    }
  }

  const getProgressPercentage = (current, target) => Math.round((current / target) * 100)

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 'Overdue'
  }

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'text-green-400'
    if (percentage >= 75) return 'text-emerald-400'
    if (percentage >= 50) return 'text-amber-400'
    if (percentage >= 25) return 'text-orange-400'
    return 'text-red-400'
  }

  const completedCount = goals.filter(g => g.status === 'Completed').length
  const totalCount = goals.length

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Goals 🎯</h1>
          <p className="text-gray-400">Set targets and track your progress towards mastery</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-primary-400" size={24} />
            <h3 className="text-sm font-medium text-gray-400">Total Goals</h3>
          </div>
          <p className="text-3xl font-bold">{totalCount}</p>
        </div>

        <div className="card-glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-emerald-400" size={24} />
            <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          </div>
          <p className="text-3xl font-bold">{completedCount}</p>
          <p className="text-xs text-gray-500 mt-2">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="card-glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-amber-400" size={24} />
            <h3 className="text-sm font-medium text-gray-400">In Progress</h3>
          </div>
          <p className="text-3xl font-bold">{totalCount - completedCount}</p>
        </div>
      </div>

      {/* Add Goal Form */}
      {formOpen && (
        <div className="card-glass rounded-lg p-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create New Goal</h2>
            <button
              onClick={() => setFormOpen(false)}
              className="p-2 hover:bg-dark-800 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Master Binary Search"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field"
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Units</label>
              <input
                type="number"
                min="1"
                value={formData.targetProblems}
                onChange={(e) => setFormData({ ...formData, targetProblems: e.target.value })}
                placeholder="e.g., 50"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-primary flex-1">
                Create Goal
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

      {/* Goals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card-glass rounded-lg p-12 text-center text-primary-500">Loading goals...</div>
        ) : error ? (
          <div className="card-glass rounded-lg p-12 text-center text-red-400">{error}</div>
        ) : goals.length === 0 ? (
          <div className="card-glass rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No goals yet. Start by creating your first goal!</p>
            <button
              onClick={() => setFormOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create First Goal
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const percentage = getProgressPercentage(goal.currentProblems, goal.targetProblems)
            const daysLeft = getDaysRemaining(goal.deadline)

            return (
              <div
                key={goal._id}
                className={`card-glass rounded-lg p-6 hover:border-primary-500/30 transition-all border ${goal.status === 'Completed' ? 'border-emerald-500/30' : 'border-dark-700/50'
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{goal.title}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${goal.category === 'DSA'
                          ? 'bg-blue-500/20 text-blue-400'
                          : goal.category === 'Core CS'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-green-500/20 text-green-400'
                          }`}
                      >
                        {goal.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${goal.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-400'
                          : goal.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-gray-500/20 text-gray-400'
                          }`}
                      >
                        {goal.priority}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className={`text-sm font-semibold ${getProgressColor(percentage)}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-400 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {goal.currentProblems} / {goal.targetProblems} units completed
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-dark-700/50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${goal.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : goal.status === 'In Progress'
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-gray-500/20 text-gray-400'
                        }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Days Left</p>
                    <p className={`font-semibold text-sm ${daysLeft === 'Overdue' ? 'text-red-400' : 'text-gray-100'}`}>
                      {daysLeft === 'Overdue' ? daysLeft : `${daysLeft} days`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal._id, -1)}
                      disabled={goal.currentProblems === 0}
                      className="px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 disabled:opacity-50 rounded transition"
                    >
                      −
                    </button>
                    <button
                      onClick={() => updateProgress(goal._id, 1)}
                      disabled={goal.currentProblems === goal.targetProblems}
                      className="px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GoalsPage
