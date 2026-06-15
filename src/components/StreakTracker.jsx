import React, { useMemo } from 'react'
import { useMotivation } from '../hooks/useMotivation'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Returns the last 7 calendar days (Mon–Sun aligned to current week) */
const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push(d)
  }
  return days
}

const StreakTracker = () => {
  const { streak, weekSessions, todaySessions } = useMotivation()

  const days = useMemo(() => getLast7Days(), [])
  const todayStr = new Date().toDateString()

  // Build set of dates that had sessions this week
  const activeDates = useMemo(() => {
    const set = new Set()
    weekSessions.forEach((s) => set.add(new Date(s.time).toDateString()))
    todaySessions.forEach((s) => set.add(new Date(s.time).toDateString()))
    return set
  }, [weekSessions, todaySessions])

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Weekly Streak
      </h3>

      {/* Day squares */}
      <div className="flex gap-2 justify-between mb-4">
        {days.map((day, idx) => {
          const dayStr = day.toDateString()
          const isToday = dayStr === todayStr
          const hasSession = activeDates.has(dayStr)

          let squareClass = 'bg-slate-800 text-gray-600'
          if (isToday && hasSession) {
            squareClass = 'bg-sky-500/30 border border-sky-500 text-sky-300'
          } else if (isToday) {
            squareClass = 'bg-sky-900/40 border border-sky-700/50 text-sky-500'
          } else if (hasSession) {
            squareClass = 'bg-[#EAF3DE]/10 border border-[#27500A]/40 text-[#4ade80]'
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-500">
                {DAY_LABELS[day.getDay() === 0 ? 6 : day.getDay() - 1]}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${squareClass}`}
                title={dayStr}
              >
                {hasSession ? '✓' : day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Streak message */}
      <div className="pt-3 border-t border-slate-700/50">
        {streak > 0 ? (
          <p className="text-sm text-center">
            <span className="text-orange-400 font-bold text-base">🔥 {streak} day{streak !== 1 ? 's' : ''} in a row</span>
            <span className="text-gray-500"> — don't break it!</span>
          </p>
        ) : (
          <p className="text-sm text-center text-gray-400">
            Start your streak today! <span className="text-sky-400">💪</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default StreakTracker
