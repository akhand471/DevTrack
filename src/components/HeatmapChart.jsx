import React, { useMemo } from 'react'

/**
 * HeatmapChart — visualizes coding activity as a contribution-style heatmap.
 * Accepts sessions as props and computes daily activity from real dates.
 *
 * @param {{ sessions?: Array<{ date: string, problemsSolved?: number }> }} props
 */
const HeatmapChart = ({ sessions = [] }) => {
  // Compute daily activity counts from sessions
  const { grid, months } = useMemo(() => {
    const activityMap = {}

    sessions.forEach(s => {
      const dateStr = new Date(s.date).toISOString().split('T')[0]
      activityMap[dateStr] = (activityMap[dateStr] || 0) + (s.problemsSolved || 1)
    })

    // Generate the last 20 weeks of grid data
    const weeks = 20
    const today = new Date()
    const cells = []
    const monthLabels = []
    let lastMonth = -1

    for (let w = weeks - 1; w >= 0; w--) {
      const weekCells = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(today.getDate() - (w * 7 + (6 - d)))
        const dateStr = date.toISOString().split('T')[0]
        const count = activityMap[dateStr] || 0

        weekCells.push({ date: dateStr, count })

        // Track month labels
        const month = date.getMonth()
        if (month !== lastMonth && d === 0) {
          monthLabels.push({
            label: date.toLocaleString('default', { month: 'short' }),
            weekIndex: weeks - 1 - w,
          })
          lastMonth = month
        }
      }
      cells.push(weekCells)
    }

    return { grid: cells, months: monthLabels }
  }, [sessions])

  const getColorClass = (count) => {
    if (count === 0) return 'bg-dark-800'
    if (count <= 1) return 'bg-primary-900/60'
    if (count <= 3) return 'bg-primary-700/70'
    if (count <= 5) return 'bg-primary-500'
    return 'bg-primary-400'
  }

  return (
    <div className="card-glass rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">Coding Activity</h2>

      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-0">
        {months.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-gray-500"
            style={{ marginLeft: `${m.weekIndex * 15}px`, position: i === 0 ? 'relative' : 'absolute' }}
          >
            {i === 0 ? m.label : ''}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {grid.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px]">
            {week.map((cell, dIdx) => (
              <div
                key={dIdx}
                className={`w-3 h-3 rounded-sm ${getColorClass(cell.count)} transition-colors hover:ring-1 hover:ring-primary-400/50`}
                title={`${cell.date}: ${cell.count} problem${cell.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-dark-800" />
        <div className="w-3 h-3 rounded-sm bg-primary-900/60" />
        <div className="w-3 h-3 rounded-sm bg-primary-700/70" />
        <div className="w-3 h-3 rounded-sm bg-primary-500" />
        <div className="w-3 h-3 rounded-sm bg-primary-400" />
        <span>More</span>
      </div>
    </div>
  )
}

export default HeatmapChart
