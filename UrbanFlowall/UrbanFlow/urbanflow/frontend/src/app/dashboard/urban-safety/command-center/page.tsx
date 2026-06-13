'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Command, AlertTriangle, Shield, Heart, Baby, Users, Zap,
  Brain, Camera, MapPin, Clock, Activity, CheckCircle,
  Radio, AlertCircle, ChevronRight, Eye, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts'
import { useState } from 'react'

const allAlerts = [
  { id: 'CMD-001', module: 'Emergency Behavior', type: 'Running from Danger', location: 'Chandni Chowk', urgency: 95, confidence: 89, time: '1 min', category: 'emergency', status: 'escalated' },
  { id: 'CMD-002', module: 'Vulnerable Citizen', type: 'Repeated SOS Gesture', location: 'Connaught Place', urgency: 93, confidence: 95, time: '11 min', category: 'vulnerable', status: 'reviewing' },
  { id: 'CMD-003', module: 'Crowd Safety', type: 'Density Critical — 91%', location: 'CP Inner Circle', urgency: 88, confidence: 91, time: '4 min', category: 'crowd', status: 'reviewing' },
  { id: 'CMD-004', module: 'Women Safety', type: 'High-Risk Zone Active', location: 'Rohini Sector 5', urgency: 82, confidence: 87, time: '6 min', category: 'women', status: 'pending' },
  { id: 'CMD-005', module: 'Elderly Safety', type: 'Fall Detected', location: 'Rohini Park', urgency: 82, confidence: 88, time: '5 min', category: 'elderly', status: 'reviewing' },
  { id: 'CMD-006', module: 'Child Protection', type: 'Possible Lost Child', location: 'Delhi Railway Station', urgency: 72, confidence: 72, time: '8 min', category: 'child', status: 'reviewing' },
  { id: 'CMD-007', module: 'Emergency Behavior', type: 'Mass Movement Event', location: 'CP — North Block', urgency: 82, confidence: 76, time: '4 min', category: 'emergency', status: 'pending' },
  { id: 'CMD-008', module: 'Safe Route AI', type: 'Night Route Risk Alert', location: 'Chandni Chowk Route B', urgency: 61, confidence: 82, time: '15 min', category: 'route', status: 'pending' },
]

const safetyTimeline = [
  { time: '8AM', events: 3 }, { time: '10AM', events: 5 }, { time: '12PM', events: 7 },
  { time: '2PM', events: 4 }, { time: '4PM', events: 9 }, { time: '6PM', events: 14 },
  { time: '8PM', events: 18 }, { time: '10PM', events: 12 }, { time: '12AM', events: 8 },
]

const forecastNext24 = [
  { hour: '2AM', risk: 42 }, { hour: '4AM', risk: 31 }, { hour: '6AM', risk: 28 },
  { hour: '8AM', risk: 44 }, { hour: '10AM', risk: 52 }, { hour: '12PM', risk: 58 },
  { hour: '2PM', risk: 61 }, { hour: '4PM', risk: 74 }, { hour: '6PM', risk: 88 },
  { hour: '8PM', risk: 91 }, { hour: '10PM', risk: 84 }, { hour: '12AM', risk: 67 },
]

