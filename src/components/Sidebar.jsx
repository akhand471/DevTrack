import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, BarChart3, BookOpen, TrendingUp, User, Home, Target, Zap, AlertCircle } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/study-log', label: 'Study Log', icon: BookOpen },
    { path: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/weak-areas', label: 'Weak Areas', icon: AlertCircle },
    { path: '/resources', label: 'Resources', icon: Zap },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-dark-900/95 backdrop-blur-xl
          border-r border-dark-700/50 overflow-y-auto
          transition-transform duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:top-0
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-dark-800 rounded-lg"
        >
          <X size={20} />
        </button>

        <nav className="p-6 pt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.path)
                    ? 'active-glow bg-primary-600/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <Icon size={20} className={isActive(item.path) ? 'text-primary-400' : ''} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-700/50">
          <p className="text-xs text-gray-500 text-center">
            DevTrack v1.0 • Built for developers
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
