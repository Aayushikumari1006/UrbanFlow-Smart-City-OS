'use client'

import { useHealth } from '@/hooks/useHealth'
import { useSimulationStore } from '@/store/simulation'
import { useCities } from '@/hooks/useCities'
import { Activity } from 'lucide-react'

export default function TopNav({ title }: { title?: string }) {
  const { data: health } = useHealth()
  const { cityId, cityName, setCityId } = useSimulationStore()
  const { data: cities } = useCities()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0d1117] border-b border-gray-800">
      <h1 className="text-white font-semibold text-lg">{title || 'UrbanFlow'}</h1>
      <div className="flex items-center gap-4">
        {cities && (
          <select
            value={cityId}
            onChange={(e) => {
              const id = Number(e.target.value)
              const city = cities.find(c => c.id === id)
              if (city) setCityId(id, city.name)
            }}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5"
          >
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className={`text-xs font-medium ${health?.database === 'connected' ? 'text-emerald-400' : 'text-red-400'}`}>
            {health?.database === 'connected' ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
