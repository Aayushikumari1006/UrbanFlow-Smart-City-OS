'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Car, ArrowUp, ArrowDown, Minus } from 'lucide-react'

const CONGESTION_LEVELS = [
  { zone: 'CBD / Connaught Place', index: 88, speed: 12, delay: 52 },
  { zone: 'Chandni Chowk', index: 92, speed: 9, delay: 61 },
  { zone: 'NH-48 Gurgaon Border', index: 76, speed: 22, delay: 38 },
  { zone: 'Rohini - Pitampura', index: 64, speed: 28, delay: 25 },
  { zone: 'Dwarka Expressway', index: 55, speed: 34, delay: 18 },
  { zone: 'Noida Link Road', index: 71, speed: 24, delay: 31 },
]

export default function TrafficPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined
  const t = baseline?.traffic

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Traffic Intelligence" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <Car className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Traffic Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Real-time congestion monitoring and predictive routing</p>
          </div>
        </div>

        {t && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Congestion Index" value={t.congestion_index} unit="%" status={t.congestion_index > 65 ? 'critical' : t.congestion_index > 45 ? 'warning' : 'healthy'} inverseGood />
            <MetricCard label="Avg City Speed" value={t.avg_speed_kmh} unit="km/h" status={t.avg_speed_kmh < 20 ? 'critical' : t.avg_speed_kmh < 30 ? 'warning' : 'healthy'} />
            <MetricCard label="Road Closures" value={t.road_closures} status={t.road_closures > 8 ? 'critical' : 'warning'} inverseGood />
            <MetricCard label="Peak Hour Delay" value={t.peak_hour_delay_min} unit="min" status={t.peak_hour_delay_min > 35 ? 'critical' : 'warning'} inverseGood />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">Zone-wise Congestion</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {CONGESTION_LEVELS.map(z => (
                <div key={z.zone} className="flex items-center px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate">{z.zone}</p>
                    <p className="text-gray-600 text-xs">{z.speed} km/h avg · {z.delay} min delay</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-20">
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${z.index > 75 ? 'bg-red-500' : z.index > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${z.index}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-medium w-8 text-right ${z.index > 75 ? 'text-red-400' : z.index > 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {z.index}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">Traffic Agent Recommendations</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { rec: 'Deploy dynamic signal timing on 14 arterial intersections', impact: 'high', saving: '~8 min delay' },
                { rec: 'Activate bus rapid transit priority lanes on Ring Road', impact: 'high', saving: '~12% commuters' },
                { rec: 'Implement odd-even for vehicles in CBD zones 6AM–10AM', impact: 'medium', saving: '~15% congestion' },
                { rec: 'Expand park-and-ride at 6 metro stations', impact: 'medium', saving: '~20K vehicles/day' },
                { rec: 'Integrate real-time navigation with city traffic signals', impact: 'low', saving: '~5 min avg' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded mt-0.5 font-medium ${item.impact === 'high' ? 'bg-red-500/15 text-red-400' : item.impact === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-gray-800 text-gray-500'}`}>
                    {item.impact}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{item.rec}</p>
                    <p className="text-emerald-400 text-xs mt-0.5">Impact: {item.saving}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
