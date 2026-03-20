import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * ChartComponent — renders a bar chart for weekly study progress.
 * Accepts real data via props, falls back to empty state if no data.
 *
 * @param {{ data?: Array<{day: string, problems: number}> }} props
 */
const ChartComponent = ({ data }) => {
  const chartData = data && data.length > 0
    ? data
    : [] // No fallback dummy data — show empty state

  if (chartData.length === 0) {
    return (
      <div className="card-glass rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          No study sessions this week yet. Start logging to see your progress!
        </div>
      </div>
    )
  }

  return (
    <div className="card-glass rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="problems" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartComponent
