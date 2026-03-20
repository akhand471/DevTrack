import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="text-center max-w-md fade-in">
        <h1 className="text-8xl font-bold text-primary-500 mb-4 float-bounce">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home size={20} />
            Go Home
          </Link>
          <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft size={20} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
