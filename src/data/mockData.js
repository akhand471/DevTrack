/**
 * mockData.js
 * Single source of truth for all demo / showcase data.
 * All service files read from (and mutate) this module via localStorage.
 */

// ── Demo User ──────────────────────────────────────────────────────────────
export const DEMO_USER = {
  _id: 'demo-user-001',
  name: 'Akhand Pratap Singh',
  email: 'akhand@devtrack.io',
  githubUsername: 'akhand-dev',
  isEmailVerified: true,
  currentStreak: 14,
  longestStreak: 30,
  bio: 'CS undergrad | Targeting FAANG | DSA enthusiast',
  location: 'New Delhi, India',
  createdAt: '2026-01-15T00:00:00Z',
  token: 'demo-jwt-token-showcase',
}

// ── Study Sessions ─────────────────────────────────────────────────────────
const today = new Date()
const daysAgo = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const DEMO_SESSIONS = [
  {
    _id: 's001',
    topic: 'Binary Search',
    category: 'DSA',
    platform: 'LeetCode',
    problemsSolved: 8,
    timeSpent: 90,
    difficulty: 'Medium',
    date: daysAgo(0),
  },
  {
    _id: 's002',
    topic: 'Dynamic Programming',
    category: 'DSA',
    platform: 'Codeforces',
    problemsSolved: 5,
    timeSpent: 120,
    difficulty: 'Hard',
    date: daysAgo(1),
  },
  {
    _id: 's003',
    topic: 'Operating Systems',
    category: 'Core CS',
    platform: 'MIT OpenCourseWare',
    problemsSolved: 3,
    timeSpent: 75,
    difficulty: 'Medium',
    date: daysAgo(2),
  },
  {
    _id: 's004',
    topic: 'React',
    category: 'Tech Stack',
    platform: 'Official Docs',
    problemsSolved: 10,
    timeSpent: 60,
    difficulty: 'Easy',
    date: daysAgo(3),
  },
  {
    _id: 's005',
    topic: 'Graphs — BFS & DFS',
    category: 'DSA',
    platform: 'LeetCode',
    problemsSolved: 6,
    timeSpent: 100,
    difficulty: 'Medium',
    date: daysAgo(4),
  },
  {
    _id: 's006',
    topic: 'System Design',
    category: 'Core CS',
    platform: 'YouTube',
    problemsSolved: 2,
    timeSpent: 90,
    difficulty: 'Hard',
    date: daysAgo(5),
  },
  {
    _id: 's007',
    topic: 'Trees — BST',
    category: 'DSA',
    platform: 'GeeksforGeeks',
    problemsSolved: 7,
    timeSpent: 80,
    difficulty: 'Medium',
    date: daysAgo(6),
  },
  {
    _id: 's008',
    topic: 'Node.js',
    category: 'Tech Stack',
    platform: 'Tutorials',
    problemsSolved: 4,
    timeSpent: 50,
    difficulty: 'Easy',
    date: daysAgo(7),
  },
  {
    _id: 's009',
    topic: 'Linked Lists',
    category: 'DSA',
    platform: 'LeetCode',
    problemsSolved: 9,
    timeSpent: 70,
    difficulty: 'Easy',
    date: daysAgo(8),
  },
  {
    _id: 's010',
    topic: 'Database Management',
    category: 'Core CS',
    platform: 'Coursera',
    problemsSolved: 5,
    timeSpent: 85,
    difficulty: 'Medium',
    date: daysAgo(9),
  },
  {
    _id: 's011',
    topic: 'Stacks & Queues',
    category: 'DSA',
    platform: 'HackerRank',
    problemsSolved: 12,
    timeSpent: 65,
    difficulty: 'Easy',
    date: daysAgo(11),
  },
  {
    _id: 's012',
    topic: 'Docker',
    category: 'Tech Stack',
    platform: 'Official Docs',
    problemsSolved: 3,
    timeSpent: 55,
    difficulty: 'Medium',
    date: daysAgo(14),
  },
  {
    _id: 's013',
    topic: 'Recursion & Backtracking',
    category: 'DSA',
    platform: 'LeetCode',
    problemsSolved: 6,
    timeSpent: 95,
    difficulty: 'Hard',
    date: daysAgo(16),
  },
  {
    _id: 's014',
    topic: 'Computer Networks',
    category: 'Core CS',
    platform: 'MIT OpenCourseWare',
    problemsSolved: 4,
    timeSpent: 70,
    difficulty: 'Medium',
    date: daysAgo(18),
  },
  {
    _id: 's015',
    topic: 'Heap & Priority Queue',
    category: 'DSA',
    platform: 'Codeforces',
    problemsSolved: 5,
    timeSpent: 75,
    difficulty: 'Hard',
    date: daysAgo(21),
  },
]

