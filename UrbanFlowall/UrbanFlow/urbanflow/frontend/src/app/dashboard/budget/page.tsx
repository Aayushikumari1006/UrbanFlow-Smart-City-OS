'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { DollarSign, TrendingUp, PieChart } from 'lucide-react'

export default function BudgetPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData } = useCityBaseline(cityId)
  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined
  const bud = baseline?.budget

  const allocations = [
    { category: 'Infrastructure', pct: bud?.infrastructure_pct ?? 35, color: 'bg-blue-500' },
    { category: 'Operations', pct: bud?.operations_pct ?? 43, color: 'bg-amber-500' },
    { category: 'Social Services', pct: bud?.social_pct ?? 22, color: 'bg-emerald-500' },
  ]

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Budget Intelligence" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">Budget Intelligence — {cityName}</h2>
            <p className="text-gray-500 text-sm">Financial monitoring, utilization, and recommendations</p>
          </div>
        </div>

        {bud && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Budget" value={`₹${(bud.total_crore).toLocaleString()}`} unit="Cr" status="healthy" />
            <MetricCard label="Utilized" value={bud.utilized_pct} unit="%" status={bud.utilized_pct > 90 ? 'warning' : 'healthy'} />
            <MetricCard label="Infrastructure" value={bud.infrastructure_pct} unit="%" status="healthy" />
            <MetricCard label="Social Programs" value={bud.social_pct} unit="%" status="warning" />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-medium">Budget Allocation</h3>
            </div>
            <div className="space-y-4">
              {allocations.map(a => (
                <div key={a.category}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-400 text-sm">{a.category}</span>
                    <span className="text-white text-sm font-medium">{a.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${a.color}`} style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-medium">Budget Recommendations</h3>
            </div>
            <div className="space-y-3">
              {[
                { rec: 'Increase infrastructure allocation by 5% for road resurfacing', impact: '₹425 Cr', priority: 'high' },
                { rec: 'Allocate ₹80 Cr for CCTV expansion across high-risk zones', impact: '₹80 Cr', priority: 'high' },
                { rec: 'Expedite smart traffic signal disbursements', impact: '₹120 Cr', priority: 'medium' },
                { rec: 'Add ₹50 Cr contingency for monsoon-related repairs', impact: '₹50 Cr', priority: 'medium' },
              ].map((item, i) => (
                <div key={i} className="py-3 border-b border-gray-800 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      item.priority === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>{item.priority}</span>
                    <span className="text-emerald-400 text-xs font-medium">{item.impact}</span>
                  </div>
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
