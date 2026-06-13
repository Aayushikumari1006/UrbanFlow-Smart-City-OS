'use client'

import TopNav from '@/components/TopNav'
import { HelpCircle, Zap, FlaskConical, Map, Shield, Bot, DollarSign, FileText, Leaf, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  {
    icon: Zap,
    title: 'Welcome to UrbanFlow',
    color: 'text-blue-400',
    content: `UrbanFlow is a Multi-Agent Urban Intelligence Platform built for Indian city administrators. It provides a risk-free simulation sandbox where city planners can test urban interventions — like deploying more police units, improving CCTV coverage, or expanding green spaces — and instantly see how AI agents predict the outcomes across traffic, air quality, safety, budget, and citizen satisfaction.

UrbanFlow was designed for government demonstrations, smart city competitions, executive briefings, and day-to-day urban governance decisions.`,
  },
  {
    icon: FlaskConical,
    title: 'How Scenario Lab Works',
    color: 'text-violet-400',
    content: `The Scenario Lab is the core of UrbanFlow. It lets you adjust "urban levers" — parameters that represent real-world interventions — and simulate their effects.

1. Adjust levers: Move sliders for road closures, AQI factors, CCTV coverage, police deployment, budget, complaints, or green cover.
2. Run the simulation: Click "Run Simulation" to activate the deterministic engine.
3. See outcomes: The Before/After/Delta table shows exactly what changed.
4. Read agent analysis: 7 AI agents analyze the outcome and provide actionable recommendations.

Use the quick-load Demo Scenarios (Traffic Crisis, AQI Emergency, Urban Revival) to instantly populate realistic values and see the full system in action.`,
  },
  {
    icon: Map,
    title: 'How Digital Twin Works',
    color: 'text-cyan-400',
    content: `The Digital Twin provides a live systems-level view of the city. It monitors 6 city systems — Traffic Network, Air Quality, Safety Grid, Utility Grid, Public Transport, and Green Infrastructure — showing their real-time health status.

The City Intelligence Feed surfaces live alerts, such as congestion spikes, AQI threshold crossings, and CCTV restoration events, giving operators a consolidated view of what requires attention.`,
  },
  {
    icon: Bot,
    title: 'How AI Agents Work',
    color: 'text-violet-400',
    content: `UrbanFlow runs 7 specialized AI agents using a Blackboard pattern — they all read from and write to a shared state object:

• Traffic Agent — analyzes congestion, speed, and road closures
• AQI Agent — monitors air quality, PM2.5, and health risks
• Safety Agent — tracks incidents, CCTV coverage, and response times
• Women Safety Agent — focused specifically on women's safety scores
• Citizen Agent — monitors satisfaction, grievances, and resolution rates
• Budget Agent — tracks utilization, allocation gaps, and feasibility
• Planning Agent — synthesizes cross-agent insights into strategic priorities
• Executive Agent — generates an overall Urban Health Score (0–100)

All agents run in under 100ms using deterministic math — no external APIs.`,
  },
  {
    icon: DollarSign,
    title: 'How Budget Intelligence Works',
    color: 'text-amber-400',
    content: `The Budget Intelligence module tracks how city funds are allocated and utilized. It shows the split between Infrastructure (35%), Operations (43%), and Social Programs (22%), highlights over/under-utilization risks, and surfaces AI-generated recommendations for reallocation.

In the Scenario Lab, the "Budget Allocation" lever lets you model what happens if budget increases or decreases — the Budget Agent immediately reflects the impact on proposal feasibility and infrastructure priorities.`,
  },
  {
    icon: FileText,
    title: 'How Proposal Evaluation Works',
    color: 'text-pink-400',
    content: `The Proposal Evaluation Center scores infrastructure and policy proposals across three dimensions:

• ROI Score — estimated financial return and cost-effectiveness
• Impact Score — projected improvement to city metrics
• Feasibility Score — implementation difficulty and resource availability

Proposals are ranked and labeled Recommended, Under Review, or Rejected. This helps city administrators prioritize which projects to fast-track and which need more planning.`,
  },
  {
    icon: Leaf,
    title: 'How Sustainability Intelligence Works',
    color: 'text-emerald-400',
    content: `The Sustainability module tracks progress toward long-term environmental goals including Carbon Neutrality (2047), Renewable Energy (2030), and Green Cover expansion. It shows current performance against targets and flags areas where the city is falling behind.

The Climate Resilience Engine models probabilistic climate risks — heat waves, floods, droughts — and suggests mitigation strategies to build urban resilience.`,
  },
  {
    icon: Shield,
    title: "How Women's Safety Intelligence Works",
    color: 'text-rose-400',
    content: `The Women's Safety module provides a dedicated view of safety metrics most relevant to women: safety score, CCTV coverage, street lighting, police response time, and high-risk zone mapping.

The Safety Agent generates zone-specific recommendations — such as installing cameras in identified dark spots or deploying dedicated response units during peak hours — prioritized by risk level.`,
  },
]

