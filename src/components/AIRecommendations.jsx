import React, { useState, useEffect, useCallback } from 'react'
import { Sparkles, RefreshCw, Clock, ChevronRight, Zap, AlertCircle, TrendingUp, Calendar } from 'lucide-react'
import aiService from '../services/aiService'

// ── Priority badge ────────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const map = {
    high:   'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low:    'bg-sky-500/20 text-sky-400 border-sky-500/30',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${map[priority] || map.low}`}>
      {priority}
    </span>
  )
}

// ── Type icon map ─────────────────────────────────────────────────────────────
const TYPE_ICONS = {
  review:      { icon: RefreshCw,   color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  weak_area:   { icon: AlertCircle, color: 'text-rose-400',    bg: 'bg-rose-500/10'   },
  balance:     { icon: TrendingUp,  color: 'text-amber-400',   bg: 'bg-amber-500/10'  },
  consistency: { icon: Calendar,    color: 'text-sky-400',     bg: 'bg-sky-500/10'    },
  challenge:   { icon: Zap,         color: 'text-emerald-400', bg: 'bg-emerald-500/10'},
}

const RecommendationCard = ({ rec, index }) => {
  const { icon: Icon, color, bg } = TYPE_ICONS[rec.type] || TYPE_ICONS.challenge
  return (
    <div
      className="group flex gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40
                 hover:border-sky-500/30 hover:bg-slate-800/80 transition-all duration-200"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
          <PriorityBadge priority={rec.priority} />
        </div>
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{rec.reason}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-sky-400">
            <ChevronRight size={12} />
            <span className="font-medium">{rec.action}</span>
          </div>
          {rec.timeEstimate && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <Clock size={10} />
              <span>{rec.timeEstimate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Due-review mini-list ───────────────────────────────────────────────────────
const DueReviewList = ({ items }) => {
  if (!items.length) {
    return (
      <p className="text-xs text-gray-500 italic text-center py-3">
        No reviews due — log more sessions to start tracking! 🎉
      </p>
    )
  }
  return (
    <div className="space-y-2">
      {items.map((t, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.daysOverdue > 2 ? 'bg-rose-500' : t.daysOverdue > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-gray-300 truncate">{t.topic}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-gray-400">{t.category}</span>
          </div>
          <span className={`text-xs font-medium flex-shrink-0 ml-2 ${t.daysOverdue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {t.daysOverdue > 0 ? `${t.daysOverdue}d overdue` : 'Due today'}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const AIRecommendations = () => {
  const [recs, setRecs] = useState([])
  const [dueReviews, setDueReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [source, setSource] = useState('')
  const [lastFetched, setLastFetched] = useState(null)
  const [error, setError] = useState('')

  // Fetch due-reviews on mount (cheap)
  useEffect(() => {
    aiService.getDueReviews(5)
      .then((r) => { if (r.success) setDueReviews(r.data) })
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [])

  const fetchRecs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await aiService.getRecommendations()
      if (res.success) {
        setRecs(res.data.recommendations || [])
        setSource(res.source)
        setLastFetched(new Date())
      }
    } catch (err) {
      setError('Could not load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* ── AI Recommendations panel ── */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
              <Sparkles size={16} className="text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">AI Study Coach</h3>
              {source && (
                <p className="text-[10px] text-gray-600">
                  {source === 'openai' ? '✦ GPT-4o-mini' : '⚡ Smart heuristic'}
                  {lastFetched && ` · ${lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={fetchRecs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20
                       text-sky-400 text-xs font-medium hover:bg-sky-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Thinking...' : recs.length ? 'Refresh' : 'Get Recommendations'}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {!recs.length && !loading && !error && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-gray-400 text-sm mb-1">Your personal AI study coach is ready</p>
            <p className="text-gray-600 text-xs">Click "Get Recommendations" to get personalized advice based on your session history</p>
          </div>
        )}

        {loading && !recs.length && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        )}

        <div className="space-y-3">
          {recs.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} index={i} />
          ))}
        </div>
      </div>

      {/* ── Spaced Repetition Due Reviews ── */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={15} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Review Queue</h3>
          {dueReviews.length > 0 && (
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
              {dueReviews.length} due
            </span>
          )}
        </div>

        {reviewsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-6 rounded bg-slate-800 animate-pulse" />)}
          </div>
        ) : (
          <DueReviewList items={dueReviews} />
        )}

        <p className="text-[11px] text-gray-600 mt-3 pt-3 border-t border-slate-700/50">
          Topics are scheduled using the SM-2 spaced repetition algorithm — reviews are timed to maximize long-term retention.
        </p>
      </div>
    </div>
  )
}

export default AIRecommendations
