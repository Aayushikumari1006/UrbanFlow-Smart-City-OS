'use client'

import { useState } from 'react'
import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { fetchAPI } from '@/lib/utils'
import { FlaskConical, Play, RotateCcw, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SliderConfig { key: string; label: string; min: number; max: number; step: number; unit: string; inverseGood?: boolean; group: string }

const SLIDERS: SliderConfig[] = [
  { key: 'road_closures_delta', label: 'Road Closures', min: -10, max: 20, step: 1, unit: 'roads', inverseGood: true, group: 'Traffic' },
  { key: 'aqi_delta', label: 'Industrial Activity', min: -20, max: 30, step: 1, unit: 'pts', inverseGood: true, group: 'Air Quality' },
  { key: 'cctv_delta', label: 'CCTV Coverage', min: -20, max: 30, step: 1, unit: '%', group: 'Safety' },
  { key: 'police_units_delta', label: 'Police Units Deployed', min: -10, max: 20, step: 1, unit: 'units', group: 'Safety' },
  { key: 'budget_delta', label: 'Budget Allocation', min: -20, max: 30, step: 1, unit: '%', group: 'Budget' },
  { key: 'complaints_delta', label: 'Complaint Volume', min: -20, max: 30, step: 1, unit: 'x', inverseGood: true, group: 'Citizens' },
  { key: 'green_cover_delta', label: 'Green Cover Expansion', min: -10, max: 20, step: 1, unit: '%', group: 'Environment' },
]

const DEMO_SCENARIOS = [
  { label: 'Normal City', desc: 'Baseline state', params: { road_closures_delta: 0, aqi_delta: 0, cctv_delta: 0, police_units_delta: 0, budget_delta: 0, complaints_delta: 0, green_cover_delta: 0 } },
  { label: 'Traffic Crisis', desc: 'Major road closures', params: { road_closures_delta: 15, aqi_delta: 8, cctv_delta: 0, police_units_delta: 5, budget_delta: -5, complaints_delta: 12, green_cover_delta: 0 } },
  { label: 'AQI Emergency', desc: 'Severe air pollution', params: { road_closures_delta: 5, aqi_delta: 25, cctv_delta: 0, police_units_delta: 0, budget_delta: -10, complaints_delta: 18, green_cover_delta: -5 } },
  { label: 'Safety Crisis', desc: 'Low CCTV, high crime', params: { road_closures_delta: 3, aqi_delta: 5, cctv_delta: -15, police_units_delta: -8, budget_delta: -15, complaints_delta: 20, green_cover_delta: 0 } },
  { label: 'Urban Revival', desc: 'Optimal investment', params: { road_closures_delta: -5, aqi_delta: -10, cctv_delta: 20, police_units_delta: 15, budget_delta: 20, complaints_delta: -15, green_cover_delta: 18 } },
]

const sliderGroups = ['Traffic', 'Air Quality', 'Safety', 'Budget', 'Citizens', 'Environment']

function DeltaBadge({ value, inverseGood }: { value: number; inverseGood?: boolean }) {
  if (value === 0) return <span className="text-xs text-gray-500 font-mono">0</span>
  const isGood = inverseGood ? value < 0 : value > 0
  const Icon = value > 0 ? TrendingUp : TrendingDown
  return (
    <span className={cn('flex items-center gap-0.5 text-xs font-medium', isGood ? 'text-emerald-400' : 'text-red-400')}>
      <Icon className="w-3 h-3" />
      {value > 0 ? '+' : ''}{value.toFixed(1)}
    </span>
  )
}

function MetricRow({ label, baseline, projected, delta, unit, inverseGood }: { label: string; baseline?: number; projected?: number; delta?: number; unit?: string; inverseGood?: boolean }) {
  const good = inverseGood ? (delta ?? 0) < 0 : (delta ?? 0) > 0
  return (
    <div className="flex items-center py-2.5 border-b border-gray-800/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs truncate">{label}</p>
      </div>
      <div className="flex items-center gap-4 text-right">
        <div>
          <p className="text-gray-600 text-xs">Before</p>
          <p className="text-gray-400 text-sm font-mono">{baseline?.toFixed(1)}{unit}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">After</p>
          <p className="text-white text-sm font-mono font-medium">{projected?.toFixed(1)}{unit}</p>
        </div>
        <div className="w-16 text-right">
          {delta !== undefined && <DeltaBadge value={delta} inverseGood={inverseGood} />}
        </div>
      </div>
    </div>
  )
}

export default function ScenarioLabPage() {
  const { cityId } = useSimulationStore()
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(SLIDERS.map(s => [s.key, 0]))
  )
  const [results, setResults] = useState<Record<string, unknown> | null>(null)
  const [baseline, setBaseline] = useState<Record<string, Record<string, number>> | null>(null)
  const [running, setRunning] = useState(false)
  const [expanded, setExpanded] = useState<string[]>(['traffic_agent', 'aqi_agent', 'executive_agent'])
  const [activeGroup, setActiveGroup] = useState('Traffic')

  async function runSimulation() {
    setRunning(true)
    try {
      const res = await fetchAPI<{ projected: Record<string, Record<string, number>>; deltas: Record<string, number>; agents: Record<string, unknown>; baseline?: Record<string, Record<string, number>> }>(`/simulate?city_id=${cityId}`, {
        method: 'POST',
        body: JSON.stringify({ parameters: params }),
      })
      setResults(res as Record<string, unknown>)
      if (!baseline) {
        const cityRes = await fetchAPI<{ baseline: Record<string, Record<string, number>> }>(`/cities/${cityId}/baselines`)
        setBaseline(cityRes.baseline)
      }
    } finally {
      setRunning(false)
    }
  }

  function loadDemo(demoParams: Record<string, number>) {
    setParams(demoParams)
    setResults(null)
  }

  function reset() {
    setParams(Object.fromEntries(SLIDERS.map(s => [s.key, 0])))
    setResults(null)
  }

  function toggleExpand(key: string) {
    setExpanded(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const projected = results?.projected as Record<string, Record<string, number>> | undefined
  const deltas = results?.deltas as Record<string, number> | undefined
  const agents = results?.agents as Record<string, { status: string; recommendations: string[]; confidence: number; summary?: string; overall_score?: number }> | undefined

  const groupedSliders = sliderGroups.map(g => ({ group: g, sliders: SLIDERS.filter(s => s.group === g) }))

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Scenario Lab" />
      <div className="flex-1 p-5 overflow-auto">
        <div className="flex items-start gap-3 mb-5">
          <FlaskConical className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-white font-semibold text-lg">Scenario Lab</h2>
            <p className="text-gray-500 text-sm">Adjust urban levers → Run simulation → See agent analysis and outcomes</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {DEMO_SCENARIOS.map(s => (
            <button
              key={s.label}
              onClick={() => loadDemo(s.params)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-800 overflow-x-auto">
                {sliderGroups.map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={cn(
                      'px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors',
                      activeGroup === g
                        ? 'bg-blue-600/15 text-blue-400 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-300'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="p-4 space-y-5">
                {groupedSliders.find(g => g.group === activeGroup)?.sliders.map(s => (
                  <div key={s.key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-gray-300 text-sm">{s.label}</label>
                      <span className={cn(
                        'text-xs font-mono px-2 py-0.5 rounded',
                        params[s.key] === 0 ? 'text-gray-500 bg-gray-800' :
                        (s.inverseGood ? params[s.key] > 0 : params[s.key] < 0)
                          ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'
                      )}>
                        {params[s.key] > 0 ? '+' : ''}{params[s.key]} {s.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min} max={s.max} step={s.step}
                      value={params[s.key]}
                      onChange={e => setParams(p => ({ ...p, [s.key]: Number(e.target.value) }))}
                      className="w-full h-1.5 accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-700 mt-1">
                      <span>{s.min}</span><span>0</span><span>+{s.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={runSimulation}
                disabled={running}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                <Play className="w-4 h-4" />
                {running ? 'Running...' : 'Run Simulation'}
              </button>
              <button
                onClick={reset}
                className="px-3 flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg py-2.5 text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-4">
            {projected && deltas && baseline ? (
              <>
                <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="text-white font-medium text-sm">Simulation Outcomes</h3>
                    <span className="text-xs text-gray-500">Before → After → Change</span>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Traffic</p>
                      <MetricRow label="Congestion Index" baseline={baseline.traffic?.congestion_index} projected={projected.traffic?.congestion_index} delta={deltas.congestion_index} unit="%" inverseGood />
                      <MetricRow label="Avg Speed" baseline={baseline.traffic?.avg_speed_kmh} projected={projected.traffic?.avg_speed_kmh} delta={deltas.avg_speed_kmh} unit=" km/h" />
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2 mt-3">Air Quality</p>
                      <MetricRow label="AQI Index" baseline={baseline.aqi?.aqi_index} projected={projected.aqi?.aqi_index} delta={deltas.aqi_index} inverseGood />
                      <MetricRow label="PM2.5" baseline={baseline.aqi?.pm25} projected={projected.aqi?.pm25} delta={deltas.pm25} unit=" μg" inverseGood />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2">Safety</p>
                      <MetricRow label="CCTV Coverage" baseline={baseline.safety?.cctv_coverage_pct} projected={projected.safety?.cctv_coverage_pct} delta={deltas.cctv_coverage_pct} unit="%" />
                      <MetricRow label="Women Safety Score" baseline={baseline.safety?.women_safety_score} projected={projected.safety?.women_safety_score} delta={deltas.women_safety_score} unit="/100" />
                      <MetricRow label="Incidents/Lakh" baseline={baseline.safety?.incidents_per_lakh} projected={projected.safety?.incidents_per_lakh} delta={deltas.incidents_per_lakh} inverseGood />
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-2 mt-3">Citizens</p>
                      <MetricRow label="Satisfaction" baseline={baseline.citizen?.satisfaction_score} projected={projected.citizen?.satisfaction_score} delta={deltas.satisfaction_score} unit="/100" />
                    </div>
                  </div>
                </div>

                {agents && (
                  <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800">
                      <h3 className="text-white font-medium text-sm">Agent Analysis</h3>
                    </div>
                    <div className="divide-y divide-gray-800/60">
                      {Object.entries(agents).map(([key, agent]) => (
                        <div key={key}>
                          <button
                            onClick={() => toggleExpand(key)}
                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {agent.status === 'healthy'
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                : <AlertTriangle className={cn('w-4 h-4 shrink-0', agent.status === 'critical' ? 'text-red-400' : 'text-amber-400')} />
                              }
                              <span className="text-gray-200 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                              {agent.overall_score !== undefined && (
                                <span className="text-gray-500 text-xs">{agent.overall_score}/100</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                                agent.status === 'healthy' ? 'bg-emerald-500/15 text-emerald-400' :
                                agent.status === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                                'bg-red-500/15 text-red-400'
                              )}>{agent.status}</span>
                              {expanded.includes(key)
                                ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
                                : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                              }
                            </div>
                          </button>
                          {expanded.includes(key) && (
                            <div className="px-5 pb-3 space-y-1.5 bg-gray-900/20">
                              {agent.summary && <p className="text-gray-400 text-sm py-1">{agent.summary}</p>}
                              {agent.recommendations?.map((rec, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 text-xs mt-0.5 shrink-0">→</span>
                                  <p className="text-gray-400 text-sm">{rec}</p>
                                </div>
                              ))}
                              <p className="text-gray-700 text-xs pt-1">Confidence: {agent.confidence}%</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#111827] border border-gray-800 rounded-xl p-16 text-center">
                <FlaskConical className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Configure levers and run the simulation</p>
                <p className="text-gray-600 text-sm mt-1">Or pick a demo scenario above to auto-fill values</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