// ── Goals ──────────────────────────────────────────────────────────────────
const futureDate = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export const DEMO_GOALS = [
  {
    _id: 'g001',
    title: 'Master Dynamic Programming',
    category: 'DSA',
    targetProblems: 50,
    currentProblems: 32,
    deadline: futureDate(25),
    priority: 'High',
    status: 'In Progress',
  },
  {
    _id: 'g002',
    title: 'Complete System Design Course',
    category: 'Core CS',
    targetProblems: 20,
    currentProblems: 20,
    deadline: futureDate(-5),
    priority: 'High',
    status: 'Completed',
  },
  {
    _id: 'g003',
    title: 'Solve 100 LeetCode Graphs Problems',
    category: 'DSA',
    targetProblems: 100,
    currentProblems: 58,
    deadline: futureDate(40),
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    _id: 'g004',
    title: 'Build a Full-Stack Project with React',
    category: 'Tech Stack',
    targetProblems: 10,
    currentProblems: 7,
    deadline: futureDate(15),
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    _id: 'g005',
    title: 'Finish OS & DBMS Fundamentals',
    category: 'Core CS',
    targetProblems: 30,
    currentProblems: 30,
    deadline: futureDate(-10),
    priority: 'High',
    status: 'Completed',
  },
  {
    _id: 'g006',
    title: 'Practice Linked List Problems',
    category: 'DSA',
    targetProblems: 25,
    currentProblems: 25,
    deadline: futureDate(-3),
    priority: 'Low',
    status: 'Completed',
  },
]

// ── Resources ──────────────────────────────────────────────────────────────
export const DEMO_RESOURCES = [
  {
    _id: 'r001',
    title: 'Striver\'s A2Z DSA Sheet',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    type: 'Course',
    category: 'DSA',
    isFavorite: true,
    notes: 'Best structured DSA course — follow daily',
    rating: 5,
    createdAt: daysAgo(20),
  },
  {
    _id: 'r002',
    title: 'NeetCode 150 — LeetCode Roadmap',
    url: 'https://neetcode.io/',
    type: 'Course',
    category: 'DSA',
    isFavorite: true,
    notes: 'Top patterns for FAANG interviews',
    rating: 5,
    createdAt: daysAgo(25),
  },
  {
    _id: 'r003',
    title: 'Grokking System Design Interview',
    url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
    type: 'Course',
    category: 'Core CS',
    isFavorite: true,
    notes: 'Essential for senior roles',
    rating: 4,
    createdAt: daysAgo(18),
  },
  {
    _id: 'r004',
    title: 'React Official Docs',
    url: 'https://react.dev/',
    type: 'Documentation',
    category: 'Tech Stack',
    isFavorite: false,
    notes: 'New docs with hooks focus',
    rating: 5,
    createdAt: daysAgo(10),
  },
  {
    _id: 'r005',
    title: 'CS50 — Harvard OpenCourseWare',
    url: 'https://cs50.harvard.edu/x/',
    type: 'Course',
    category: 'Core CS',
    isFavorite: true,
    notes: 'Great for brushing up fundamentals',
    rating: 5,
    createdAt: daysAgo(30),
  },
  {
    _id: 'r006',
    title: 'The Algorithm Design Manual — Skiena',
    url: 'https://www.algorist.com/',
    type: 'Book',
    category: 'DSA',
    isFavorite: false,
    notes: 'Deep theoretical insights',
    rating: 4,
    createdAt: daysAgo(35),
  },
  {
    _id: 'r007',
    title: 'Node.js Official Documentation',
    url: 'https://nodejs.org/docs/',
    type: 'Documentation',
    category: 'Tech Stack',
    isFavorite: false,
    notes: 'API reference for v20+',
    rating: 4,
    createdAt: daysAgo(12),
  },
  {
    _id: 'r008',
    title: 'Abdul Bari\'s Algorithm Playlist',
    url: 'https://www.youtube.com/c/AbdulBari',
    type: 'Blog',
    category: 'DSA',
    isFavorite: true,
    notes: 'Clear visual explanations of complex algos',
    rating: 5,
    createdAt: daysAgo(22),
  },
]

