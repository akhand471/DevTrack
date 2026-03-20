import React from 'react'
import { Target, AlertCircle, Flame } from 'lucide-react'

/**
 * QuickStatsBar — displays quick, glanceable stats.
 * Accepts real stats from the dashboard via props.
 *
 * @param {{ stats?: { goalsCompleted?: number, totalGoals?: number, weakAreas?: number, streak?: number } }} props
 */
const QuickStatsBar = ({ stats = {} }) => {
  const {
    goalsCompleted = 0,
    totalGoals = 0,
    weakAreas = 0,
    streak = 0,
  } = stats

  const items = [
    {
      icon: <Target size={16} className="text-emerald-400" />,
      label: 'Goals',
      value: `${goalsCompleted}/${totalGoals}`,
    },
    {
      icon: <AlertCircle size={16} className="text-amber-400" />,
      label: 'Weak Areas',
      value: weakAreas,
    },
    {
      icon: <Flame size={16} className="text-primary-400" />,
      label: 'Streak',
      value: `${streak} days`,
    },
  ]

  return (
    <div className="flex gap-4 flex-wrap">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-lg border border-dark-700/50"
        >
          {item.icon}
          <span className="text-xs text-gray-400">{item.label}:</span>
          <span className="text-sm font-semibold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default QuickStatsBar
