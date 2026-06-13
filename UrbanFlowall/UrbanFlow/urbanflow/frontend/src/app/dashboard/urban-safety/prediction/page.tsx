'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import {
  Brain, TrendingUp, MapPin, AlertTriangle, Activity,
  ChevronRight, Clock, Shield, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { useState } from 'react'

const horizons = ['24 Hours', '7 Days', '30 Days', '90 Days'] as const
type Horizon = typeof horizons[number]

const forecastData: Record<Horizon, { time: string; crime: number; harassment: number; accident: number; emergency: number }[]> = {
  '24 Hours': [
    { time: '6AM', crime: 18, harassment: 12, accident: 8, emergency: 5 },
    { time: '9AM', crime: 31, harassment: 22, accident: 14, emergency: 9 },
    { time: '12PM', crime: 28, harassment: 19, accident: 18, emergency: 11 },
    { time: '3PM', crime: 35, harassment: 27, accident: 22, emergency: 14 },
    { time: '6PM', crime: 58, harassment: 47, accident: 31, emergency: 22 },
    { time: '9PM', crime: 74, harassment: 68, accident: 28, emergency: 31 },
    { time: '11PM', crime: 81, harassment: 77, accident: 24, emergency: 38 },
  ],
  '7 Days': [
    { time: 'Mon', crime: 52, harassment: 41, accident: 28, emergency: 19 },
    { time: 'Tue', crime: 48, harassment: 38, accident: 31, emergency: 22 },
    { time: 'Wed', crime: 61, harassment: 52, accident: 26, emergency: 18 },
    { time: 'Thu', crime: 55, harassment: 44, accident: 34, emergency: 25 },
    { time: 'Fri', crime: 72, harassment: 61, accident: 38, emergency: 28 },
    { time: 'Sat', crime: 84, harassment: 73, accident: 41, emergency: 34 },
    { time: 'Sun', crime: 68, harassment: 57, accident: 33, emergency: 26 },
  ],
  '30 Days': [
    { time: 'Wk 1', crime: 55, harassment: 44, accident: 29, emergency: 21 },
    { time: 'Wk 2', crime: 62, harassment: 51, accident: 33, emergency: 24 },
    { time: 'Wk 3', crime: 71, harassment: 58, accident: 38, emergency: 27 },
    { time: 'Wk 4', crime: 67, harassment: 54, accident: 35, emergency: 25 },
  ],
  '90 Days': [
    { time: 'Jan', crime: 58, harassment: 46, accident: 31, emergency: 23 },
    { time: 'Feb', crime: 63, harassment: 51, accident: 34, emergency: 26 },
    { time: 'Mar', crime: 71, harassment: 59, accident: 38, emergency: 29 },
  ],
}

const districtRankings = [
  { district: 'Rohini', safetyRank: 1, predictedRisk: 74, incidents: 18, trend: 'worsening' },
  { district: 'Chandni Chowk', safetyRank: 2, predictedRisk: 71, incidents: 15, trend: 'stable' },
  { district: 'Saket', safetyRank: 3, predictedRisk: 62, incidents: 11, trend: 'improving' },
  { district: 'Dwarka', safetyRank: 4, predictedRisk: 41, incidents: 7, trend: 'improving' },
  { district: 'Connaught Place', safetyRank: 5, predictedRisk: 38, incidents: 6, trend: 'stable' },
]

const radarPrediction = [
  { factor: 'Crime', score: 72 }, { factor: 'Harassment', score: 65 },
  { factor: 'Accident', score: 48 }, { factor: 'Emergency', score: 55 },
  { factor: 'Unsafe Zones', score: 61 }, { factor: 'Hotspots', score: 69 },
]

const trendColor: Record<string, string> = {
  worsening: 'text-red-400',
  stable: 'text-amber-400',
  improving: 'text-emerald-400',
}

