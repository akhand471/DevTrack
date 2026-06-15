import React, { useEffect, useState } from 'react'
import { useMotivation } from '../hooks/useMotivation'

// ── helpers ───────────────────────────────────────────────────────────────────
const getEmoji = (pct) => {
  if (pct === 0)   return '😴'
  if (pct <= 25)   return '😴'
  if (pct <= 50)   return '💪'
  if (pct <= 75)   return '🔥'
  if (pct < 100)   return '⚡'
  return '🏆'
}

const getMessage = (pct) => {
  if (pct === 0)   return 'Just started'
  if (pct <= 25)   return 'Just started'
  if (pct <= 50)   return 'Keep going!'
  if (pct <= 75)   return 'Almost there!'
  if (pct < 100)   return 'So close! 🔥'
  return 'Goal crushed! 🏆'
}

// Color map for each bar (hex → inline style, so Tailwind purge can't strip it)
const BAR_COLORS = {
  dsa:       '#378ADD',
  coreCs:    '#1D9E75',
  techStack: '#EF9F27',
  weekly:    '#639922',
}

// ── ProgressBar sub-component ─────────────────────────────────────────────────
const ProgressBar = ({ emoji, label, current, goal, color, mounted }) => {
  const raw = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  const pct = raw

  return (
    <div className="flex items-center gap-3">
      {/* Emoji */}
      <span className="text-xl w-7 text-center flex-shrink-0" title={getMessage(pct)}>
        {getEmoji(pct)}
      </span>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-gray-300 truncate">{label}</span>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {current}/{goal}
          </span>
        </div>

        {/* Track */}
        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: mounted ? `${pct}%` : '0%', backgroundColor: color }}
          />
        </div>

        {/* Micro-message + percentage */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-[11px] text-gray-500">{getMessage(pct)}</span>
          <span className="text-[11px] font-semibold" style={{ color }}>{pct}%</span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const MotivationBars = () => {
  const { dsaToday, coreCsWeek, techStackWeek, totalWeekSessions, goals } = useMotivation()
  // Animate bars in on mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t) }, [])

  const bars = [
    {
      key: 'dsa',
      emoji: null,
      label: 'DSA problems (today)',
      current: dsaToday,
      goal: goals.dsa,
      color: BAR_COLORS.dsa,
    },
    {
      key: 'coreCs',
      label: 'Core CS sessions (this week)',
      current: coreCsWeek,
      goal: goals.coreCs,
      color: BAR_COLORS.coreCs,
    },
    {
      key: 'techStack',
      label: 'Tech Stack sessions (this week)',
      current: techStackWeek,
      goal: goals.techStack,
      color: BAR_COLORS.techStack,
    },
    {
      key: 'weekly',
      label: 'Overall weekly goal',
      current: totalWeekSessions,
      goal: goals.weekly,
      color: BAR_COLORS.weekly,
    },
  ]

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-5 space-y-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Daily Progress
      </h3>

      {bars.map((bar) => (
        <ProgressBar key={bar.key} {...bar} mounted={mounted} />
      ))}
    </div>
  )
}

export default MotivationBars
