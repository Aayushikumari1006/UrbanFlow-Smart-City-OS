'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Shield, AlertTriangle, Camera, MapPin } from 'lucide-react'

export default function SafetyPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined
  const safety = baseline?.safety

  const hotspots = [
    { zone: 'Chandni Chowk', risk: 'high', incidents: 12, cctv: 45 },
    { zone: 'Connaught Place', risk: 'medium', incidents: 7, cctv: 78 },
    { zone: 'Rohini Sector 5', risk: 'high', incidents: 15, cctv: 32 },
    { zone: 'Lajpat Nagar', risk: 'low', incidents: 3, cctv: 85 },
    { zone: 'Dwarka Sector 10', risk: 'medium', incidents: 8, cctv: 61 },
  ]

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Women's Safety Intelligence" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">Women's Safety Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">AI-powered safety monitoring and incident prediction</p>
          </div>
        </div>

        {safety && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Women Safety Score" value={safety.women_safety_score} unit="/100" status={safety.women_safety_score > 65 ? 'healthy' : 'warning'} />
            <MetricCard label="CCTV Coverage" value={safety.cctv_coverage_pct} unit="%" status={safety.cctv_coverage_pct > 75 ? 'healthy' : 'warning'} />
            <MetricCard label="Police Response" value={safety.police_response_min} unit="min" status={safety.police_response_min < 10 ? 'healthy' : 'warning'} inverseGood />
            <MetricCard label="Lit Streets" value={safety.lit_streets_pct} unit="%" status={safety.lit_streets_pct > 80 ? 'healthy' : 'warning'} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-red-400" />
              <h3 className="text-white font-medium">High-Risk Zones</h3>
            </div>
            <div className="space-y-3">
              {hotspots.map(h => (
                <div key={h.zone} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-4 h-4 ${
                      h.risk === 'high' ? 'text-red-400' :
                      h.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                    <div>
                      <p className="text-gray-300 text-sm">{h.zone}</p>
                      <p className="text-gray-600 text-xs">{h.incidents} incidents this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">{h.cctv}%</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      h.risk === 'high' ? 'bg-red-500/20 text-red-400' :
                      h.risk === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>{h.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Safety Recommendations</h3>
            <div className="space-y-3">
              {[
                { rec: 'Install 45 additional CCTV cameras in Rohini Sector 5', priority: 'critical' },
                { rec: 'Extend street lighting hours in Chandni Chowk corridor', priority: 'high' },
                { rec: 'Deploy women safety helpline kiosks in top-5 risk zones', priority: 'high' },
                { rec: 'Increase police patrol frequency during 8PM-12AM window', priority: 'medium' },
                { rec: 'Launch safe-route mapping app for commuters', priority: 'medium' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 ${
                    item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{item.priority}</span>
                  <p className="text-gray-400 text-sm">{item.rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
