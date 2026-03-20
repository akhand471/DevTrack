import React from 'react'
import { CheckCircle, Clock, Zap } from 'lucide-react'
import { dsaSubcategoryNames } from '../data/dsaTopics'

const ProgressTracker = () => {
  const learningPath = [
    {
      id: 1,
      name: 'Fundamentals',
      completed: true,
      items: ['Arrays & Strings', 'Hashing', 'Sorting & Searching', 'Recursion & Backtracking'],
    },
    {
      id: 2,
      name: 'Core Data Structures',
      completed: false,
      progress: 60,
      items: ['Linked Lists', 'Stacks & Queues', 'Trees', 'Heaps & Priority Queues', 'Tries'],
    },
    {
      id: 3,
      name: 'Advanced Algorithms',
      completed: false,
      progress: 30,
      items: ['Graphs', 'Dynamic Programming', 'Greedy Algorithms', 'Bit Manipulation'],
    },
    {
      id: 4,
      name: 'Expert & Interview Prep',
      completed: false,
      progress: 0,
      items: ['Math & Number Theory', 'Advanced Topics', 'System Design', 'Mock Interviews'],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Learning Path</h2>
        <div className="space-y-4">
          {learningPath.map((phase, idx) => (
            <div key={phase.id} className="card-glass rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                {phase.completed && <CheckCircle className="text-emerald-400" size={24} />}
                <h3 className="text-lg font-bold">{phase.name}</h3>
                <span className="text-xs text-gray-500 ml-auto">{idx + 1}/4</span>
              </div>

              {!phase.completed && phase.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-semibold text-primary-400">{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              )}

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

      {/* Recommended Next Steps */}
      <div className="card-glass rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-amber-400" />
          Recommended Next Steps
        </h3>
        <div className="space-y-3">
          {[
            {
              task: 'Complete Graph Algorithms module',
              difficulty: 'Hard',
              timeEstimate: '10 hours',
            },
            {
              task: 'Practice 5 Dynamic Programming problems',
              difficulty: 'Medium',
              timeEstimate: '8 hours',
            },
            {
              task: 'Read System Design handbook',
              difficulty: 'Medium',
              timeEstimate: '6 hours',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg">
              <div className="mt-1 text-primary-400">▶</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.task}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500">
                    {item.difficulty === 'Hard' ? '🔴' : item.difficulty === 'Medium' ? '🟡' : '🟢'} {item.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {item.timeEstimate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker
