# DevTrack - Developer Productivity & Interview Preparation Platform

A comprehensive, production-ready web application designed specifically for **developers preparing for technical interviews**. DevTrack helps you track coding practice across **DSA (Data Structures & Algorithms)**, **Core CS Fundamentals**, and **Tech Stack** topics while providing detailed analytics, goal tracking, and personalized improvement recommendations.

## 🎯 Key Features

### 📊 **Dashboard**
- Overview of your learning journey with key metrics
- Weekly progress visualization
- Study category breakdown (DSA, Core CS, Tech Stack)
- Performance comparison vs targets
- Coding activity heatmap
- Recent study sessions and achievements
- Learning path with recommended next steps

### 📝 **Study Log**
- Log study sessions with detailed information:
  - **Category**: DSA, Core CS, or Tech Stack
  - **Topic**: Auto-populated suggestions
  - **Platform**: LeetCode, Codeforces, Coursera, etc.
  - **Difficulty Level**: Easy, Medium, Hard
  - **Time Spent**: Track study hours accurately
- Filter sessions by category
- Track problems solved or units completed
- Organized history of all study sessions

### 🎯 **Learning Goals**
- Set SMART goals with deadlines
- Track progress towards mastery
- Priority-based goal management (Low, Medium, High)
- Deadline tracking with days remaining
- Visual progress indicators
- Goal completion tracking
- Recommended action plans

### 📚 **Learning Resources**
- Curate and organize learning materials
- Add resources from any platform (Articles, Blogs, Courses, Books, etc.)
- Categorize by learning area
- Mark favorites for quick access
- Add personal notes and insights
- Filter by category and type
- Direct links to resources
- Resource stats and analytics

### 📈 **Analytics Dashboard**
- **Topic-wise Performance**: See which topics you excel at
- **Weekly Productivity**: Track hours spent and problems solved
- **Accuracy Trends**: Monitor your improvement over time
- **Weak Area Analysis**: Identify struggles with recommended fixes
- **Performance Charts**: Visual insights with interactive graphs
- **Category Breakdown**: See how you're balancing DSA, Core CS, Tech Stack

### 🔍 **Weak Areas Analysis**
- AI-powered identification of weak topics
- Severity levels: Critical, High, Medium, Low
- Detailed improvement recommendations
- Related topics to strengthen
- Suggested study hours for each weak area
- Step-by-step action plans
- General improvement tips and strategies

### 👤 **Profile & Progress**
- User profile management
- Streak tracking (current and longest)
- Achievement badges
- Statistics overview
- GitHub integration ready
- Preference settings
- Learning preferences

### 📊 **Comparison & Benchmarking**
- Compare your accuracy vs targets
- See average performance metrics
- Topic-wise performance bars
- Personalized insights and recommendations

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+ and npm installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Navigate to the project**:
   ```bash
   cd DevTrack
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Create environment configuration** (optional):
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if you have a backend API:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=DevTrack
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Automatic: Your default browser opens at `http://localhost:5173`
   - Manual: Visit `http://localhost:5173`

### Building for Production

```bash
npm run build    # Creates optimized bundle in 'dist' folder
npm run preview  # Preview production build locally
```

---

## 📁 Project Structure

```
DevTrack/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Side navigation menu
│   │   ├── StatsCard.jsx       # Statistics display card
│   │   ├── ChartComponent.jsx  # Bar/Line charts
│   │   ├── HeatmapChart.jsx    # GitHub-style heatmap
│   │   ├── QuickStatsBar.jsx   # Quick stats overview
│   │   ├── ProgressTracker.jsx # Learning path tracker
│   │   └── ComparisonChart.jsx # Performance comparison
│   │
│   ├── pages/                   # Full page components
│   │   ├── LandingPage.jsx     # Welcome & features
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── StudyLog.jsx        # Log study sessions
│   │   ├── Goals.jsx           # Goal management
│   │   ├── Resources.jsx       # Resource organization
│   │   ├── Analytics.jsx       # Detailed analytics
│   │   ├── WeakAreas.jsx       # Weak area analysis
│   │   ├── Profile.jsx         # User profile
│   │   └── NotFound.jsx        # 404 page
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useLocalStorage.js  # Persist data locally
│   │
│   ├── services/                # API & service functions
│   │   └── api.js              # Axios configuration
│   │
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
└── README.md                    # This file
```

---

## 🎨 Design System & Architecture

### Color Palette
- **Primary**: Blue (`#0ea5e9`) - Main CTA and accents
- **Dark**: Slate-950 (`#030712`) - Background
- **Success**: Emerald (`#10b981`) - Positive actions
- **Warning**: Amber (`#f59e0b`) - Warnings
- **Danger**: Red (`#ef4444`) - Critical alerts

### Typography
- **Font**: Inter (modern, clean)
- **Weights**: 400, 500, 600, 700
- **Responsive headings**: Scales from mobile to desktop

