import React, { useEffect, useState } from 'react'
import { useMotivation, LEVELS } from '../hooks/useMotivation'

/** Full XP bar — used on Profile page */
const XPBar = ({ compact = false }) => {
  const { xp, levelInfo } = useMotivation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 150); return () => clearTimeout(t) }, [])

  const { emoji, title, level, pct, xpToNext, next } = levelInfo

  if (compact) {
    // Slim version for sidebar
    return (
      <div className="px-4 py-3 mx-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-300">
            {emoji} Lv.{level} {title}
          </span>
          <span className="text-[10px] text-gray-500">{xp} XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-700 ease-out"
            style={{ width: mounted ? `${pct}%` : '0%' }}
          />
        </div>
        {next && (
          <p className="text-[10px] text-gray-600 mt-1 text-right">{xpToNext} XP to next level</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-6">
      {/* Level header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Level</p>
          <h3 className="text-xl font-bold text-white">
            Level {level} — {title}
          </h3>
          <p className="text-sm text-sky-400 font-semibold">{xp.toLocaleString()} XP total</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>{next ? `Level ${level}` : 'Max Level'}</span>
          {next && <span>Level {next.level} ({next.min.toLocaleString()} XP)</span>}
        </div>
        <div className="h-4 rounded-full bg-slate-800 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400 transition-all duration-700 ease-out relative"
            style={{ width: mounted ? `${pct}%` : '0%' }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-gray-500">{pct}% to next level</span>
          {next
            ? <span className="text-xs text-sky-400 font-medium">{xpToNext} XP to go</span>
            : <span className="text-xs text-amber-400 font-medium">🏆 Max level reached!</span>
          }
        </div>
      </div>

      {/* XP earning reference */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-gray-500 mb-2 font-medium">XP per session</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Easy',   xp: '+10 XP', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Medium', xp: '+20 XP', color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
            { label: 'Hard',   xp: '+35 XP', color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
          ].map((d) => (
            <div key={d.label} className={`${d.bg} rounded-lg p-2 text-center`}>
              <p className="text-[10px] text-gray-500">{d.label}</p>
              <p className={`text-sm font-bold ${d.color}`}>{d.xp}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-600 mt-2 text-center">
          × problems solved &nbsp;|&nbsp; +{50} XP per goal completed
        </p>
      </div>

      {/* All levels reference */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-gray-500 mb-3 font-medium">All levels</p>
        <div className="space-y-1.5">
          {LEVELS.map((l) => (
            <div
              key={l.level}
              className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors
                ${level === l.level ? 'bg-sky-500/15 border border-sky-500/30' : 'bg-slate-800/40'}`}
            >
              <span className={level === l.level ? 'text-sky-300 font-semibold' : 'text-gray-500'}>
                {l.emoji} Lv.{l.level} {l.title}
              </span>
              <span className={level === l.level ? 'text-sky-400' : 'text-gray-600'}>
                {l.min === 0 ? '0' : l.min.toLocaleString()}
                {l.max !== Infinity ? `–${l.max.toLocaleString()}` : '+'} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default XPBar
