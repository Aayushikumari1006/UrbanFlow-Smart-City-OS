'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Baby, AlertTriangle, Camera, MapPin, Clock,
  Shield, ChevronRight, Activity, Eye, AlertCircle, Info
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const alerts = [
  { id: 'CPI-001', location: 'New Delhi Railway Station', behavior: 'Repeated direction changes · Possible separation', confidence: 72, camera: 'CAM-ND012', time: '8 min ago', status: 'reviewing' },
  { id: 'CPI-002', location: 'Chandni Chowk Market', behavior: 'Wandering behavior · Distress indicators', confidence: 65, camera: 'CAM-CC031', time: '21 min ago', status: 'pending' },
  { id: 'CPI-003', location: 'Rohini Bus Terminal', behavior: 'Prolonged standing alone · Looking for adult', confidence: 58, camera: 'CAM-R009', time: '34 min ago', status: 'pending' },
]

const behaviorTrend = [
  { hour: '8AM', wandering: 2, distress: 0, separation: 1 },
  { hour: '10AM', wandering: 4, distress: 1, separation: 2 },
  { hour: '12PM', wandering: 6, distress: 2, separation: 3 },
  { hour: '2PM', wandering: 5, distress: 1, separation: 2 },
  { hour: '4PM', wandering: 8, distress: 3, separation: 4 },
  { hour: '6PM', wandering: 7, distress: 2, separation: 3 },
  { hour: '8PM', wandering: 3, distress: 1, separation: 1 },
]

const weeklyTrend = [
  { day: 'Mon', alerts: 3 }, { day: 'Tue', alerts: 5 }, { day: 'Wed', alerts: 4 },
  { day: 'Thu', alerts: 7 }, { day: 'Fri', alerts: 6 }, { day: 'Sat', alerts: 9 }, { day: 'Sun', alerts: 8 },
]

const hotspots = [
  { location: 'Railway Stations', risk: 'high', avgAlerts: 12 },
  { location: 'Bus Terminals', risk: 'high', avgAlerts: 9 },
  { location: 'Crowded Markets', risk: 'medium', avgAlerts: 7 },
  { location: 'Metro Stations', risk: 'medium', avgAlerts: 5 },
  { location: 'Public Parks', risk: 'low', avgAlerts: 2 },
]

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
}

export default function ChildProtectionPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Child Protection Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-600/30 flex items-center justify-center">
            <Baby className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Child Protection Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Behavioral analysis for possible lost-child situations · No facial recognition · Human review mandatory</p>
          </div>
        </div>

        <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sky-400 text-sm font-medium">Privacy-First AI Design</p>
            <p className="text-gray-400 text-xs mt-0.5">This system detects behavioral patterns only. It never performs facial recognition, never identifies individuals, and never claims certainty. All alerts are possible situations requiring human review.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Active Alerts" value={3} unit="events" status="warning" />
          <MetricCard label="Avg. Confidence" value={65} unit="%" status="warning" />
          <MetricCard label="Human Reviews Today" value={11} unit="completed" status="healthy" />
          <MetricCard label="High-Risk Zones" value={2} unit="locations" status="critical" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-medium">Possible Lost-Child Alerts</h3>
              <span className="ml-auto text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">Behavioral analysis only</span>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="p-4 bg-gray-900/60 rounded-lg border border-gray-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColor[alert.status]}`}>{alert.status}</span>
                        <span className="text-gray-500 text-xs">{alert.id}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{alert.behavior}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>
                        <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{alert.camera}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sky-400 text-lg font-bold">{alert.confidence}%</p>
                      <p className="text-gray-600 text-xs">confidence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                      <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${alert.confidence}%` }} />
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">AI confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">High-Risk Locations</h3>
              <div className="space-y-2">
                {hotspots.map(h => (
                  <div key={h.location} className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-3.5 h-3.5 ${h.risk === 'high' ? 'text-red-400' : h.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <p className="text-gray-300 text-xs">{h.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">{h.avgAlerts}/wk</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${h.risk === 'high' ? 'bg-red-500/20 text-red-400' : h.risk === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{h.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">Weekly Alert Trend</h3>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="childGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="alerts" stroke="#0ea5e9" fill="url(#childGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-white font-medium">Hourly Behavior Detection Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={behaviorTrend}>
              <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="wandering" fill="#0ea5e9" name="Wandering" radius={[3, 3, 0, 0]} />
              <Bar dataKey="distress" fill="#ef4444" name="Distress Signs" radius={[3, 3, 0, 0]} />
              <Bar dataKey="separation" fill="#f59e0b" name="Separation Pattern" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">AI Detection Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['Behavior Analysis', 'Movement Tracking', 'Risk Assessment', 'Confidence Score', 'Human Review'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${i === arr.length - 1 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-sky-500/30 bg-sky-500/10 text-sky-400'}`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
