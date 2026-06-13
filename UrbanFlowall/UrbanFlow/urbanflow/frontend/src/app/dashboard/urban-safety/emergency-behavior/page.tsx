'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Zap, AlertTriangle, Camera, MapPin, Clock,
  ChevronRight, Activity, Radio, AlertCircle, Flame
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts'

const activeEvents = [
  { id: 'EBE-001', type: 'Running from Danger', location: 'Chandni Chowk — Gate 3', urgency: 95, confidence: 89, camera: 'CAM-CC021', time: '1 min ago', priority: 'critical', status: 'escalated' },
  { id: 'EBE-002', type: 'Mass Movement Event', location: 'Connaught Place — Inner Circle', urgency: 82, confidence: 76, camera: 'CAM-CP014', time: '4 min ago', priority: 'critical', status: 'reviewing' },
  { id: 'EBE-003', type: 'Aggressive Encounter', location: 'Rohini Sector 8 — Market', urgency: 71, confidence: 68, camera: 'CAM-R041', time: '9 min ago', priority: 'high', status: 'reviewing' },
  { id: 'EBE-004', type: 'Collapse Event', location: 'Dwarka Sector 6 — Park', urgency: 64, confidence: 72, camera: 'CAM-D019', time: '15 min ago', priority: 'high', status: 'pending' },
  { id: 'EBE-005', type: 'Smoke Presence', location: 'Lajpat Nagar — Market', urgency: 58, confidence: 61, camera: 'CAM-L008', time: '22 min ago', priority: 'medium', status: 'pending' },
]

const eventTypeTrend = [
  { time: '8AM', running: 0, aggressive: 1, collapse: 0, fire: 0, mass: 0 },
  { time: '10AM', running: 1, aggressive: 2, collapse: 1, fire: 0, mass: 1 },
  { time: '12PM', running: 2, aggressive: 3, collapse: 0, fire: 1, mass: 1 },
  { time: '2PM', running: 1, aggressive: 1, collapse: 1, fire: 0, mass: 0 },
  { time: '4PM', running: 3, aggressive: 4, collapse: 1, fire: 1, mass: 2 },
  { time: '6PM', running: 4, aggressive: 2, collapse: 2, fire: 0, mass: 3 },
  { time: '8PM', running: 5, aggressive: 3, collapse: 1, fire: 2, mass: 2 },
]

const urgencyTrend = [
  { hour: '6AM', urgency: 12 }, { hour: '9AM', urgency: 31 }, { hour: '12PM', urgency: 48 },
  { hour: '3PM', urgency: 41 }, { hour: '6PM', urgency: 67 }, { hour: '9PM', urgency: 88 },
  { hour: '11PM', urgency: 76 }, { hour: '2AM', urgency: 54 },
]

const eventTypes = [
  { type: 'Running from Danger', count: 12, icon: '🏃', color: 'text-red-400', desc: 'Rapid crowd movement away from a point' },
  { type: 'Aggressive Encounters', count: 8, icon: '⚠️', color: 'text-amber-400', desc: 'Detected confrontation patterns' },
  { type: 'Collapse Events', count: 5, icon: '🫀', color: 'text-purple-400', desc: 'Person down on ground unexpectedly' },
  { type: 'Fire / Smoke Proximity', count: 3, icon: '🔥', color: 'text-orange-400', desc: 'Visual smoke or fire signature' },
  { type: 'Mass Movement Events', count: 7, icon: '👥', color: 'text-blue-400', desc: 'Large-scale uncoordinated crowd movement' },
]

const priorityBadge: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
}
const statusBadge: Record<string, string> = {
  escalated: 'bg-red-500/20 text-red-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-amber-500/20 text-amber-400',
}

export default function EmergencyBehaviorPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Emergency Behavior Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">Emergency Behavior Intelligence — {cityName}</h2>
              <p className="text-gray-500 text-sm">Panic · Aggression · Collapse · Fire proximity · Mass movement — all require operator review</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">2 Critical Events</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Emergency Probability" value={88} unit="%" status="critical" />
          <MetricCard label="Urgency Score" value={95} unit="/100" status="critical" />
          <MetricCard label="Active Events" value={5} unit="events" status="warning" />
          <MetricCard label="Operator Review" value={3} unit="pending" status="warning" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">Active Emergency Events</h3>
              <span className="ml-auto text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">No automatic dispatch</span>
            </div>
            <div className="space-y-3">
              {activeEvents.map(ev => (
                <div key={ev.id} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className={`w-4 h-4 ${ev.priority === 'critical' ? 'text-red-400' : ev.priority === 'high' ? 'text-amber-400' : 'text-blue-400'}`} />
                        <span className="text-white text-sm font-medium">{ev.type}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusBadge[ev.status]}`}>{ev.status}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                        <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{ev.camera}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${ev.priority === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>{ev.urgency} urgency</p>
                      <p className="text-gray-600 text-xs">{ev.confidence}% conf.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-1">
                      <div className={`h-1 rounded-full ${ev.urgency > 85 ? 'bg-red-400' : 'bg-amber-400'}`} style={{ width: `${ev.urgency}%` }} />
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">Urgency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-red-400" />
                <h3 className="text-white font-medium text-sm">Urgency Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={urgencyTrend}>
                  <defs>
                    <linearGradient id="urgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="urgency" stroke="#ef4444" fill="url(#urgGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">Event Categories</h3>
              <div className="space-y-2">
                {eventTypes.map(ev => (
                  <div key={ev.type} className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{ev.icon}</span>
                      <p className={`text-xs font-medium ${ev.color}`}>{ev.type}</p>
                    </div>
                    <span className="text-gray-400 text-xs font-bold">{ev.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium">Hourly Event Type Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={eventTypeTrend}>
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="running" fill="#ef4444" name="Running" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="aggressive" fill="#f59e0b" name="Aggressive" radius={[0, 0, 0, 0]} stackId="a" />
              <Bar dataKey="collapse" fill="#8b5cf6" name="Collapse" stackId="a" />
              <Bar dataKey="fire" fill="#f97316" name="Fire/Smoke" stackId="a" />
              <Bar dataKey="mass" fill="#3b82f6" name="Mass Move" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">AI Detection Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['Video Feed', 'Behavior Detection', 'Event Classification', 'Confidence Analysis', 'Operator Review'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${i === arr.length - 1 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
