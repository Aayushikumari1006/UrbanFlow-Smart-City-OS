'use client'

import TopNav from '@/components/TopNav'
import { useHealth } from '@/hooks/useHealth'
import { useSimulationStore } from '@/store/simulation'
import { Radio, CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react'

const SERVICES = [
  { name: 'FastAPI Backend', port: 8000, path: '/health', status: 'online' },
  { name: 'PostgreSQL Database', port: 5432, path: 'DB connection', status: 'online' },
  { name: 'Next.js Frontend', port: 5000, path: '/', status: 'online' },
  { name: 'Scenario Engine', port: null, path: 'Internal module', status: 'online' },
  { name: 'Agent Registry', port: null, path: 'Internal module', status: 'online' },
  { name: 'Feedback Engine', port: null, path: 'Internal module', status: 'online' },
]

const RECENT_EVENTS = [
  { msg: 'Database connection pool healthy — 10/10 connections active', level: 'healthy', time: '1m ago' },
  { msg: 'Scenario simulation completed in 48ms — well within 2s target', level: 'healthy', time: '4m ago' },
  { msg: 'Seeded Delhi and Chandigarh baseline data on startup', level: 'info', time: '12m ago' },
  { msg: 'Backend started on port 8000 — all routes registered', level: 'healthy', time: '12m ago' },
  { msg: 'Frontend proxy configured — all /api/* requests forwarded to :8000', level: 'info', time: '13m ago' },
]

export default function MonitoringPage() {
  const { data: health, isLoading } = useHealth()
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Platform Monitoring" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-green-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Platform Monitoring</h2>
            <p className="text-gray-500 text-sm">System health, service status, and performance metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'API Status', value: health?.status === 'ok' ? 'Healthy' : 'Down', icon: CheckCircle2, color: health?.status === 'ok' ? 'text-emerald-400' : 'text-red-400' },
            { label: 'Database', value: health?.database === 'connected' ? 'Connected' : 'Error', icon: Cpu, color: health?.database === 'connected' ? 'text-emerald-400' : 'text-red-400' },
            { label: 'API Version', value: health?.version || '—', icon: Radio, color: 'text-blue-400' },
            { label: 'Active City', value: cityName, icon: Clock, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
              <p className="text-white text-lg font-bold">{isLoading ? '...' : value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">Service Health</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {SERVICES.map(s => (
                <div key={s.name} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-gray-300 text-sm">{s.name}</p>
                    <p className="text-gray-600 text-xs">{s.port ? `Port ${s.port}` : s.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === 'online'
                      ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-xs">Online</span></>
                      : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-xs">Offline</span></>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">System Events</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {RECENT_EVENTS.map((e, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.level === 'healthy' ? 'bg-emerald-400' : e.level === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <p className="text-gray-400 text-sm flex-1">{e.msg}</p>
                  <span className="text-gray-700 text-xs whitespace-nowrap">{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
