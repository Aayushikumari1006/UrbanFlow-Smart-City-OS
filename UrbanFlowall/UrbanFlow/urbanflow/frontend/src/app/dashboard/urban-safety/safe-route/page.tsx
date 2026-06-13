'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Navigation, MapPin, Shield, Clock, Camera, AlertTriangle,
  CheckCircle, ChevronRight, Users, Zap, TrendingUp, Activity
} from 'lucide-react'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'

const routes = [
  {
    id: 'A', name: 'Route A — Safest', from: 'Connaught Place', to: 'Chandni Chowk',
    distance: '3.2 km', time: '18 min', safetyScore: 88, lightingScore: 92, crimeScore: 12,
    crowdScore: 45, cctvScore: 89, recommended: true, tags: ['Well lit', 'High CCTV', 'Low crime'],
    risks: [],
  },
  {
    id: 'B', name: 'Route B — Faster', from: 'Connaught Place', to: 'Chandni Chowk',
    distance: '2.1 km', time: '12 min', safetyScore: 61, lightingScore: 54, crimeScore: 42,
    crowdScore: 71, cctvScore: 63, recommended: false, tags: ['Shorter', 'Busy'],
    risks: ['Low lighting in 2 stretches', 'Higher crime history'],
  },
  {
    id: 'C', name: 'Route C — Avoid', from: 'Connaught Place', to: 'Chandni Chowk',
    distance: '2.8 km', time: '15 min', safetyScore: 34, lightingScore: 21, crimeScore: 78,
    crowdScore: 82, cctvScore: 28, recommended: false, tags: ['Dark zones', 'Avoid at night'],
    risks: ['Multiple dark zones', 'Poor CCTV coverage', 'High crime rate'],
  },
]

const radarDataA = [
  { factor: 'Lighting', value: 92 }, { factor: 'Crime', value: 88 }, { factor: 'Crowd', value: 55 },
  { factor: 'CCTV', value: 89 }, { factor: 'Emergency', value: 82 }, { factor: 'Women Safety', value: 91 },
]

const riskByHour = [
  { hour: '6AM', routeA: 12, routeB: 28, routeC: 45 },
  { hour: '9AM', routeA: 18, routeB: 35, routeC: 52 },
  { hour: '12PM', routeA: 22, routeB: 41, routeC: 58 },
  { hour: '3PM', routeA: 19, routeB: 38, routeC: 54 },
  { hour: '6PM', routeA: 28, routeB: 52, routeC: 71 },
  { hour: '9PM', routeA: 41, routeB: 68, routeC: 88 },
  { hour: '11PM', routeA: 51, routeB: 79, routeC: 95 },
]

export default function SafeRoutePage() {
  const { cityName } = useSimulationStore()
  const [origin, setOrigin] = useState('Connaught Place')
  const [dest, setDest] = useState('Chandni Chowk')
  const [time, setTime] = useState('Now')
  const [mode, setMode] = useState('Walking')
  const [analyzed, setAnalyzed] = useState(true)

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Safe Route Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Safe Route Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">AI-powered route safety analysis: lighting · crime history · crowd density · CCTV coverage</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Routes Analyzed" value={3} unit="options" status="healthy" />
          <MetricCard label="Safest Route Score" value={88} unit="/100" status="healthy" />
          <MetricCard label="Risk Reduction" value={54} unit="%" status="healthy" />
          <MetricCard label="CCTV on Route A" value={89} unit="%" status="healthy" />
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Route Safety Analyzer</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Origin</label>
              <input value={origin} onChange={e => setOrigin(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Destination</label>
              <input value={dest} onChange={e => setDest(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Travel Time</label>
              <select value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-emerald-500">
                <option>Now</option><option>Evening (6-10PM)</option><option>Night (10PM+)</option><option>Morning (6-9AM)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Travel Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-emerald-500">
                <option>Walking</option><option>Two-Wheeler</option><option>Auto/Cab</option><option>Public Transit</option>
              </select>
            </div>
          </div>
          <button onClick={() => setAnalyzed(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2">
            <Navigation className="w-4 h-4" /> Analyze Safe Routes
          </button>
        </div>

        {analyzed && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Route Comparison — {origin} → {dest}</h3>
            {routes.map(route => (
              <div key={route.id} className={`bg-[#111827] rounded-xl border p-5 ${route.recommended ? 'border-emerald-500/40' : 'border-gray-800'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${route.recommended ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800 text-gray-400'}`}>{route.id}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm">{route.name}</p>
                        {route.recommended && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-semibold">RECOMMENDED</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{route.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${route.safetyScore >= 80 ? 'text-emerald-400' : route.safetyScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{route.safetyScore}</p>
                    <p className="text-gray-600 text-xs">safety score</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Lighting', value: route.lightingScore, icon: Zap },
                    { label: 'Crime Risk', value: 100 - route.crimeScore, icon: Shield },
                    { label: 'CCTV', value: route.cctvScore, icon: Camera },
                    { label: 'Crowd', value: 100 - route.crowdScore, icon: Users },
                  ].map(factor => (
                    <div key={factor.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">{factor.label}</span>
                        <span className={factor.value >= 70 ? 'text-emerald-400' : factor.value >= 50 ? 'text-amber-400' : 'text-red-400'}>{factor.value}%</span>
                      </div>
                      <div className="bg-gray-800 rounded-full h-1">
                        <div className={`h-1 rounded-full ${factor.value >= 70 ? 'bg-emerald-400' : factor.value >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${factor.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {route.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">{tag}</span>
                  ))}
                  {route.risks.map(risk => (
                    <span key={risk} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />{risk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">Route Risk by Hour</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riskByHour}>
                <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                <Bar dataKey="routeA" fill="#10b981" name="Route A" radius={[3, 3, 0, 0]} />
                <Bar dataKey="routeB" fill="#f59e0b" name="Route B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="routeC" fill="#ef4444" name="Route C" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-medium">Route A Safety Radar</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarDataA}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Safe Route Analysis Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['Source', 'GIS Analysis', 'Crime Analysis', 'Lighting Analysis', 'Crowd Analysis', 'Risk Scoring', 'Safest Route Output'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${i === arr.length - 1 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500'}`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
