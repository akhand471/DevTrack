import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudyLog from './pages/StudyLog'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import GoalsPage from './pages/Goals'
import ResourcesPage from './pages/Resources'
import WeakAreasPage from './pages/WeakAreas'
import SyllabusPage from './pages/Syllabus'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-950 text-primary-500">Loading...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Landing and Auth pages render without the app shell (no navbar/sidebar)
  const isPublicPage = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].includes(location.pathname)

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-dark-950 text-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/study-log" element={<ProtectedRoute><StudyLog /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
            <Route path="/weak-areas" element={<ProtectedRoute><WeakAreasPage /></ProtectedRoute>} />
            <Route path="/syllabus" element={<ProtectedRoute><SyllabusPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  )
}

export default App
