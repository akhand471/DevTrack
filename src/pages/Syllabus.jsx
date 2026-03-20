import React, { useState, useMemo } from 'react'
import { CheckCircle, Circle, AlertTriangle, ExternalLink, Search, Filter } from 'lucide-react'
import { dsaSubcategories } from '../data/dsaTopics'
import useLocalStorage from '../hooks/useLocalStorage'

const STATUS = {
    NOT_STARTED: 'NOT_STARTED',
    COMPLETED: 'COMPLETED',
    REVISION: 'REVISION',
}

const Syllabus = () => {
    // Store topic statuses: { "Array": "COMPLETED", "Binary Search": "REVISION" }
    const [topicStatus, setTopicStatus] = useLocalStorage('devtrack-syllabus-status', {})
    const [filter, setFilter] = useState('ALL') // 'ALL', 'PENDING', 'REVISION', 'COMPLETED'
    const [searchQuery, setSearchQuery] = useState('')

    const handleStatusChange = (topic) => {
        const currentStatus = topicStatus[topic] || STATUS.NOT_STARTED
        let newStatus

        // Cycle: NOT_STARTED -> COMPLETED -> REVISION -> NOT_STARTED
        if (currentStatus === STATUS.NOT_STARTED) newStatus = STATUS.COMPLETED
        else if (currentStatus === STATUS.COMPLETED) newStatus = STATUS.REVISION
        else newStatus = STATUS.NOT_STARTED

        setTopicStatus({ ...topicStatus, [topic]: newStatus })
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case STATUS.COMPLETED:
                return <CheckCircle className="text-emerald-500" size={20} />
            case STATUS.REVISION:
                return <AlertTriangle className="text-amber-500" size={20} />
            default:
                return <Circle className="text-gray-600 group-hover:text-gray-400" size={20} />
        }
    }

    const handleResourceSearch = (topic, e) => {
        e.stopPropagation()
        // Open LeetCode search for this topic
        window.open(`https://leetcode.com/problemset/all/?search=${encodeURIComponent(topic)}`, '_blank')
    }

    // Calculate overall progress
    const { totalVisibleTopics, completedCount, revisionCount } = useMemo(() => {
        let total = 0
        let completed = 0
        let revision = 0

        dsaSubcategories.forEach(sub => {
            sub.topics.forEach(topic => {
                total++
                const status = topicStatus[topic]
                if (status === STATUS.COMPLETED) completed++
                if (status === STATUS.REVISION) revision++
            })
        })

        return { totalVisibleTopics: total, completedCount: completed, revisionCount: revision }
    }, [topicStatus])

    const overallProgress = totalVisibleTopics === 0 ? 0 : Math.round((completedCount / totalVisibleTopics) * 100)

    // Filter the subcategories based on search and active filter
    const filteredSyllabus = useMemo(() => {
        return dsaSubcategories.map(sub => {
            const filteredTopics = sub.topics.filter(topic => {
                const matchesSearch = topic.toLowerCase().includes(searchQuery.toLowerCase())
                const status = topicStatus[topic] || STATUS.NOT_STARTED

                let matchesFilter = true
                if (filter === 'PENDING') matchesFilter = status === STATUS.NOT_STARTED
                if (filter === 'REVISION') matchesFilter = status === STATUS.REVISION
                if (filter === 'COMPLETED') matchesFilter = status === STATUS.COMPLETED

                return matchesSearch && matchesFilter
            })

            return { ...sub, topics: filteredTopics }
        }).filter(sub => sub.topics.length > 0)
    }, [searchQuery, filter, topicStatus])

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header and Global Progress */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 fade-in">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">DSA Syllabus Tracker</h1>
                    <p className="text-gray-400">Master every topic systematically. Mark items for revision, or dive straight into practice.</p>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center gap-4 bg-dark-800/80 p-4 rounded-2xl border border-dark-700">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-dark-700"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-primary-500 drop-shadow-[0_0_8px_rgba(var(--primary-500),0.5)] transition-all duration-1000"
                                strokeDasharray={`${overallProgress}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold">{overallProgress}%</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Overall Progress</p>
                        <p className="text-lg font-bold">
                            <span className="text-emerald-400">{completedCount}</span>
                            <span className="text-gray-600 mx-1">/</span>
                            <span>{totalVisibleTopics}</span> topics
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-dark-900/50 p-2 rounded-xl border border-dark-700/50 sticky top-[80px] z-30 backdrop-blur-md fade-in delay-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search topics (e.g., 'Dynamic Programming')..."
                        className="w-full bg-dark-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-transparent focus:border-primary-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    {['ALL', 'PENDING', 'REVISION', 'COMPLETED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
                ${filter === f
                                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                    : 'bg-dark-800 text-gray-400 hover:text-white border border-transparent hover:border-dark-600'
                                }`}
                        >
                            {f === 'ALL' && <Filter size={14} />}
                            {f === 'PENDING' && <Circle size={14} />}
                            {f === 'REVISION' && <AlertTriangle size={14} />}
                            {f === 'COMPLETED' && <CheckCircle size={14} />}
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-in">
                {filteredSyllabus.map((sub, idx) => {
                    // Calculate subcategory progress
                    const originalSub = dsaSubcategories.find(s => s.name === sub.name)
                    const totalSub = originalSub.topics.length
                    const completedSub = originalSub.topics.filter(t => topicStatus[t] === STATUS.COMPLETED).length
                    const subProgress = Math.round((completedSub / totalSub) * 100)

                    return (
                        <div key={idx} className="card-glass rounded-xl p-5 border border-dark-700/50 flex flex-col h-full hover:border-primary-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-xl shadow-inner border border-dark-700">
                                        {sub.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white leading-tight">{sub.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{completedSub} of {totalSub} completed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sub Progress Bar */}
                            <div className="w-full bg-dark-800 rounded-full h-1.5 mb-5 shadow-inner overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary-600 to-primary-400 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${subProgress}%` }}
                                />
                            </div>

                            {/* Topics List */}
                            <div className="space-y-2 flex-1">
                                {sub.topics.map((topic, tIdx) => {
                                    const status = topicStatus[topic] || STATUS.NOT_STARTED

                                    return (
                                        <div
                                            key={tIdx}
                                            onClick={() => handleStatusChange(topic)}
                                            className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border
                        ${status === STATUS.COMPLETED
                                                    ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'
                                                    : status === STATUS.REVISION
                                                        ? 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10'
                                                        : 'bg-dark-800/30 border-transparent hover:bg-dark-800/80 hover:border-dark-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="transition-transform group-hover:scale-110">
                                                    {getStatusIcon(status)}
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${status === STATUS.COMPLETED ? 'text-emerald-400/90 line-through' :
                                                        status === STATUS.REVISION ? 'text-amber-400' : 'text-gray-300'
                                                    }`}>
                                                    {topic}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => handleResourceSearch(topic, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-md transition-all"
                                                title="Search LeetCode for practice"
                                            >
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {filteredSyllabus.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-dark-800/20 rounded-xl border border-dashed border-dark-700">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>No topics found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setFilter('ALL'); }}
                            className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Syllabus
