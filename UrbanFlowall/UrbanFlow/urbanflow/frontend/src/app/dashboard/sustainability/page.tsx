'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { Leaf, Sun, Droplets, Recycle, TreePine } from 'lucide-react'

const GOALS = [
  { label: 'Carbon Neutrality', target: 2047, progress: 28, unit: '% towards target' },
  { label: 'Renewable Energy Share', target: 2030, progress: 34, unit: '% achieved' },
  { label: 'Waste Recycling Rate', target: 2028, progress: 52, unit: '% achieved' },
  { label: 'Green Cover (% city area)', target: 2030, progress: 18, unit: '% of city' },
  { label: 'Electric Vehicle Adoption', target: 2030, progress: 12, unit: '% of fleet' },
]

export default function SustainabilityPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Sustainability Intelligence" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Sustainability Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Environmental performance tracking and sustainability goal management</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Carbon Emissions', value: '24.8', unit: 'MT CO₂/yr', status: 'warning', icon: Sun },
            { label: 'Renewable Share', value: '34', unit: '%', status: 'warning', icon: Recycle },
            { label: 'Green Cover', value: '18', unit: '%', status: 'critical', icon: TreePine },
            { label: 'Water Recycled', value: '41', unit: '%', status: 'warning', icon: Droplets },
          ].map(({ label, value, unit, status, icon: Icon }) => (
            <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-emerald-400" />
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
              <p className="text-white text-xl font-bold">{value}<span className="text-gray-500 text-sm ml-1">{unit}</span></p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <h3 className="text-white font-medium text-sm">Sustainability Goals Progress</h3>
          </div>
          <div className="p-5 space-y-5">
            {GOALS.map(g => (
              <div key={g.label}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-gray-300 text-sm">{g.label}</p>
                    <p className="text-gray-600 text-xs">Target year: {g.target}</p>
                  </div>
                  <span className="text-white font-medium text-sm">{g.progress}% <span className="text-gray-600 text-xs">{g.unit}</span></span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${g.progress >= 50 ? 'bg-emerald-500' : g.progress >= 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
