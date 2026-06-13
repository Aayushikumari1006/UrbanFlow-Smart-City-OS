'use client'

import TopNav from '@/components/TopNav'
import { Settings, User, Bell, Shield, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopNav title="Settings" />
      <div className="flex-1 p-5 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="text-white font-semibold text-lg">Platform Settings</h2>
          </div>

          {[
            { icon: User, title: 'Account', items: ['Display name', 'Email address', 'Role & permissions'] },
            { icon: Bell, title: 'Notifications', items: ['Alert thresholds', 'Email digests', 'Critical event alerts'] },
            { icon: Shield, title: 'Security', items: ['Change password', 'Session management', 'Audit log'] },
            { icon: Database, title: 'Data & Simulation', items: ['Default city', 'Simulation precision', 'Data retention'] },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-500" />
                <h3 className="text-white font-medium text-sm">{title}</h3>
              </div>
              <div className="divide-y divide-gray-800/50">
                {items.map(item => (
                  <div key={item} className="flex items-center justify-between px-5 py-3">
                    <span className="text-gray-400 text-sm">{item}</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Configure</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
