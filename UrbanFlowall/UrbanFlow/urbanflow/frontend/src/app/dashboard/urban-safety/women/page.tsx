'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import {
  Shield, AlertTriangle, Camera, MapPin, Navigation,
  TrendingUp, Clock, ChevronRight, Activity, Eye
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts'

const districts = [
  { name: 'Rohini', safetyScore: 52, lighting: 48, crime: 71, cctv: 39, crowd: 62, rank: 1 },
  { name: 'Chandni Chowk', safetyScore: 41, lighting: 35, crime: 83, cctv: 44, crowd: 78, rank: 2 },
  { name: 'Dwarka', safetyScore: 74, lighting: 82, crime: 31, cctv: 71, crowd: 45, rank: 3 },
  { name: 'Connaught Pl.', safetyScore: 68, lighting: 91, crime: 42, cctv: 88, crowd: 55, rank: 4 },
  { name: 'Lajpat Nagar', safetyScore: 61, lighting: 67, crime: 51, cctv: 58, crowd: 48, rank: 5 },
]

const hourlyRisk = [
  { hour: '6AM', risk: 18 }, { hour: '9AM', risk: 24 }, { hour: '12PM', risk: 31 },
  { hour: '3PM', risk: 28 }, { hour: '6PM', risk: 57 }, { hour: '9PM', risk: 82 },
  { hour: '11PM', risk: 91 }, { hour: '2AM', risk: 74 }, { hour: '4AM', risk: 48 },
]

const radarData = [
  { factor: 'Lighting', value: 72 },
  { factor: 'Crime Score', value: 58 },
  { factor: 'Crowd Density', value: 65 },
  { factor: 'CCTV', value: 78 },
  { factor: 'Response Time', value: 61 },
  { factor: 'Safe Routes', value: 54 },
]

const recommendations = [
  { action: 'Install 45 additional CCTV cameras in Rohini Sector 5', priority: 'critical', impact: 'High', timeline: '2 weeks' },
  { action: 'Extend street lighting hours in Chandni Chowk corridor (8PM–2AM)', priority: 'critical', impact: 'High', timeline: '1 week' },
  { action: 'Deploy women safety helpline kiosks in top-5 risk zones', priority: 'high', impact: 'Medium', timeline: '1 month' },
  { action: 'Increase police patrol frequency during 8PM–12AM window', priority: 'high', impact: 'High', timeline: 'Immediate' },
  { action: 'Launch safe-route mapping AI for night commuters', priority: 'medium', impact: 'Medium', timeline: '6 weeks' },
  { action: 'Dark zone identification & emergency lighting deployment', priority: 'medium', impact: 'Medium', timeline: '3 weeks' },
]

const priorityColor: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
}

export default function WomenSafetyAIPage() {
  const { cityName, cityId } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined
  const safety = baseline?.safety

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Women Safety Intelligence" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-600/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl">Women Safety Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Safe route planning · Risk forecasting · Distress detection · Dark zone identification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Women Safety Score" value={safety?.women_safety_score ?? 68} unit="/100" status={(safety?.women_safety_score ?? 68) > 65 ? 'healthy' : 'warning'} />
          <MetricCard label="CCTV Coverage" value={safety?.cctv_coverage_pct ?? 72} unit="%" status={(safety?.cctv_coverage_pct ?? 72) > 75 ? 'healthy' : 'warning'} />
          <MetricCard label="Police Response" value={safety?.police_response_min ?? 8} unit="min" status={(safety?.police_response_min ?? 8) < 10 ? 'healthy' : 'warning'} inverseGood />
          <MetricCard label="Lit Streets" value={safety?.lit_streets_pct ?? 85} unit="%" status={(safety?.lit_streets_pct ?? 85) > 80 ? 'healthy' : 'warning'} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-rose-400" />
              <h3 className="text-white font-medium">District Safety Rankings</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={districts} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                <Bar dataKey="safetyScore" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Safety Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-violet-400" />
              <h3 className="text-white font-medium">Risk Factor Radar</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-medium">Hourly Risk Timeline</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={hourlyRisk}>
                <defs>
                  <linearGradient id="womenRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }} />
                <Area type="monotone" dataKey="risk" stroke="#f43f5e" fill="url(#womenRiskGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">High-Risk Zones</h3>
            </div>
            <div className="space-y-2">
              {[
                { zone: 'Chandni Chowk', risk: 'high', incidents: 12, cctv: 45 },
                { zone: 'Rohini Sector 5', risk: 'high', incidents: 15, cctv: 32 },
                { zone: 'Connaught Place', risk: 'medium', incidents: 7, cctv: 78 },
                { zone: 'Lajpat Nagar', risk: 'low', incidents: 3, cctv: 85 },
                { zone: 'Dwarka Sector 10', risk: 'medium', incidents: 8, cctv: 61 },
              ].map(h => (
                <div key={h.zone} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${h.risk === 'high' ? 'text-red-400' : h.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <div>
                      <p className="text-gray-300 text-sm">{h.zone}</p>
                      <p className="text-gray-600 text-xs">{h.incidents} incidents</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs flex items-center gap-1"><Camera className="w-3 h-3" />{h.cctv}%</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${h.risk === 'high' ? 'bg-red-500/20 text-red-400' : h.risk === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{h.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-medium">Safe Mobility Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-800">
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold mt-0.5 shrink-0 ${priorityColor[item.priority]}`}>{item.priority}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm">{item.action}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>Impact: {item.impact}</span>
                    <span>Timeline: {item.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Safe Route Analysis Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {['Location', 'Risk Analysis', 'Lighting Score', 'Crime Score', 'Crowd Density', 'CCTV Coverage', 'Safe Route Recommendation'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${i === arr.length - 1 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>{step}</div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
