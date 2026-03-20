import React, { useState, useEffect } from 'react'
import { BookOpen, Star, ExternalLink, Plus, Trash2, Filter } from 'lucide-react'
import resourcesService from '../services/resourcesService'

const ResourcesPage = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterCategory, setFilterCategory] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'DSA',
    type: 'Article',
    difficulty: 'Medium',
    url: '',
    notes: '',
  })

  const categories = ['DSA', 'Core CS', 'Tech Stack']
  const types = ['Article', 'Blog', 'Video Course', 'Course', 'GitHub', 'Book']
  const difficulties = ['Easy', 'Medium', 'Hard']

  // ── Fetch resources ───────────────────────────────────────────────
  const fetchResources = async () => {
    try {
      setLoading(true)
      const res = await resourcesService.getResources()
      if (res.success) setResources(res.data)
    } catch (err) {
      setError('Failed to load resources')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResources() }, [])

  // ── Add resource ──────────────────────────────────────────────────
  const handleAddResource = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.url) {
      alert('Please fill title and URL')
      return
    }

    try {
      const res = await resourcesService.createResource(formData)
      if (res.success) {
        setResources([res.data, ...resources])
        setFormData({ title: '', category: 'DSA', type: 'Article', difficulty: 'Medium', url: '', notes: '' })
        setFormOpen(false)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save resource')
    }
  }

  // ── Toggle favorite ───────────────────────────────────────────────
  const toggleFavorite = async (id) => {
    const resource = resources.find(r => r._id === id)
    if (!resource) return

    try {
      const res = await resourcesService.updateResource(id, { isFavorite: !resource.isFavorite })
      if (res.success) {
        setResources(resources.map(r => r._id === id ? res.data : r))
      }
    } catch (err) {
      console.error('Failed to update favorite:', err)
    }
  }

  // ── Delete resource ───────────────────────────────────────────────
  const deleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    try {
      await resourcesService.deleteResource(id)
      setResources(resources.filter(r => r._id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete resource')
    }
  }

  const filteredResources = resources.filter(r =>
    (filterCategory === 'All' || r.category === filterCategory) &&
    (filterType === 'All' || r.type === filterType)
  )

  const favorites = resources.filter(r => r.isFavorite)

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Resources 📚</h1>
          <p className="text-gray-400">Curate and organize your learning materials</p>
        </div>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass rounded-lg p-6">
          <BookOpen className="text-primary-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Total Resources</p>
          <p className="text-3xl font-bold">{resources.length}</p>
        </div>
        <div className="card-glass rounded-lg p-6">
          <Star className="text-amber-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Favorites</p>
          <p className="text-3xl font-bold">{favorites.length}</p>
        </div>
        <div className="card-glass rounded-lg p-6">
          <Filter className="text-emerald-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm mb-2">Categories</p>
          <p className="text-3xl font-bold">{new Set(resources.map(r => r.category)).size}</p>
        </div>
      </div>

      {/* Add Resource Form */}
      {formOpen && (
        <div className="card-glass rounded-lg p-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Learning Resource</h2>
            <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Resource Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Advanced React Patterns"
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
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
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="input-field"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Why is this resource useful?"
                className="input-field resize-none h-20"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="btn-primary flex-1">
                Save Resource
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

      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Filter Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="All">All Types</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">⭐ Favorite Resources ({favorites.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map(resource => (
              <div
                key={resource._id}
                className="card-glass rounded-lg p-4 hover:border-primary-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{resource.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                        {resource.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${resource.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : resource.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                          }`}
                      >
                        {resource.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(resource._id)}
                    className="text-amber-400 hover:scale-110 transition-transform"
                  >
                    ★
                  </button>
                </div>
                {resource.notes && (
                  <p className="text-xs text-gray-400 mb-3">{resource.notes}</p>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-dark-700/50">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1 transition"
                  >
                    Visit <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => deleteResource(resource._id)}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Resources ({filteredResources.length})</h2>
        {loading ? (
          <div className="card-glass rounded-lg p-12 text-center text-primary-500">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="card-glass rounded-lg p-12 text-center">
            <p className="text-gray-400">No resources found. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map(resource => (
              <div
                key={resource._id}
                className="card-glass rounded-lg p-6 hover:border-primary-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{resource.title}</h3>
                      <button
                        onClick={() => toggleFavorite(resource._id)}
                        className={`transition-colors ${resource.isFavorite ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'}`}
                      >
                        ★
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${resource.category === 'DSA'
                          ? 'bg-blue-500/20 text-blue-400'
                          : resource.category === 'Core CS'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-green-500/20 text-green-400'
                          }`}
                      >
                        {resource.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                        {resource.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${resource.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : resource.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                          }`}
                      >
                        {resource.difficulty}
                      </span>
                    </div>

                    {resource.notes && (
                      <p className="text-sm text-gray-400 mb-2">💡 {resource.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteResource(resource._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-dark-700/50">
                  <span className="text-xs text-gray-500">Saved {new Date(resource.createdAt).toLocaleDateString()}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm py-2 px-3 flex items-center gap-2"
                  >
                    Open <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResourcesPage
