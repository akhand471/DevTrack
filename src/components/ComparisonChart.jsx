import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/**
 * ComparisonChart — compares user accuracy / problems across topics.
 * Accepts real topic performance data via props.
 *
 * @param {{ data?: Array<{ topic: string, totalProblems: number, totalSessions: number }> }} props
 */
const ComparisonChart = ({ data = [] }) => {
  const chartData = data
    .filter(t => t.totalProblems > 0)
    .slice(0, 8)
    .map(t => ({
      topic: t.topic || t._id || 'Unknown',
      problems: t.totalProblems || 0,
      sessions: t.totalSessions || 0,
    }))

  if (chartData.length === 0) {
    return (
      <div className="card-glass rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Topic Comparison</h2>
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          Log study sessions to see your topic-wise performance comparison.
        </div>
      </div>
    )
  }

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

  return (
    <div className="card-glass rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">Topic Comparison</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9ca3af" />
          <YAxis
            dataKey="topic"
            type="category"
            stroke="#9ca3af"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="problems" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Insights */}
      {chartData.length >= 2 && (
        <div className="mt-4 p-3 bg-dark-800/50 rounded-lg text-sm text-gray-400">
          <p>
            📊 <strong className="text-white">{chartData[0].topic}</strong> is your strongest topic with {chartData[0].problems} problems solved.
            {chartData.length > 1 && (
              <> Focus more on <strong className="text-amber-400">{chartData[chartData.length - 1].topic}</strong> to improve balance.</>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default ComparisonChart
