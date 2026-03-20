import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Target, TrendingUp, Code2, BarChart3, BookOpen } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* Landing Navbar */}
      <nav className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gradient">
              <Code2 size={24} className="text-primary-500" />
              <span>DevTrack</span>
            </Link>
            <Link
              to="/dashboard"
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20 hero-gradient relative">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <div className="mb-8 inline-block">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium">
              <Zap size={16} />
              <span>Track Your Coding Progress</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Master Coding <span className="text-gradient">Interviews</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            DevTrack helps you track your coding practice, analyze weak areas, and stay consistent
            while preparing for technical interviews. Visualize your progress like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/dashboard"
              className="btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4 text-center">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-20 stagger-in">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-400">500+</p>
              <p className="text-gray-500 text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-400">10K+</p>
              <p className="text-gray-500 text-sm">Problems Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-400">50+</p>
              <p className="text-gray-500 text-sm">Topics Covered</p>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="rounded-xl overflow-hidden border border-dark-700/50 card-glass p-1 mb-20">
            <div className="bg-gradient-to-br from-primary-500/20 via-dark-800 to-transparent rounded-lg h-96 md:h-[500px] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />
              <div className="text-center relative z-10">
                <BarChart3 size={80} className="mx-auto mb-4 text-primary-500/50" />
                <p className="text-gray-500 text-lg font-medium">Dashboard Preview</p>
                <p className="text-gray-600 text-sm mt-1">Track • Analyze • Improve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="section-title mb-4">Powerful Features</h2>
            <p className="section-subtitle">Everything you need to track and improve your coding skills</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger-in">
            {[
              {
                icon: BookOpen,
                title: 'Study Tracking',
                desc: 'Log your study sessions with topics, platforms, problems solved, and difficulty levels.',
              },
              {
                icon: TrendingUp,
                title: 'Analytics Dashboard',
                desc: 'Visualize your progress with charts, heatmaps, and detailed insights about weak areas.',
              },
              {
                icon: Target,
                title: 'Weak Area Analysis',
                desc: 'Identify topics where you struggle and get actionable insights to improve faster.',
              },
              {
                icon: Zap,
                title: 'Streak Counter',
                desc: 'Build consistency with daily streak tracking and motivation badges.',
              },
              {
                icon: BarChart3,
                title: 'Weekly Reports',
                desc: 'Get detailed weekly performance reports to track your learning journey.',
              },
              {
                icon: Code2,
                title: 'Multi-Platform',
                desc: 'Track problems from LeetCode, Codeforces, HackerRank, and more in one place.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="card-glass rounded-xl p-8 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 card-hover group"
                >
                  <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-primary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 hero-gradient">
        <div className="max-w-2xl mx-auto text-center fade-in">
          <h2 className="section-title mb-6">Ready to Master Interviews?</h2>
          <p className="section-subtitle mb-8">
            Start tracking your progress today and level up your coding skills
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 group text-lg px-8 py-4">
            Launch Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700/50 py-8 px-4 bg-dark-900/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 DevTrack. Built with ❤️ by developers, for developers.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
