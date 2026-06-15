import React, { useMemo } from 'react'
import { X } from 'lucide-react'
import { useMotivation } from '../hooks/useMotivation'

const MotivationToast = () => {
  const {
    streak, todaySessions, goals, weekSessions,
    isToastDismissedToday, dismissToast,
  } = useMotivation()

  const todayProblems = todaySessions.reduce((a, s) => a + (s.problemsSolved || 0), 0)
  const hasStudiedToday = todaySessions.length > 0
  const weeklyGoalHit = weekSessions.length >= goals.weekly

  // Compute weak area (most neglected category this week)
  const weekCats = weekSessions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1; return acc
  }, {})
  const allCats = ['DSA', 'Core CS', 'Tech Stack']
  const neglectedCat = allCats.find((c) => !weekCats[c]) || null

  // Pick the highest-priority nudge
  const nudge = useMemo(() => {
    if (weeklyGoalHit) {
      return { icon: '🏆', text: 'Weekly goal crushed! You\'re on fire.', color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' }
    }
    if (hasStudiedToday && todayProblems > 0) {
      return { icon: '🚀', text: `You solved ${todayProblems} problem${todayProblems !== 1 ? 's' : ''} today! Keep it up.`, color: 'bg-sky-500/10 border-sky-500/30 text-sky-300' }
    }
    if (!hasStudiedToday && streak > 2) {
      return { icon: '🔥', text: `Don't break your ${streak}-day streak! Log a session.`, color: 'bg-orange-500/10 border-orange-500/30 text-orange-300' }
    }
    if (!hasStudiedToday && neglectedCat) {
      return { icon: '💡', text: `You haven't practiced ${neglectedCat} this week. Quick review?`, color: 'bg-violet-500/10 border-violet-500/30 text-violet-300' }
    }
    if (!hasStudiedToday) {
      return { icon: '😴', text: "Haven't started yet today. Even 15 mins counts!", color: 'bg-slate-700/40 border-slate-600/50 text-gray-300' }
    }
    return null
  }, [hasStudiedToday, todayProblems, streak, weeklyGoalHit, neglectedCat])

  if (!nudge || isToastDismissedToday) return null

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${nudge.color} transition-all duration-300`}
      role="status"
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{nudge.icon}</span>
      <p className="text-sm font-medium flex-1">{nudge.text}</p>
      <button
        onClick={dismissToast}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors ml-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default MotivationToast
