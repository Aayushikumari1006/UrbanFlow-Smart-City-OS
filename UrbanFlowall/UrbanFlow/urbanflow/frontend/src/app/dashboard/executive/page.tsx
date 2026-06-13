'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Activity, Target, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function ExecutivePage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined

  const overallScore = baseline ? Math.round(
    (100 - (baseline.traffic?.congestion_index ?? 50)) * 0.2 +
    (100 - Math.min((baseline.aqi?.aqi_index ?? 100) / 5, 100)) * 0.2 +
    (baseline.safety?.women_safety_score ?? 60) * 0.2 +
    (baseline.citizen?.satisfaction_score ?? 60) * 0.2 +
    (baseline.budget?.utilized_pct ?? 80) * 0.2
  ) : 0

  const kpis = baseline ? [
    { label: 'Traffic Health', score: 100 - (baseline.traffic?.congestion_index ?? 50), target: 40 },
    { label: 'Air Quality', score: Math.max(0, 100 - (baseline.aqi?.aqi_index ?? 100) / 5), target: 60 },
    { label: 'Public Safety', score: baseline.safety?.women_safety_score ?? 60, target: 75 },
    { label: 'Citizen Satisfaction', score: baseline.citizen?.satisfaction_score ?? 60, target: 70 },
    { label: 'Budget Performance', score: baseline.budget?.utilized_pct ?? 80, target: 85 },
  ] : []

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Executive Governance" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">Executive Governance — {cityName}</h2>
            <p className="text-gray-500 text-sm">Strategic city performance overview for executive decision-making</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Urban Health Score</p>
            <div className={`text-6xl font-bold mb-2 ${
              overallScore >= 60 ? 'text-emerald-400' :
              overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
            }`}>{overallScore}</div>
            <p className="text-gray-400 text-sm">out of 100</p>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
              overallScore >= 60 ? 'bg-emerald-500/20 text-emerald-400' :
              overallScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {overallScore >= 60 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {overallScore >= 60 ? 'Performing Well' : overallScore >= 40 ? 'Needs Attention' : 'Critical Intervention Required'}
            </div>
          </div>

          <div className="md:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">KPI Performance vs Targets</h3>
            </div>
            <div className="space-y-4">
              {kpis.map(kpi => (
                <div key={kpi.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-400 text-sm">{kpi.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs">Target: {kpi.target}</span>
                      <span className={`text-sm font-medium ${kpi.score >= kpi.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {Math.round(kpi.score)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${kpi.score >= kpi.target ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${kpi.score}%` }}
                    />
                    <div className="absolute top-0 h-full w-0.5 bg-white/30" style={{ left: `${kpi.target}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Executive Priorities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Immediate Actions',
                items: ['Reduce AQI through industrial restrictions', 'Expand CCTV in high-risk zones', 'Fast-track grievance resolution'],
                color: 'border-red-500/30',
                label: '30 days',
                labelColor: 'bg-red-500/20 text-red-400',
              },
              {
                title: 'Short-term Goals',
                items: ['Implement smart traffic management', 'Launch citizen feedback app', 'Complete budget disbursements'],
                color: 'border-amber-500/30',
                label: '90 days',
                labelColor: 'bg-amber-500/20 text-amber-400',
              },
              {
                title: 'Strategic Initiatives',
                items: ['Build integrated command center', 'Deploy IoT sensor network', 'Expand public transit coverage'],
                color: 'border-blue-500/30',
                label: '1 year',
                labelColor: 'bg-blue-500/20 text-blue-400',
              },
            ].map(col => (
              <div key={col.title} className={`border rounded-xl p-4 ${col.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">{col.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${col.labelColor}`}>{col.label}</span>
                </div>
                <ul className="space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span className="text-gray-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
