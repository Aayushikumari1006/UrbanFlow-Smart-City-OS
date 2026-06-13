'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Users, AlertTriangle, Activity, MapPin, ChevronRight,
  TrendingUp, Radio, Zap, Eye
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts'

const crowdZones = [
  { zone: 'Connaught Place', density: 92, safetyScore: 38, stampede: 22, movement: 'Converging', risk: 'critical' },
  { zone: 'Chandni Chowk', density: 87, safetyScore: 42, stampede: 18, movement: 'Diverging', risk: 'high' },
  { zone: 'Rohini Sector 3', density: 71, safetyScore: 58, stampede: 9, movement: 'Stable', risk: 'medium' },
  { zone: 'Lajpat Nagar', density: 64, safetyScore: 63, stampede: 5, movement: 'Slow', risk: 'medium' },
  { zone: 'Dwarka Sector 10', density: 45, safetyScore: 79, stampede: 2, movement: 'Normal', risk: 'low' },
]

const densityTrend = [
  { time: '8AM', density: 35, threshold: 80 }, { time: '10AM', density: 52, threshold: 80 },
  { time: '12PM', density: 78, threshold: 80 }, { time: '2PM', density: 85, threshold: 80 },
  { time: '4PM', density: 91, threshold: 80 }, { time: '6PM', density: 87, threshold: 80 },
  { time: '8PM', density: 72, threshold: 80 }, { time: '10PM', density: 48, threshold: 80 },
]

const radarData = [
  { factor: 'Density', score: 87 },
  { factor: 'Movement', score: 74 },
  { factor: 'Panic Risk', score: 62 },
  { factor: 'Exit Access', score: 58 },
  { factor: 'CCTV', score: 81 },
  { factor: 'Response', score: 69 },
]

const crowdControls = [
  { action: 'Redirect crowd flow via Gate B closure at Connaught Place metro', priority: 'critical', impact: 'Reduces density 35%' },
  { action: 'Deploy crowd control barriers at Chandni Chowk east entrance', priority: 'high', impact: 'Prevents convergence' },
  { action: 'Alert additional police units for Rohini Sector 3 event', priority: 'high', impact: 'Improves response time' },
  { action: 'Activate digital signage to redirect pedestrian flow', priority: 'medium', impact: 'Reduces bottleneck' },
  { action: 'Coordinate with event organizers for staggered entry at Lajpat Nagar', priority: 'medium', impact: 'Distributes crowd load' },
]

const riskColor: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-amber-400',
  medium: 'text-blue-400',
  low: 'text-emerald-400',
}
const riskBadge: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
  low: 'bg-emerald-500/20 text-emerald-400',
}
const priorityColor: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
}

export default function CrowdSafetyPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Crowd Safety Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">Crowd Safety Intelligence — {cityName}</h2>
              <p className="text-gray-500 text-sm">Real-time crowd density · Panic detection · Stampede risk prediction</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">1 Critical Zone</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Crowd Safety Score" value={52} unit="/100" status="critical" />
          <MetricCard label="Crowd Risk Level" value="HIGH" status="critical" />
          <MetricCard label="Stampede Probability" value={22} unit="%" status="warning" />
          <MetricCard label="Zones Monitored" value={5} unit="active" status="healthy" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-medium">Live Crowd Risk Map</h3>
            </div>
            <div className="space-y-3">
              {crowdZones.map(zone => (
                <div key={zone.zone} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${riskColor[zone.risk]}`} />
                      <span className="text-white text-sm font-medium">{zone.zone}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${riskBadge[zone.risk]}`}>{zone.risk}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Movement: <span className="text-gray-300">{zone.movement}</span></span>
                      <span className="text-red-400">Stampede: {zone.stampede}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Crowd Density</span>
                        <span className={riskColor[zone.risk]}>{zone.density}%</span>
                      </div>
                      <div className="bg-gray-800 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${zone.density > 85 ? 'bg-red-400' : zone.density > 70 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${zone.density}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Safety Score</span>
                        <span className="text-emerald-400">{zone.safetyScore}/100</span>
                      </div>
                      <div className="bg-gray-800 rounded-full h-1.5">
                        <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${zone.safetyScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-violet-400" />
                <h3 className="text-white font-medium text-sm">Risk Factor Radar</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Radar dataKey="score" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <h3 className="text-white font-medium text-sm mb-2">Density Threshold Alert</h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-400">91%</p>
                <p className="text-gray-500 text-xs mt-1">Current peak density</p>
                <p className="text-amber-400 text-xs mt-1">Threshold: 80% — EXCEEDED</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium">Crowd Density vs Safety Threshold</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={densityTrend}>
              <defs>
                <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Area type="monotone" dataKey="density" stroke="#f97316" fill="url(#densityGrad)" strokeWidth={2} name="Density %" />
              <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" name="Threshold" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-medium">Recommended Crowd Controls</h3>
            <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Human approval required</span>
          </div>
          <div className="space-y-2">
            {crowdControls.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold mt-0.5 shrink-0 ${priorityColor[item.priority]}`}>{item.priority}</span>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{item.action}</p>
                  <p className="text-emerald-500 text-xs mt-0.5">Expected impact: {item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
