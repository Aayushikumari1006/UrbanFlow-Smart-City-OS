'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Wind, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const AQI_ZONES = [
  { zone: 'Anand Vihar', pm25: 178, aqi: 231, status: 'Hazardous' },
  { zone: 'ITO', pm25: 156, aqi: 204, status: 'Very Unhealthy' },
  { zone: 'Okhla', pm25: 142, aqi: 189, status: 'Very Unhealthy' },
  { zone: 'Rohini', pm25: 128, aqi: 172, status: 'Unhealthy' },
  { zone: 'Dwarka', pm25: 115, aqi: 158, status: 'Unhealthy' },
  { zone: 'Chandigarh Sector 17', pm25: 62, aqi: 78, status: 'Moderate' },
]

function AqiBar({ value }: { value: number }) {
  const pct = Math.min(value / 3, 100)
  const color = value > 200 ? 'bg-purple-500' : value > 150 ? 'bg-red-500' : value > 100 ? 'bg-amber-500' : 'bg-yellow-500'
  return (
    <div className="w-20">
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function AqiPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined
  const a = baseline?.aqi

  return (
    <div className="flex flex-col h-full">
      <TopNav title="AQI Intelligence" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">AQI Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Air quality monitoring, health risk assessment, and remediation planning</p>
          </div>
        </div>

        {a && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="AQI Index" value={a.aqi_index} status={a.aqi_index > 200 ? 'critical' : a.aqi_index > 100 ? 'warning' : 'healthy'} inverseGood />
            <MetricCard label="PM2.5" value={a.pm25} unit="μg/m³" status={a.pm25 > 120 ? 'critical' : a.pm25 > 60 ? 'warning' : 'healthy'} inverseGood />
            <MetricCard label="PM10" value={a.pm10} unit="μg/m³" status={a.pm10 > 150 ? 'critical' : 'warning'} inverseGood />
            <MetricCard label="Good Air Days" value={a.good_air_days_pct} unit="%" status={a.good_air_days_pct < 20 ? 'critical' : 'warning'} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">Zone AQI Readings</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {AQI_ZONES.map(z => (
                <div key={z.zone} className="flex items-center px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm">{z.zone}</p>
                    <p className="text-gray-600 text-xs">PM2.5: {z.pm25} μg/m³</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <AqiBar value={z.aqi} />
                    <span className={`text-xs font-medium whitespace-nowrap ${z.aqi > 200 ? 'text-purple-400' : z.aqi > 150 ? 'text-red-400' : z.aqi > 100 ? 'text-amber-400' : 'text-yellow-400'}`}>
                      {z.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">AQI Agent Actions</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { action: 'Issue health advisory for vulnerable groups in high-AQI zones', priority: 'critical' },
                { action: 'Halt construction activities within 2km of residential zones', priority: 'critical' },
                { action: 'Increase water sprinkling frequency on Ring Road to 4x/day', priority: 'high' },
                { action: 'Mandate BS-VI compliance for commercial vehicles entering CBD', priority: 'high' },
                { action: 'Expand urban green belt along highway corridors by 15%', priority: 'medium' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <AlertTriangle className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', item.priority === 'critical' ? 'text-red-400' : item.priority === 'high' ? 'text-amber-400' : 'text-blue-400')} />
                  <p className="text-gray-300 text-sm">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
