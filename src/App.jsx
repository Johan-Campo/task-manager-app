import { useState } from 'react'
import { TaskList } from './components/TaskList.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { StatusToast } from './components/StatusToast.jsx'
import { cn } from './lib/cn.js'

const TABS = [
  { id: 'tasks', label: 'Tareas' },
  { id: 'dashboard', label: 'Dashboard' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <h1 className="text-base font-bold text-slate-800">Task Manager</h1>
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-1.5 text-sm rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'tasks' ? <TaskList /> : <Dashboard />}
      </main>

      <StatusToast />
    </div>
  )
}