export default function SafetyPredictionPage() {
  const { cityName } = useSimulationStore()
  const [horizon, setHorizon] = useState<Horizon>('24 Hours')

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Safety Prediction Engine" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Safety Prediction Engine — {cityName}</h2>
            <p className="text-gray-500 text-sm">AI-powered forecasting: crime hotspots · harassment risk · accident zones · emergency probability</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Crime Hotspots Predicted" value={8} unit="zones" status="warning" />
          <MetricCard label="Harassment Risk (24h)" value={68} unit="%" status="warning" />
          <MetricCard label="Accident Risk Index" value={42} unit="/100" status="healthy" />
          <MetricCard label="Emergency Risk Score" value={31} unit="/100" status="healthy" />
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white font-medium">Risk Forecast</h3>
            </div>
            <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
              {horizons.map(h => (
                <button key={h} onClick={() => setHorizon(h)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${horizon === h ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{h}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData[horizon]}>
              <defs>
                <linearGradient id="crimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="harassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Area type="monotone" dataKey="crime" stroke="#ef4444" fill="url(#crimeGrad)" strokeWidth={2} name="Crime Risk" />
              <Area type="monotone" dataKey="harassment" stroke="#f97316" fill="url(#harassGrad)" strokeWidth={2} name="Harassment Risk" />
              <Line type="monotone" dataKey="accident" stroke="#3b82f6" strokeWidth={2} name="Accident Risk" dot={false} />
              <Line type="monotone" dataKey="emergency" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 4" name="Emergency Risk" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">District Safety Rankings</h3>
              <span className="ml-auto text-gray-600 text-xs">Next 7 days predicted</span>
            </div>
            <div className="space-y-3">
              {districtRankings.map(d => (
                <div key={d.district} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
                    {d.safetyRank}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-300 text-sm">{d.district}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${trendColor[d.trend]}`}>↑ {d.trend}</span>
                        <span className="text-gray-500 text-xs">{d.incidents} pred. incidents</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-1">
                        <div className={`h-1 rounded-full ${d.predictedRisk > 65 ? 'bg-red-400' : d.predictedRisk > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${d.predictedRisk}%` }} />
                      </div>
                      <span className={`text-xs font-medium shrink-0 ${d.predictedRisk > 65 ? 'text-red-400' : d.predictedRisk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{d.predictedRisk}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white font-medium">Risk Type Prediction Radar</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarPrediction}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-medium">Predicted Incident Zones — Next 24 Hours</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { zone: 'Rohini Sector 5', type: 'Crime Hotspot', risk: 74, color: 'border-red-500/30 bg-red-500/5' },
              { zone: 'Chandni Chowk', type: 'Harassment Risk', risk: 68, color: 'border-amber-500/30 bg-amber-500/5' },
              { zone: 'Saket Market', type: 'Unsafe Zone', risk: 61, color: 'border-amber-500/30 bg-amber-500/5' },
              { zone: 'Lajpat Nagar', type: 'Accident Risk', risk: 52, color: 'border-blue-500/30 bg-blue-500/5' },
              { zone: 'Paharganj', type: 'Crime Hotspot', risk: 71, color: 'border-red-500/30 bg-red-500/5' },
              { zone: 'Dwarka Mkt', type: 'Emergency Risk', risk: 39, color: 'border-emerald-500/30 bg-emerald-500/5' },
              { zone: 'Karol Bagh', type: 'Crime Hotspot', risk: 65, color: 'border-red-500/30 bg-red-500/5' },
              { zone: 'Vasant Vihar', type: 'Harassment Risk', risk: 44, color: 'border-blue-500/30 bg-blue-500/5' },
            ].map(z => (
              <div key={z.zone} className={`p-3 rounded-lg border ${z.color}`}>
                <p className="text-gray-300 text-sm font-medium">{z.zone}</p>
                <p className="text-gray-500 text-xs mt-0.5">{z.type}</p>
                <p className={`text-lg font-bold mt-1 ${z.risk > 65 ? 'text-red-400' : z.risk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{z.risk}%</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