const moduleStats = [
  { module: 'Vulnerable Citizen', icon: Eye, alerts: 4, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { module: 'Women Safety', icon: Shield, alerts: 6, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { module: 'Elderly Safety', icon: Heart, alerts: 3, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  { module: 'Child Protection', icon: Baby, alerts: 3, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { module: 'Crowd Safety', icon: Users, alerts: 5, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { module: 'Emergency Behavior', icon: Zap, alerts: 5, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { module: 'Safety Prediction', icon: Brain, alerts: 8, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
]

const aiRecs = [
  { rec: 'Deploy additional patrol units to Chandni Chowk — Mass movement event in progress', priority: 'critical', module: 'Emergency Behavior' },
  { rec: 'Dispatch response team to Connaught Place — SOS gesture confirmed by multi-camera correlation', priority: 'critical', module: 'Vulnerable Citizen' },
  { rec: 'Implement crowd flow controls at Connaught Place Inner Circle immediately', priority: 'high', module: 'Crowd Safety' },
  { rec: 'Increase lighting and patrol in Rohini Sector 5 for next 4 hours', priority: 'high', module: 'Women Safety' },
  { rec: 'Station first-aid responder near Rohini Park — Elderly fall event confirmed', priority: 'high', module: 'Elderly Safety' },
  { rec: 'Alert station staff at Delhi Railway Station — Possible lost child situation', priority: 'high', module: 'Child Protection' },
]

const categoryIcon: Record<string, React.ElementType> = {
  emergency: Zap, vulnerable: Eye, crowd: Users, women: Shield,
  elderly: Heart, child: Baby, route: MapPin,
}
const categoryColor: Record<string, string> = {
  emergency: 'text-red-400', vulnerable: 'text-violet-400', crowd: 'text-orange-400',
  women: 'text-rose-400', elderly: 'text-teal-400', child: 'text-sky-400', route: 'text-emerald-400',
}
const statusBadge: Record<string, string> = {
  escalated: 'bg-red-500/20 text-red-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-amber-500/20 text-amber-400',
}
const priorityBadge: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
}

export default function SafetyCommandCenterPage() {
  const { cityName } = useSimulationStore()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? allAlerts : allAlerts.filter(a => a.category === filter)

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Safety Command Center" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center">
              <Command className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">Safety Command Center — {cityName}</h2>
              <p className="text-gray-500 text-sm">Unified real-time view across all safety intelligence modules</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-medium">8 Active Alerts</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 text-xs font-medium">6 Pending Review</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-start gap-3">
          <Radio className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-400 text-sm font-medium">Safety Command Principle</p>
            <p className="text-gray-400 text-xs mt-0.5">AI detects, recommends, and prioritizes. All emergency actions require human operator verification. No automatic dispatch. AI is advisory only.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Active Alerts" value={allAlerts.length} unit="events" status="critical" />
          <MetricCard label="Critical Events" value={2} unit="escalated" status="critical" />
          <MetricCard label="Human Review Queue" value={6} unit="pending" status="warning" />
          <MetricCard label="Modules Online" value={7} unit="/7" status="healthy" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {moduleStats.map(mod => {
            const Icon = mod.icon
            return (
              <div key={mod.module} className={`p-3 rounded-xl border ${mod.bg} flex flex-col items-center text-center`}>
                <Icon className={`w-5 h-5 ${mod.color} mb-1`} />
                <p className="text-gray-400 text-[10px] font-medium leading-tight">{mod.module}</p>
                <p className={`text-lg font-bold mt-1 ${mod.color}`}>{mod.alerts}</p>
                <p className="text-gray-600 text-[10px]">alerts</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">Unified Alert Feed</h3>
              <div className="flex items-center gap-1 ml-auto bg-gray-900 rounded-lg p-1">
                {[{ key: 'all', label: 'All' }, { key: 'emergency', label: 'Emergency' }, { key: 'crowd', label: 'Crowd' }, { key: 'women', label: 'Women' }].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)} className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${filter === f.key ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{f.label}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filtered.map(alert => {
                const Icon = categoryIcon[alert.category] || AlertCircle
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${categoryColor[alert.category]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-medium">{alert.type}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusBadge[alert.status]}`}>{alert.status}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>
                        <span className="text-gray-600">{alert.module}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time} ago</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${alert.urgency >= 90 ? 'text-red-400' : alert.urgency >= 75 ? 'text-amber-400' : 'text-blue-400'}`}>{alert.urgency}</p>
                      <p className="text-gray-600 text-xs">urgency</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-medium text-sm">Events Today</h3>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={safetyTimeline}>
                  <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                  <Bar dataKey="events" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-white font-medium text-sm">24h Risk Forecast</h3>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={forecastNext24}>
                  <defs>
                    <linearGradient id="cmdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="risk" stroke="#7c3aed" fill="url(#cmdGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-medium">AI Recommendations — Human Approval Required</h3>
            <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">All actions pending operator verification</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiRecs.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold mt-0.5 shrink-0 ${priorityBadge[rec.priority]}`}>{rec.priority}</span>
                <div>
                  <p className="text-gray-300 text-sm">{rec.rec}</p>
                  <p className="text-purple-500 text-xs mt-0.5">via {rec.module} Agent</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">System Status — All Safety Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Vulnerable Citizen Agent', 'Women Safety Agent', 'Elderly Safety Agent', 'Child Protection Agent',
              'Crowd Safety Agent', 'Emergency Behavior Agent', 'Safe Route Agent', 'Safety Prediction Agent',
              'Multi-Camera Correlation', 'GIS Risk Engine', 'Distress Signal Engine', 'Human Review Queue',
            ].map(sys => (
              <div key={sys} className="flex items-center gap-2 p-2 bg-gray-900/60 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-gray-400 text-xs">{sys}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
