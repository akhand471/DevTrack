import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Code2, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/study-log', label: 'Study Log' },
    { path: '/syllabus', label: 'Syllabus' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/profile', label: 'Profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gradient">
            <Code2 size={24} className="text-primary-500" />
            <span>DevTrack</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? 'active text-primary-400 bg-primary-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-dark-700">
                <span className="text-sm font-medium text-gray-300">
                  {user.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-dark-800 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700/50 py-4 space-y-1 slide-in-right">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${isActive(link.path)
                  ? 'text-primary-400 bg-primary-500/10 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-3 mt-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
              >
                <LogOut size={18} />
                Logout ({user.name?.split(' ')[0]})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
