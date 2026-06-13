'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Activity, AlertTriangle, Camera, MapPin, Clock,
  CheckCircle, ChevronRight, Heart, AlertCircle
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts'

const fallEvents = [
  { id: 'ELD-001', location: 'Rohini Sector 3 — Park', type: 'Fall Detected', confidence: 88, riskScore: 82, camera: 'CAM-R031', time: '5 min ago', status: 'reviewing', age: 'Elderly (est.)' },
  { id: 'ELD-002', location: 'Chandni Chowk — Market', type: 'Prolonged Immobility', confidence: 74, riskScore: 71, camera: 'CAM-C044', time: '14 min ago', status: 'pending', age: 'Elderly (est.)' },
  { id: 'ELD-003', location: 'Dwarka — Bus Stand', type: 'Disorientation Pattern', confidence: 61, riskScore: 65, camera: 'CAM-D008', time: '22 min ago', status: 'pending', age: 'Elderly (est.)' },
]

const hourlyDetections = [
  { hour: '6AM', falls: 1, immobility: 2, distress: 0 },
  { hour: '9AM', falls: 3, immobility: 4, distress: 1 },
  { hour: '12PM', falls: 2, immobility: 3, distress: 2 },
  { hour: '3PM', falls: 4, immobility: 5, distress: 1 },
  { hour: '6PM', falls: 5, immobility: 6, distress: 3 },
  { hour: '9PM', falls: 3, immobility: 4, distress: 2 },
]

const fallRiskTrend = [
  { day: 'Mon', risk: 42 }, { day: 'Tue', risk: 58 }, { day: 'Wed', risk: 51 },
  { day: 'Thu', risk: 67 }, { day: 'Fri', risk: 73 }, { day: 'Sat', risk: 61 }, { day: 'Sun', risk: 48 },
]

const assistanceLocations = [
  { name: 'Rohini Community Center', distance: '0.8 km', type: 'Medical Aid Post', available: true },
  { name: 'Chandni Chowk Hospital', distance: '1.2 km', type: 'Emergency Ward', available: true },
  { name: 'Dwarka Sector 10 Clinic', distance: '0.5 km', type: 'First Aid', available: false },
  { name: 'Police Post — CP Ring Road', distance: '0.3 km', type: 'Police Assistance', available: true },
]

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-emerald-500/20 text-emerald-400',
}

export default function ElderlySafetyPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Elderly Safety Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-600/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Elderly Safety Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">AI pose analysis for fall detection · Medical distress · Immobility monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Fall Risk Score" value={73} unit="/100" status="warning" />
          <MetricCard label="Active Detections" value={3} unit="events" status="warning" />
          <MetricCard label="Medical Alert Conf." value={81} unit="%" status="healthy" />
          <MetricCard label="Nearest Assistance" value="0.3" unit="km" status="healthy" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-medium">Distress Event Queue</h3>
              <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Human verification required</span>
            </div>
            <div className="space-y-3">
              {fallEvents.map(ev => (
                <div key={ev.id} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-medium">{ev.type}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColor[ev.status]}`}>{ev.status}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                        <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{ev.camera}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 text-sm font-bold">{ev.riskScore}% risk</p>
                      <p className="text-gray-600 text-xs">{ev.confidence}% conf.</p>
                      <p className="text-gray-600 text-xs">{ev.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${ev.confidence}%` }} />
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">AI confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-teal-400" />
                <h3 className="text-white font-medium text-sm">Weekly Fall Risk</h3>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={fallRiskTrend}>
                  <defs>
                    <linearGradient id="fallGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="risk" stroke="#14b8a6" fill="url(#fallGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">Nearest Assistance</h3>
              <div className="space-y-2">
                {assistanceLocations.map(loc => (
                  <div key={loc.name} className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-gray-300 text-xs font-medium">{loc.name}</p>
                      <p className="text-gray-600 text-xs">{loc.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-400 text-xs">{loc.distance}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${loc.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {loc.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium">Hourly Detection Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hourlyDetections}>
              <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="falls" fill="#ef4444" name="Fall Events" radius={[3, 3, 0, 0]} />
              <Bar dataKey="immobility" fill="#f59e0b" name="Immobility" radius={[3, 3, 0, 0]} />
              <Bar dataKey="distress" fill="#8b5cf6" name="Distress Signs" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">AI Detection Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['Camera Feed', 'Pose Analysis', 'Fall Detection', 'Confidence Scoring', 'Human Validation', 'Assistance Recommendation'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${i === arr.length - 1 ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' : i === arr.length - 2 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-teal-500/30 bg-teal-500/10 text-teal-400'}`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
