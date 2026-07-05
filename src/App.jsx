import { useState } from 'react'
import { ListTodo, LayoutDashboard } from 'lucide-react'

import { TaskList } from './components/TaskList.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { StatusToast } from './components/StatusToast.jsx'
import { cn } from './lib/cn.js'

const TABS = [
  { id: 'tasks', label: 'Tareas', icon: ListTodo },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <svg width="17" height="17" viewBox="0 0 72 72" fill="none">
                <rect x="20" y="24" width="24" height="6" rx="3" fill="white" opacity="0.55" />
                <rect x="20" y="34" width="32" height="6" rx="3" fill="white" opacity="0.8" />
                <path d="M20 46L27 53L52 30" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <span className="font-display font-bold text-slate-900 text-[18px] tracking-tight">TaskFlow</span>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150',
                  activeTab === id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm shadow-violet-300'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/70'
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        {activeTab === 'tasks' ? <TaskList /> : <Dashboard />}
      </main>

      <StatusToast />
    </div>
  )
}