### Spacing & Layout
- **Base Unit**: 4px
- **Grid**: 12-column responsive
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Component spacing**: 8px - 32px

### Accessibility
- WCAG 2.1 compliant
- Keyboard navigation support
- High contrast ratios
- ARIA labels where needed

---

## 🧩 Key Components Documentation

### StatsCard
Displays key metrics with color coding.
```jsx
<StatsCard 
  icon={BookOpen}
  label="Problems Solved"
  value="247"
  change="+12 this week"
  color="primary"
/>
```

### QuickStatsBar
Shows 4 quick stats about goals, weak areas, resources, and streak.

### ProgressTracker
Visual learning path with phases and recommended next steps.

### ComparisonChart
Bar chart comparing your performance vs targets across topics.

### HeatmapChart
GitHub-style contribution graph for study activity.

---

## � API Integration Ready

The frontend is ready to connect with a backend API. Set your API URL:

```javascript
// .env.local
VITE_API_URL=http://localhost:5000
```

### Expected API Endpoints

```
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/study-sessions
GET    /api/study-sessions
PUT    /api/study-sessions/:id
DELETE /api/study-sessions/:id

POST   /api/goals
GET    /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id

POST   /api/resources
GET    /api/resources
DELETE /api/resources/:id

GET    /api/analytics/dashboard
GET    /api/analytics/weak-areas
GET    /api/user/profile
PUT    /api/user/profile
```

See `src/services/api.js` for the configured Axios client.

---

## � Data Persistence

Currently uses **localStorage** for demo data. When connected to backend:

1. Remove `useLocalStorage` hooks
2. Replace with API calls using the configured Axios client
3. Implement proper authentication with JWT tokens
4. Add error handling and loading states

---

## 🎓 Features for Students

### What Makes DevTrack Effective for Interview Prep:

✅ **Multi-Category Learning**
   - Track DSA problems alongside Core CS and practical tech
   - No more fragmented learning

✅ **Weakness Identification**  
   - Automatic detection of struggling areas
   - Personalized improvement plans
   - Related topics to strengthen

✅ **Goal-Oriented Progress**
   - Set measurable targets with deadlines
   - Track progress visually
   - Stay motivated with streak counting

✅ **Learning Path Visualization**
   - See your journey from fundamentals to interviews
   - Know what to learn next
   - Understand topic dependencies

✅ **Curated Resource Management**
   - Save and organize all learning materials
   - Rate and review resources
   - Quick access to favorites

✅ **Data-Driven Insights**
   - Detailed analytics about your progress
   - Performance comparisons
   - Actionable recommendations

✅ **Consistency Tracking**
   - Daily streak counter
   - Activity heatmap
   - Weekly productivity metrics

---

## 🛠️ Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |

---

## 📦 Tech Stack

### Frontend
- **React 18**: UI framework
- **Vite 5**: Lightning-fast build tool
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive charts & visualizations
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons

### Development
- **ESLint**: Code quality
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000  # Use different port
```

### Styles Not Applying
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### API Connection Issues
1. Check backend is running on configured port
2. Verify `VITE_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure proper authentication headers

### localStorage Warnings
Normal in development. Will be replaced with backend API calls.

---

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📚 Learning Resources

### To Extend This Project:
1. **Add Backend**: Node.js + Express + MongoDB
2. **User Auth**: JWT-based authentication
3. **Real Analytics**: Advanced metrics and ML insights
4. **Mobile App**: React Native version
5. **Notifications**: Email/SMS updates on goals
6. **Community**: Forums and peer learning
7. **AI Assistant**: GPT-powered study recommendations

### Beginner Concepts Used:
- React Hooks (useState, useEffect)
- Component composition
- Props drilling (can be improved with Context)
- Local state management
- Event handling
- Conditional rendering
- List rendering

---

## 🤝 Contributing

This is an open-source educational project. Feel free to:
- Fork and customize for personal use
- Improve UI/UX design
- Add new features and pages
- Connect with real backend
- Share improvements back

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🎉 Next Steps for You

**Immediate**:
1. ✅ Run the app locally
2. ✅ Explore all pages
3. ✅ Add your first study session
4. ✅ Set learning goals

**Short-term**:
1. Connect with a real backend
2. Add user authentication
3. Implement data persistence
4. Customize dashboard

**Long-term**:
1. Build mobile app
2. Add social features
3. Implement AI recommendations
4. Create community features

---

## 📞 Support

- Found a bug? Check the code and improve it
- Have a feature idea? Implement it and learn
- Need help? Review the code comments and documentation

---

**Built with ❤️ by developers, for developers**

Remember: **Consistency is key to mastering interview questions. Use DevTrack to stay on track!** 🚀

Happy coding and interview prep! 💪

# DevTrack
