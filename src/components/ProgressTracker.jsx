import React from 'react'
import { CheckCircle, Clock, Zap } from 'lucide-react'

/**
 * ProgressTracker — shows a static DSA learning path roadmap.
 * Phase completion and progress are NOT displayed since they would
 * require real session data. Phases are shown as a reference guide only.
 */
const ProgressTracker = () => {
  const learningPath = [
    {
      id: 1,
      name: 'Fundamentals',
      items: ['Arrays & Strings', 'Hashing', 'Sorting & Searching', 'Recursion & Backtracking'],
    },
    {
      id: 2,
      name: 'Core Data Structures',
      items: ['Linked Lists', 'Stacks & Queues', 'Trees', 'Heaps & Priority Queues', 'Tries'],
    },
    {
      id: 3,
      name: 'Advanced Algorithms',
      items: ['Graphs', 'Dynamic Programming', 'Greedy Algorithms', 'Bit Manipulation'],
    },
    {
      id: 4,
      name: 'Expert & Interview Prep',
      items: ['Math & Number Theory', 'Advanced Topics', 'System Design', 'Mock Interviews'],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Learning Path</h2>
        <p className="text-sm text-gray-500 mb-6">
          Use this roadmap as a reference. Log study sessions against these topics to track your real progress.
        </p>
        <div className="space-y-4">
          {learningPath.map((phase, idx) => (
            <div key={phase.id} className="card-glass rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold">{phase.name}</h3>
                <span className="text-xs text-gray-500 ml-auto">Phase {idx + 1}/4</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {phase.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="text-xs bg-dark-800/50 rounded p-2 text-gray-400 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip panel — generic advice, not fake data */}
      <div className="card-glass rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-amber-400" />
          How to use this tracker
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p>📝 Go to <span className="text-primary-400 font-medium">Study Log</span> and log a session for any topic above.</p>
          <p>📊 Your <span className="text-primary-400 font-medium">Dashboard</span> will automatically show your top topics and progress.</p>
          <p>🔍 Visit <span className="text-primary-400 font-medium">Weak Areas</span> to see which topics need more attention based on your logged sessions.</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker
