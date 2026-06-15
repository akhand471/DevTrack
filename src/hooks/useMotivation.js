/**
 * useMotivation.js — shared XP + streak + session state
 * Single source of truth for all motivation components.
 */
import { useLocalStorage } from './useLocalStorage'
import { useMemo } from 'react'

// ── XP rules ──────────────────────────────────────────────────────────────────
export const XP_PER_DIFFICULTY = { Easy: 10, Medium: 20, Hard: 35 }
export const XP_GOAL_BONUS = 50

export const LEVELS = [
  { min: 0,    max: 99,   level: 1, title: 'Beginner',          emoji: '🌱' },
  { min: 100,  max: 299,  level: 2, title: 'Learner',           emoji: '📚' },
  { min: 300,  max: 599,  level: 3, title: 'Coder',             emoji: '💻' },
  { min: 600,  max: 999,  level: 4, title: 'Code Warrior',      emoji: '⚔️'  },
  { min: 1000, max: 1999, level: 5, title: 'Algorithm Master',  emoji: '🧠' },
  { min: 2000, max: Infinity, level: 6, title: 'Interview Ready', emoji: '🏆' },
]

export const getLevelInfo = (xp) => {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) || LEVELS[LEVELS.length - 1]
  const next = LEVELS.find((l) => l.level === current.level + 1)
  const progressInLevel = xp - current.min
  const levelRange = (next ? next.min : current.max + 1) - current.min
  const pct = Math.min(100, Math.round((progressInLevel / levelRange) * 100))
  const xpToNext = next ? next.min - xp : 0
  return { ...current, xpToNext, pct, next }
}

// ── Daily goal defaults ───────────────────────────────────────────────────────
export const DAILY_GOALS = { dsa: 5, coreCs: 3, techStack: 3, weekly: 10 }

export const useMotivation = () => {
  const [xp, setXp] = useLocalStorage('devtrack_xp', 0)
  const [streak, setStreak] = useLocalStorage('devtrack_streak', 0)
  const [lastStudyDate, setLastStudyDate] = useLocalStorage('devtrack_last_study', null)
  const [todaySessions, setTodaySessions] = useLocalStorage('devtrack_today_sessions', [])
  const [weekSessions, setWeekSessions] = useLocalStorage('devtrack_week_sessions', [])
  const [_goals, setGoals] = useLocalStorage('devtrack_goals', DAILY_GOALS)
  // Always merge with defaults so partial/stale localStorage values don't break bars
  const goals = { ...DAILY_GOALS, ..._goals }
  const [toastDismissedDate, setToastDismissedDate] = useLocalStorage('devtrack_toast_dismissed', null)

  /** Call after logging a session — adds XP + updates streak + sessions */
  const updateXP = (difficulty, category, problemsSolved = 0) => {
    const earned = (XP_PER_DIFFICULTY[difficulty] || 20) * Math.max(1, problemsSolved)
    setXp((prev) => prev + earned)

    const today = new Date().toDateString()
    const lastDate = lastStudyDate ? new Date(lastStudyDate).toDateString() : null

    // Update streak
    if (lastDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = lastDate === yesterday.toDateString()
      setStreak((prev) => (wasYesterday || !lastDate ? prev + 1 : 1))
      setLastStudyDate(new Date().toISOString())
    }

    // Track today's sessions
    const sessionEntry = { category, problemsSolved, difficulty, time: Date.now() }
    setTodaySessions((prev) => {
      const filtered = prev.filter((s) => new Date(s.time).toDateString() === today)
      return [...filtered, sessionEntry]
    })

    // Track this week's sessions
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    setWeekSessions((prev) => {
      const filtered = prev.filter((s) => new Date(s.time) >= weekStart)
      return [...filtered, sessionEntry]
    })

    return earned
  }

  const dismissToast = () => setToastDismissedDate(new Date().toDateString())

  const isToastDismissedToday = toastDismissedDate === new Date().toDateString()

  // Computed progress for today
  const todayDate = new Date().toDateString()
  const todayOnly = todaySessions.filter((s) => new Date(s.time).toDateString() === todayDate)

  const dsaToday = todayOnly.filter((s) => s.category === 'DSA').reduce((a, s) => a + (s.problemsSolved || 0), 0)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekOnly = weekSessions.filter((s) => new Date(s.time) >= weekStart)
  const coreCsWeek = weekOnly.filter((s) => s.category === 'Core CS').length
  const techStackWeek = weekOnly.filter((s) => s.category === 'Tech Stack').length
  const totalWeekSessions = weekOnly.length

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp])

  return {
    xp, streak, lastStudyDate, goals,
    dsaToday, coreCsWeek, techStackWeek, totalWeekSessions,
    todaySessions: todayOnly, weekSessions: weekOnly,
    levelInfo, updateXP, dismissToast, isToastDismissedToday,
  }
}
