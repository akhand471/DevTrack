import React, { useState, useEffect } from 'react'
import { User, Github, Mail, Edit2, Save, X, Award, Flame, Target, Loader } from 'lucide-react'
import userService from '../services/userService'

const ToggleSwitch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`toggle-switch ${checked ? 'active' : ''}`}
  >
    <span className="toggle-dot" />
  </button>
)

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    githubUsername: '',
    bio: '',
    location: '',
    currentStreak: 0,
    longestStreak: 0,
    totalProblems: 0,
    totalHours: 0,
  })

  const [editData, setEditData] = useState({})

  // Preferences stay in localStorage (client-side only)
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('devtrack-prefs')
      return saved ? JSON.parse(saved) : { emailNotifications: true, weeklySummary: true, darkMode: true }
    } catch { return { emailNotifications: true, weeklySummary: true, darkMode: true } }
  })

  const savePrefs = (newPrefs) => {
    setPrefs(newPrefs)
    localStorage.setItem('devtrack-prefs', JSON.stringify(newPrefs))
  }

  // ── Fetch profile + stats from API ────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const [profileRes, statsRes] = await Promise.all([
          userService.getProfile(),
          userService.getStats(),
        ])

        const p = profileRes.data || {}
        const s = statsRes.data || {}

        setProfile({
          name: p.name || '',
          email: p.email || '',
          githubUsername: p.githubUsername || '',
          bio: p.bio || '',
          location: p.location || '',
          currentStreak: s.currentStreak || p.currentStreak || 0,
          longestStreak: s.longestStreak || p.longestStreak || 0,
          totalProblems: s.totalProblems || 0,
          totalHours: s.totalHours || 0,
        })
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // ── Save profile edits ────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await userService.updateProfile({
        name: editData.name,
        bio: editData.bio,
        githubUsername: editData.githubUsername,
        location: editData.location,
      })

      if (res.success) {
        setProfile({ ...profile, ...res.data })
        setIsEditing(false)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({})
    setIsEditing(false)
  }

  const startEdit = () => {
    setEditData({ ...profile })
    setIsEditing(true)
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your coding journey</p>
        </div>
        {!isEditing && (
          <button
            onClick={startEdit}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 size={20} />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {/* Profile Card */}
      <div className="card-glass rounded-xl p-8">
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
            <User size={48} className="text-white" />
          </div>

          {/* Basic Info */}
          {isEditing ? (
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  className="input-field opacity-50 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
              <p className="text-gray-400 flex items-center gap-2 mb-2">
                <Mail size={16} />
                {profile.email}
              </p>
              {profile.githubUsername && (
                <p className="text-gray-400 flex items-center gap-2">
                  <Github size={16} />
                  {profile.githubUsername}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bio and Details */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="input-field resize-none h-24"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={editData.location || ''}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Username</label>
              <input
                type="text"
                value={editData.githubUsername || ''}
                onChange={(e) => setEditData({ ...editData, githubUsername: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 flex-1">
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={handleCancel} className="btn-secondary flex items-center gap-2 flex-1">
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {profile.bio && <p className="text-gray-300 mb-4">{profile.bio}</p>}
            {profile.location && <p className="text-gray-400 text-sm">📍 {profile.location}</p>}
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        <div className="card-glass rounded-xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Flame className="text-primary-400" size={24} />
          </div>
          <p className="text-gray-400 text-sm mb-2">Current Streak</p>
          <h3 className="text-3xl font-bold text-primary-400 mb-1">{profile.currentStreak}</h3>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div className="card-glass rounded-xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="text-amber-400" size={24} />
          </div>
          <p className="text-gray-400 text-sm mb-2">Longest Streak</p>
          <h3 className="text-3xl font-bold text-amber-400 mb-1">{profile.longestStreak}</h3>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div className="card-glass rounded-xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="text-emerald-400" size={24} />
          </div>
          <p className="text-gray-400 text-sm mb-2">Problems Solved</p>
          <h3 className="text-3xl font-bold text-emerald-400 mb-1">{profile.totalProblems}</h3>
          <p className="text-xs text-gray-500">total</p>
        </div>

        <div className="card-glass rounded-xl p-6 text-center card-hover">
          <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="text-sky-400" size={24} />
          </div>
          <p className="text-gray-400 text-sm mb-2">Study Hours</p>
          <h3 className="text-3xl font-bold text-sky-400 mb-1">{profile.totalHours}</h3>
          <p className="text-xs text-gray-500">hours</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="card-glass rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Achievements 🏆</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-in">
          {[
            { icon: '🔥', title: 'Week Warrior', desc: 'Maintained 7-day streak', earned: profile.longestStreak >= 7 },
            { icon: '⚡', title: 'Speed Demon', desc: 'Solved 50+ problems', earned: profile.totalProblems >= 50 },
            { icon: '🎯', title: 'Consistency King', desc: '30-day streak achieved', earned: profile.longestStreak >= 30 },
            { icon: '🌟', title: 'Problem Master', desc: 'Solved 200+ problems', earned: profile.totalProblems >= 200 },
            { icon: '📈', title: 'Rising Star', desc: 'Studied for 20+ hours', earned: profile.totalHours >= 20 },
            { icon: '💪', title: 'Hundred Club', desc: 'Solved 100+ problems', earned: profile.totalProblems >= 100 },
          ].map((badge, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border flex items-start gap-4 card-hover ${badge.earned
                  ? 'bg-gradient-to-r from-primary-500/10 to-transparent border-primary-500/20'
                  : 'bg-dark-800/30 border-dark-700/30 opacity-50'
                }`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{badge.title}</h3>
                <p className="text-xs text-gray-500">{badge.desc}</p>
                {badge.earned && <p className="text-xs text-emerald-400 mt-1">✓ Earned!</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="card-glass rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-dark-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-gray-500">Get updates about your progress</p>
            </div>
            <ToggleSwitch
              checked={prefs.emailNotifications}
              onChange={() => savePrefs({ ...prefs, emailNotifications: !prefs.emailNotifications })}
              label="Email Notifications"
            />
          </div>
          <div className="flex justify-between items-center p-4 bg-dark-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold">Weekly Summary</h3>
              <p className="text-sm text-gray-500">Receive weekly performance reports</p>
            </div>
            <ToggleSwitch
              checked={prefs.weeklySummary}
              onChange={() => savePrefs({ ...prefs, weeklySummary: !prefs.weeklySummary })}
              label="Weekly Summary"
            />
          </div>
          <div className="flex justify-between items-center p-4 bg-dark-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold">Dark Mode</h3>
              <p className="text-sm text-gray-500">Always use dark mode</p>
            </div>
            <ToggleSwitch
              checked={prefs.darkMode}
              onChange={() => savePrefs({ ...prefs, darkMode: !prefs.darkMode })}
              label="Dark Mode"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
