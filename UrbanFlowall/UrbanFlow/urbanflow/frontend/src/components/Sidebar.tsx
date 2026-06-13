'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FlaskConical, Map, Shield, MessageSquare,
  DollarSign, Activity, LogOut, Zap, Car, Wind, Building2,
  FileText, Leaf, CloudLightning, Radio, Bot, HelpCircle,
  Settings, ChevronDown, ChevronRight, Eye, UserCheck, Baby,
  Users, Navigation, Brain, Command, TrendingUp, PersonStanding
} from 'lucide-react'
import { fetchAPI } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/scenario-lab', label: 'Scenario Lab', icon: FlaskConical },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/dashboard/twin', label: 'Digital Twin', icon: Map },
      { href: '/dashboard/traffic', label: 'Traffic Intelligence', icon: Car },
      { href: '/dashboard/aqi', label: 'AQI Intelligence', icon: Wind },
      { href: '/dashboard/safety', label: "Women's Safety", icon: Shield },
      { href: '/citizen-feedback', label: 'Citizen Feedback', icon: MessageSquare },
    ],
  },
  {
    label: 'Urban Safety Intelligence',
    items: [
      { href: '/dashboard/urban-safety/vulnerable', label: 'Vulnerable Citizens', icon: Eye },
      { href: '/dashboard/urban-safety/women', label: 'Women Safety AI', icon: Shield },
      { href: '/dashboard/urban-safety/elderly', label: 'Elderly Safety', icon: PersonStanding },
      { href: '/dashboard/urban-safety/child-protection', label: 'Child Protection', icon: Baby },
      { href: '/dashboard/urban-safety/crowd', label: 'Crowd Safety', icon: Users },
      { href: '/dashboard/urban-safety/emergency-behavior', label: 'Emergency Behavior', icon: Zap },
      { href: '/dashboard/urban-safety/safe-route', label: 'Safe Route AI', icon: Navigation },
      { href: '/dashboard/urban-safety/prediction', label: 'Safety Prediction', icon: Brain },
      { href: '/dashboard/urban-safety/command-center', label: 'Safety Command', icon: Command },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/dashboard/budget', label: 'Budget Intelligence', icon: DollarSign },
      { href: '/dashboard/infrastructure', label: 'Infrastructure', icon: Building2 },
      { href: '/dashboard/proposal', label: 'Proposal Evaluation', icon: FileText },
      { href: '/dashboard/executive', label: 'Executive Governance', icon: Activity },
    ],
  },
  {
    label: 'Environment',
    items: [
      { href: '/dashboard/sustainability', label: 'Sustainability', icon: Leaf },
      { href: '/dashboard/climate', label: 'Climate Resilience', icon: CloudLightning },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/dashboard/monitoring', label: 'Monitoring', icon: Radio },
      { href: '/dashboard/copilot', label: 'AI Copilot', icon: Bot },
      { href: '/help-center', label: 'Help Center', icon: HelpCircle },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState<string[]>([])

  async function handleLogout() {
    await fetchAPI('/auth/logout', { method: 'POST' }).catch(() => {})
    router.push('/login')
  }

  function toggleGroup(label: string) {
    setCollapsed(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[#0d1117] border-r border-gray-800/60 shrink-0">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm">UrbanFlow</p>
          <p className="text-gray-500 text-xs truncate">Urban Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {navGroups.map(group => {
          const isCollapsed = collapsed.includes(group.label)
          const isUrbanSafety = group.label === 'Urban Safety Intelligence'
          return (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 py-1.5 mb-0.5"
              >
                <span className={cn(
                  'text-[10px] font-semibold uppercase tracking-widest',
                  isUrbanSafety ? 'text-violet-500' : 'text-gray-600'
                )}>
                  {group.label}
                </span>
                {isCollapsed
                  ? <ChevronRight className="w-3 h-3 text-gray-700" />
                  : <ChevronDown className="w-3 h-3 text-gray-700" />
                }
              </button>
              {!isCollapsed && group.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all mb-0.5',
                      active
                        ? isUrbanSafety
                          ? 'bg-violet-600/15 text-violet-400 border border-violet-600/25'
                          : 'bg-blue-600/15 text-blue-400 border border-blue-600/25'
                        : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-200'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="px-2 py-3 border-t border-gray-800/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-800/60 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
