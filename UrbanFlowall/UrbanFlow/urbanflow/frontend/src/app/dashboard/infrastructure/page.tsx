'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { Building2, CheckCircle2, Clock, AlertTriangle, Wrench } from 'lucide-react'

const PROJECTS = [
  { name: 'Phase IV Metro Extension — Janakpuri West', status: 'active', progress: 72, budget: 4200, spent: 3024, eta: 'Dec 2025' },
  { name: 'NH-48 Six-Laning (Mahipalpur to Airport)', status: 'active', progress: 45, budget: 1800, spent: 810, eta: 'Mar 2026' },
  { name: 'Smart Traffic Signal Network — Zone A', status: 'active', progress: 88, budget: 320, spent: 282, eta: 'Oct 2025' },
  { name: 'Sewage Treatment Plant — East Delhi', status: 'delayed', progress: 31, budget: 950, spent: 295, eta: 'Jun 2026' },
  { name: 'CCTV Expansion — 500 Cameras', status: 'active', progress: 61, budget: 120, spent: 73, eta: 'Nov 2025' },
  { name: 'Green Corridor — NH-24 to NH-58', status: 'planning', progress: 8, budget: 680, spent: 54, eta: 'TBD 2027' },
]

const statusMap = {
  active: { label: 'Active', color: 'bg-emerald-500/15 text-emerald-400' },
  delayed: { label: 'Delayed', color: 'bg-red-500/15 text-red-400' },
  planning: { label: 'Planning', color: 'bg-blue-500/15 text-blue-400' },
  completed: { label: 'Completed', color: 'bg-gray-500/15 text-gray-400' },
} as Record<string, { label: string; color: string }>

export default function InfrastructurePage() {
  const { cityName } = useSimulationStore()
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0)
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0)

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Infrastructure Intelligence" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Infrastructure Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Live project tracking, budget utilization, and priority scoring</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: PROJECTS.filter(p => p.status === 'active').length, icon: Wrench, color: 'text-blue-400' },
            { label: 'Delayed Projects', value: PROJECTS.filter(p => p.status === 'delayed').length, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Total Budget', value: `₹${totalBudget.toLocaleString()} Cr`, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Spent to Date', value: `₹${totalSpent.toLocaleString()} Cr`, icon: Clock, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
              <p className="text-white text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-white font-medium text-sm">Project Portfolio</h3>
          </div>
          <div className="divide-y divide-gray-800/50">
            {PROJECTS.map(p => (
              <div key={p.name} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-gray-200 text-sm font-medium">{p.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">ETA: {p.eta} · Budget: ₹{p.budget} Cr · Spent: ₹{p.spent} Cr</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[p.status]?.color}`}>
                    {statusMap[p.status]?.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.status === 'delayed' ? 'bg-red-500' : p.progress > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-8 text-right">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