const FAQS = [
  { q: 'Is the simulation data real?', a: 'The baseline data is based on realistic parameters for Indian cities. The simulation uses deterministic mathematical transfer functions — there are no external APIs or live data feeds.' },
  { q: 'Why does changing a lever affect multiple metrics?', a: 'Urban systems are deeply interconnected. For example, increasing road closures raises congestion, reduces speeds, decreases citizen satisfaction, and increases complaints — the engine models these cascading effects.' },
  { q: 'What are the demo accounts for?', a: 'Three roles are seeded: Super Admin (full access), Urban Planner (scenario and analytics), and Analyst (read-only). Use them to demonstrate role-based access control.' },
  { q: 'Can I save scenarios?', a: 'Yes — use the Scenario Lab to name and save your simulation configurations. Saved scenarios can be retrieved and rerun with different parameters.' },
  { q: 'How do I switch between Delhi and Chandigarh?', a: 'Use the city selector in the top navigation bar. All baselines, metrics, and simulations will update to reflect the selected city.' },
]

export default function HelpCenterPage() {
  const [expanded, setExpanded] = useState<string[]>(['Welcome to UrbanFlow'])
  const [faqOpen, setFaqOpen] = useState<string[]>([])

  function toggle(title: string) {
    setExpanded(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title])
  }
  function toggleFaq(q: string) {
    setFaqOpen(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q])
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Help Center" />
      <div className="flex-1 p-5 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">UrbanFlow Help Center</h2>
              <p className="text-gray-500 text-sm">Everything you need to understand and use the platform</p>
            </div>
          </div>

          <div className="space-y-2">
            {SECTIONS.map(s => (
              <div key={s.title} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(s.title)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <s.icon className={cn('w-4 h-4 shrink-0', s.color)} />
                    <span className="text-white font-medium text-sm">{s.title}</span>
                  </div>
                  {expanded.includes(s.title)
                    ? <ChevronDown className="w-4 h-4 text-gray-600" />
                    : <ChevronRight className="w-4 h-4 text-gray-600" />
                  }
                </button>
                {expanded.includes(s.title) && (
                  <div className="px-5 pb-5 border-t border-gray-800/60 pt-4">
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-white font-medium text-sm">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {FAQS.map(faq => (
                <div key={faq.q}>
                  <button
                    onClick={() => toggleFaq(faq.q)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition-colors text-left"
                  >
                    <span className="text-gray-300 text-sm">{faq.q}</span>
                    {faqOpen.includes(faq.q)
                      ? <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0 ml-3" />
                      : <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0 ml-3" />
                    }
                  </button>
                  {faqOpen.includes(faq.q) && (
                    <div className="px-5 pb-4 bg-gray-900/20">
                      <p className="text-gray-500 text-sm">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