// ── Analytics — Topic Performance ─────────────────────────────────────────
export const DEMO_TOPIC_PERFORMANCE = [
  { topic: 'Binary Search', category: 'DSA', totalProblems: 22, avgDifficulty: 2.1 },
  { topic: 'Dynamic Programming', category: 'DSA', totalProblems: 32, avgDifficulty: 2.8 },
  { topic: 'Graphs', category: 'DSA', totalProblems: 28, avgDifficulty: 2.5 },
  { topic: 'Linked Lists', category: 'DSA', totalProblems: 18, avgDifficulty: 1.7 },
  { topic: 'Trees', category: 'DSA', totalProblems: 24, avgDifficulty: 2.2 },
  { topic: 'Stacks & Queues', category: 'DSA', totalProblems: 14, avgDifficulty: 1.5 },
  { topic: 'Heap', category: 'DSA', totalProblems: 10, avgDifficulty: 2.6 },
  { topic: 'Recursion', category: 'DSA', totalProblems: 16, avgDifficulty: 2.4 },
  { topic: 'Operating Systems', category: 'Core CS', totalProblems: 8, avgDifficulty: 2.3 },
  { topic: 'System Design', category: 'Core CS', totalProblems: 12, avgDifficulty: 2.9 },
  { topic: 'DBMS', category: 'Core CS', totalProblems: 10, avgDifficulty: 2.1 },
  { topic: 'Computer Networks', category: 'Core CS', totalProblems: 7, avgDifficulty: 2.4 },
  { topic: 'React', category: 'Tech Stack', totalProblems: 15, avgDifficulty: 1.8 },
  { topic: 'Node.js', category: 'Tech Stack', totalProblems: 9, avgDifficulty: 2.0 },
  { topic: 'Docker', category: 'Tech Stack', totalProblems: 6, avgDifficulty: 2.2 },
]

export const DEMO_OVERALL_STATS = {
  totalProblems: 241,
  totalTimeHours: 94,
  uniqueTopicsCount: 15,
  totalSessions: DEMO_SESSIONS.length,
}

// 7 weeks of weekly progress
export const DEMO_WEEKLY_PROGRESS = [
  { week: 'Week 1', totalProblems: 18, totalTime: 300, sessions: 4 },
  { week: 'Week 2', totalProblems: 25, totalTime: 420, sessions: 5 },
  { week: 'Week 3', totalProblems: 22, totalTime: 380, sessions: 4 },
  { week: 'Week 4', totalProblems: 30, totalTime: 510, sessions: 6 },
  { week: 'Week 5', totalProblems: 35, totalTime: 560, sessions: 7 },
  { week: 'Week 6', totalProblems: 40, totalTime: 620, sessions: 8 },
  { week: 'Week 7', totalProblems: 38, totalTime: 590, sessions: 7 },
]

export const DEMO_CATEGORY_BREAKDOWN = [
  { category: 'DSA', totalProblems: 164 },
  { category: 'Core CS', totalProblems: 42 },
  { category: 'Tech Stack', totalProblems: 35 },
]

// ── Weak Areas ──────────────────────────────────────────────────────────────
export const DEMO_WEAK_AREAS = [
  {
    topic: 'Dynamic Programming',
    category: 'DSA',
    severity: 'High',
    avgAccuracy: 52,
    suggestedHours: 15,
    relatedTopics: ['Recursion', 'Memoization', 'Greedy'],
    recommendations: [
      'Start with 1D DP problems (Fibonacci, Climbing Stairs)',
      'Practice pattern identification — knapsack, LCS, LIS',
      'Solve minimum 3 DP problems daily for 2 weeks',
    ],
  },
  {
    topic: 'Heap / Priority Queue',
    category: 'DSA',
    severity: 'High',
    avgAccuracy: 48,
    suggestedHours: 8,
    relatedTopics: ['Greedy', 'Sorting', 'Graphs'],
    recommendations: [
      'Understand min-heap vs max-heap implementation',
      'Practice Top K problems (K Largest Elements, K Closest Points)',
      'Focus on Dijkstra\'s algorithm using heaps',
    ],
  },
  {
    topic: 'System Design',
    category: 'Core CS',
    severity: 'Medium',
    avgAccuracy: 60,
    suggestedHours: 12,
    relatedTopics: ['Databases', 'Caching', 'Load Balancing'],
    recommendations: [
      'Study Grokking System Design Interview',
      'Design URL shortener, chat system, news feed',
      'Learn about CAP theorem and trade-offs',
    ],
  },
  {
    topic: 'Graph Algorithms',
    category: 'DSA',
    severity: 'Medium',
    avgAccuracy: 65,
    suggestedHours: 10,
    relatedTopics: ['BFS', 'DFS', 'Dijkstra', 'Union-Find'],
    recommendations: [
      'Master BFS and DFS templates',
      'Practice Topological Sort and cycle detection',
      'Solve classic graph problems: shortest path, MST',
    ],
  },
]
