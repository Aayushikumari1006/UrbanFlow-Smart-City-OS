'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { CloudLightning, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react'

const RISKS = [
  { event: 'Urban Heat Island', probability: 92, impact: 'High', zones: 'CBD, Industrial Zones', mitigation: 'Green roofs + cool pavements' },
  { event: 'Flash Flooding', probability: 74, impact: 'Critical', zones: 'Low-lying areas, Yamuna floodplain', mitigation: 'Stormwater upgrade + early warning' },
  { event: 'Prolonged Drought', probability: 45, impact: 'High', zones: 'Outer districts', mitigation: 'Rainwater harvesting mandate' },
  { event: 'Extreme Heat Wave', probability: 81, impact: 'High', zones: 'City-wide', mitigation: 'Cooling centers + outdoor work restrictions' },
  { event: 'Dense Fog Event', probability: 89, impact: 'Medium', zones: 'Airport, Expressways', mitigation: 'Catseye deployment + speed monitoring' },
]

export default function ClimatePage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Climate Resilience Engine" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <CloudLightning className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Climate Resilience Engine — {cityName}</h2>
            <p className="text-gray-500 text-sm">Climate risk modeling, event prediction, and resilience planning</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Temperature', value: '+1.8°C', sub: 'above 1990 baseline', icon: Thermometer, color: 'text-red-400' },
            { label: 'Annual Rainfall', value: '-12%', sub: 'vs 10yr avg', icon: Droplets, color: 'text-blue-400' },
            { label: 'Heat Risk Score', value: '74/100', sub: 'High risk zone', icon: CloudLightning, color: 'text-amber-400' },
            { label: 'Flood Risk Zones', value: '8', sub: 'active zones', icon: Wind, color: 'text-sky-400' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
              <p className="text-white text-xl font-bold">{value}</p>
              <p className="text-gray-600 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-white font-medium text-sm">Climate Risk Register</h3>
          </div>
          <div className="divide-y divide-gray-800/50">
            {RISKS.map(r => (
              <div key={r.event} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 shrink-0 ${r.impact === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                    <p className="text-gray-200 text-sm font-medium">{r.event}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.impact === 'Critical' ? 'bg-red-500/15 text-red-400' : r.impact === 'High' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                      {r.impact}
                    </span>
                    <span className="text-gray-400 text-xs">{r.probability}% prob.</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs ml-6">Zones: {r.zones}</p>
                <p className="text-emerald-400/80 text-xs ml-6 mt-0.5">Mitigation: {r.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
