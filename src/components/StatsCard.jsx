import React from 'react'

const StatsCard = ({ icon: Icon, label, value, change, color }) => {
  const colorClasses = {
    primary: 'from-primary-500/20 to-transparent border-primary-500/30',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30',
    amber: 'from-amber-500/20 to-transparent border-amber-500/30',
    rose: 'from-rose-500/20 to-transparent border-rose-500/30',
  }

  const iconColorClasses = {
    primary: 'text-primary-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  }

  return (
    <div className={`card-glass rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} card-hover fade-in group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-dark-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className={iconColorClasses[color]} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-xs text-gray-500">{change}</p>
    </div>
  )
}

export default StatsCard
