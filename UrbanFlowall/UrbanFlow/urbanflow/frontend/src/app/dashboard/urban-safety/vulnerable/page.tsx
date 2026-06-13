'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Eye, AlertTriangle, Camera, CheckCircle, Clock, Shield,
  Activity, MapPin, Radio, ChevronRight, AlertCircle
} from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

const radarData = [
  { factor: 'Camera AI', score: 82 },
  { factor: 'Citizen Reports', score: 67 },
  { factor: 'GIS Risk', score: 74 },
  { factor: 'Historical', score: 88 },
  { factor: 'Environment', score: 59 },
  { factor: 'Emergency Calls', score: 71 },
]

const trendData = [
  { time: '00:00', risk: 22 }, { time: '03:00', risk: 18 }, { time: '06:00', risk: 30 },
  { time: '09:00', risk: 45 }, { time: '12:00', risk: 38 }, { time: '15:00', risk: 52 },
  { time: '18:00', risk: 71 }, { time: '21:00', risk: 84 }, { time: '23:00', risk: 61 },
]

const activeAlerts = [
  { id: 'VCP-001', zone: 'Rohini Sector 5', type: 'Possible Distress', risk: 87, urgency: 'critical', confidence: 91, camera: 'CAM-R045', time: '2 min ago', status: 'pending' },
  { id: 'VCP-002', zone: 'Chandni Chowk East', type: 'Prolonged Immobility', risk: 74, urgency: 'high', confidence: 78, camera: 'CAM-C012', time: '7 min ago', status: 'reviewing' },
  { id: 'VCP-003', zone: 'Connaught Place', type: 'Repeated SOS Gesture', risk: 93, urgency: 'critical', confidence: 95, camera: 'CAM-CP008', time: '11 min ago', status: 'escalated' },
  { id: 'VCP-004', zone: 'Lajpat Nagar Mkt', type: 'Erratic Movement', risk: 61, urgency: 'medium', confidence: 63, camera: 'CAM-L021', time: '19 min ago', status: 'pending' },
]

const reviewQueue = [
  { priority: 1, location: 'CAM-CP008 — Connaught Place', reason: 'Repeated SOS gesture detected', agent: 'Distress Signal Agent', time: '11 min' },
  { priority: 2, location: 'CAM-R045 — Rohini Sector 5', reason: 'Subject seated on ground >12 min', agent: 'Elderly Safety Agent', time: '2 min' },
  { priority: 3, location: 'CAM-C012 — Chandni Chowk', reason: 'No movement detected in 8 min', agent: 'Behavior Agent', time: '7 min' },
]

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  escalated: 'bg-red-500/20 text-red-400',
}
const urgencyColor: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-amber-400',
  medium: 'text-blue-400',
}

export default function VulnerableCitizenPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Vulnerable Citizen Protection Center" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">Vulnerable Citizen Protection — {cityName}</h2>
              <p className="text-gray-500 text-sm">AI continuously monitors camera feeds, GIS risk zones & citizen reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">3 Active Alerts</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Risk Score" value={72} unit="/100" status="warning" />
          <MetricCard label="Urgency Score" value={84} unit="/100" status="critical" />
          <MetricCard label="Confidence Score" value={88} unit="%" status="healthy" />
          <MetricCard label="Human Review Queue" value={4} unit="events" status="warning" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">Active Distress Alerts</h3>
              <span className="ml-auto text-gray-600 text-xs">Human verification required for all actions</span>
            </div>
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${urgencyColor[alert.urgency]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{alert.type}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColor[alert.status]}`}>{alert.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.zone}</span>
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{alert.camera}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${urgencyColor[alert.urgency]}`}>{alert.risk}% risk</p>
                    <p className="text-gray-600 text-xs">{alert.confidence}% conf.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-white font-medium">AI Signal Analysis</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-gray-600 text-xs text-center mt-2">Multi-source AI confidence radar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">24-Hour Risk Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#f87171' }} />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="url(#riskGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-medium">Human Review Queue</h3>
              <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Operator action required</span>
            </div>
            <div className="space-y-3">
              {reviewQueue.map(item => (
                <div key={item.priority} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                  <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-violet-400 text-xs font-bold shrink-0">
                    {item.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm font-medium truncate">{item.reason}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{item.location}</p>
                    <p className="text-violet-500 text-xs">via {item.agent}</p>
                  </div>
                  <span className="text-gray-600 text-xs shrink-0">{item.time} ago</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-400/80 text-xs">All emergency actions require human operator verification. AI recommendations only — no automatic dispatch.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-medium">AI Detection Flow</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Camera Feed', 'AI Detection', 'Confidence Analysis', 'Multi-Agent Validation', 'Human Review Queue', 'Recommended Action'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${
                  i === 4 ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
                  i === 5 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' :
                  'border-violet-500/30 bg-violet-500/10 text-violet-400'
                }`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
