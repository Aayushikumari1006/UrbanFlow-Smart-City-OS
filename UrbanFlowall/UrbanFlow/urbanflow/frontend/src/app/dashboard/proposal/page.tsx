'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { FileText, Star, TrendingUp, DollarSign, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROPOSALS = [
  {
    id: 'PRP-001',
    title: 'Integrated Smart Traffic Management System',
    category: 'Traffic',
    cost: 850,
    roi_score: 88,
    impact_score: 91,
    feasibility: 82,
    citizen_impact: 'High',
    status: 'recommended',
    description: 'Deploy AI-based adaptive traffic signals across 120 intersections with real-time flow optimization.',
  },
  {
    id: 'PRP-002',
    title: 'Air Quality Monitoring & Remediation Network',
    category: 'Environment',
    cost: 420,
    roi_score: 76,
    impact_score: 89,
    feasibility: 88,
    citizen_impact: 'Very High',
    status: 'recommended',
    description: 'Install 200 IoT AQI sensors with automated remediation triggers and public dashboards.',
  },
  {
    id: 'PRP-003',
    title: 'Women Safety Smart Zones — Phase 2',
    category: 'Safety',
    cost: 280,
    roi_score: 72,
    impact_score: 94,
    feasibility: 90,
    citizen_impact: 'Very High',
    status: 'recommended',
    description: 'Expand SHe-Box kiosks, panic button network, and dedicated police response fleet.',
  },
  {
    id: 'PRP-004',
    title: 'Citizen Grievance Digital Platform',
    category: 'Governance',
    cost: 95,
    roi_score: 84,
    impact_score: 78,
    feasibility: 95,
    citizen_impact: 'High',
    status: 'recommended',
    description: 'Unified grievance portal with SLA tracking, SMS updates, and department performance scorecards.',
  },
  {
    id: 'PRP-005',
    title: 'Green Urban Corridor — Ring Road',
    category: 'Sustainability',
    cost: 680,
    roi_score: 61,
    impact_score: 72,
    feasibility: 68,
    citizen_impact: 'Medium',
    status: 'review',
    description: 'Plant 50,000 trees and establish 18km of dedicated cycling infrastructure along Ring Road.',
  },
]

const statusStyle = {
  recommended: 'bg-emerald-500/15 text-emerald-400',
  review: 'bg-amber-500/15 text-amber-400',
  rejected: 'bg-red-500/15 text-red-400',
} as Record<string, string>

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', value >= 80 ? 'bg-emerald-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6">{value}</span>
    </div>
  )
}

export default function ProposalPage() {
  const { cityName } = useSimulationStore()

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Proposal Evaluation" />
      <div className="flex-1 p-5 space-y-5 overflow-auto">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-violet-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Proposal Evaluation Center — {cityName}</h2>
            <p className="text-gray-500 text-sm">AI-scored infrastructure and policy proposals ranked by impact, ROI, and feasibility</p>
          </div>
        </div>

        <div className="space-y-4">
          {PROPOSALS.map(p => (
            <div key={p.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-600 text-xs font-mono">{p.id}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{p.category}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusStyle[p.status])}>{p.status}</span>
                  </div>
                  <h3 className="text-white font-medium text-sm">{p.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{p.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold text-lg">₹{p.cost} Cr</p>
                  <p className="text-gray-500 text-xs">estimated cost</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-800/60">
                <div>
                  <p className="text-gray-600 text-xs mb-1.5 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> ROI Score</p>
                  <ScoreBar value={p.roi_score} />
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1.5 flex items-center gap-1"><Star className="w-3 h-3" /> Impact Score</p>
                  <ScoreBar value={p.impact_score} />
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" /> Citizen Impact</p>
                  <span className={cn('text-xs font-medium', p.citizen_impact === 'Very High' ? 'text-emerald-400' : p.citizen_impact === 'High' ? 'text-blue-400' : 'text-amber-400')}>
                    {p.citizen_impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
