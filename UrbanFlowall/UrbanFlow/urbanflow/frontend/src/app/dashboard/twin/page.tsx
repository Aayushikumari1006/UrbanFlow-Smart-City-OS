'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Map, Layers, Activity } from 'lucide-react'

export default function DigitalTwinPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined

  const systems = [
    { name: 'Traffic Network', status: (baseline?.traffic?.congestion_index ?? 0) > 65 ? 'critical' : 'healthy', metric: `${baseline?.traffic?.congestion_index ?? '--'}% congestion` },
    { name: 'Air Quality', status: (baseline?.aqi?.aqi_index ?? 0) > 150 ? 'critical' : 'warning', metric: `AQI ${baseline?.aqi?.aqi_index ?? '--'}` },
    { name: 'Safety Grid', status: (baseline?.safety?.incidents_per_lakh ?? 0) > 35 ? 'warning' : 'healthy', metric: `${baseline?.safety?.cctv_coverage_pct ?? '--'}% CCTV` },
    { name: 'Utility Grid', status: 'healthy', metric: '94% operational' },
    { name: 'Public Transport', status: 'warning', metric: `${baseline?.traffic?.public_transit_coverage ?? '--'}% coverage` },
    { name: 'Green Infrastructure', status: 'warning', metric: 'Moderate density' },
  ] as { name: string; status: 'healthy' | 'warning' | 'critical'; metric: string }[]

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Digital Twin Command Center" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">Digital Twin — {cityName}</h2>
            <p className="text-gray-500 text-sm">Real-time city systems overview and predictive monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {systems.map(s => (
            <div key={s.name} className={`bg-[#111827] border rounded-xl p-5 ${
              s.status === 'healthy' ? 'border-emerald-500/20' :
              s.status === 'warning' ? 'border-amber-500/20' : 'border-red-500/20'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <h3 className="text-white font-medium text-sm">{s.name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                  s.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{s.status}</span>
              </div>
              <p className="text-gray-400 text-sm">{s.metric}</p>
              <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  s.status === 'healthy' ? 'bg-emerald-500 w-5/6' :
                  s.status === 'warning' ? 'bg-amber-500 w-3/5' : 'bg-red-500 w-2/5'
                }`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">Live Metrics</h3>
            </div>
            {baseline && (
              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="Congestion" value={baseline.traffic?.congestion_index} unit="%" status={baseline.traffic?.congestion_index > 65 ? 'critical' : 'warning'} />
                <MetricCard label="AQI" value={baseline.aqi?.aqi_index} status={baseline.aqi?.aqi_index > 150 ? 'critical' : 'warning'} />
                <MetricCard label="Safety Score" value={100 - (baseline.safety?.incidents_per_lakh ?? 0)} unit="/100" status="warning" />
                <MetricCard label="Satisfaction" value={baseline.citizen?.satisfaction_score} unit="/100" status="warning" />
              </div>
            )}
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">City Intelligence Feed</h3>
            <div className="space-y-3">
              {[
                { msg: 'High congestion detected in CBD — rerouting recommended', level: 'critical', time: '2m ago' },
                { msg: 'AQI crossed 150 threshold — health advisory triggered', level: 'warning', time: '15m ago' },
                { msg: 'CCTV coverage restored in Sector 12', level: 'info', time: '1h ago' },
                { msg: 'Budget utilization at 78% — on track', level: 'healthy', time: '2h ago' },
                { msg: 'Grievance resolution rate improved by 3%', level: 'healthy', time: '3h ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    item.level === 'critical' ? 'bg-red-400' :
                    item.level === 'warning' ? 'bg-amber-400' :
                    item.level === 'healthy' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                  <p className="text-gray-400 text-sm flex-1">{item.msg}</p>
                  <span className="text-gray-600 text-xs whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
