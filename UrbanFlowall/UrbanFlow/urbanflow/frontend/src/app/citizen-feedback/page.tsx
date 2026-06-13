'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { useFeedbackDashboard, useFeedbackGrievances, useFeedbackDepartments, useFeedbackStream } from '@/hooks/useFeedback'
import { MessageSquare, CheckCircle2, Clock, Star, TrendingUp } from 'lucide-react'

export default function CitizenFeedbackPage() {
  const { cityId } = useSimulationStore()
  const { data: dashboard } = useFeedbackDashboard(cityId)
  const { data: grievances } = useFeedbackGrievances(cityId)
  const { data: departments } = useFeedbackDepartments(cityId)
  const { data: stream } = useFeedbackStream(cityId)

  const d = dashboard as Record<string, number | string | unknown[]> | undefined
  const gr = grievances as Record<string, string>[] | undefined
  const depts = departments as Record<string, number | string>[] | undefined
  const st = stream as Record<string, string>[] | undefined

  const statusColor = (s: string) => ({
    open: 'text-red-400 bg-red-400/10',
    in_progress: 'text-amber-400 bg-amber-400/10',
    resolved: 'text-emerald-400 bg-emerald-400/10',
    escalated: 'text-purple-400 bg-purple-400/10',
  })[s] || 'text-gray-400 bg-gray-800'

  const sentimentColor = (s: string) => ({
    positive: 'text-emerald-400',
    neutral: 'text-gray-400',
    negative: 'text-red-400',
  })[s] || 'text-gray-400'

  return (
    <div className="flex flex-col h-full">
      <TopNav title="Citizen Feedback Intelligence" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">Citizen Feedback Intelligence</h2>
            <p className="text-gray-500 text-sm">Real-time grievance tracking and sentiment analysis</p>
          </div>
        </div>

        {d && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Grievances', value: (d.total_grievances as number)?.toLocaleString(), icon: MessageSquare, color: 'text-blue-400' },
              { label: 'Resolved', value: (d.resolved as number)?.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Resolution Rate', value: `${d.resolution_rate}%`, icon: TrendingUp, color: 'text-amber-400' },
              { label: 'Avg Resolution', value: `${d.avg_resolution_days} days`, icon: Clock, color: 'text-purple-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#111827] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
                <p className="text-white text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Recent Grievances</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {gr?.map(g => (
                <div key={g.id} className="flex items-start justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500 text-xs font-mono">{g.id}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        g.priority === 'high' ? 'text-red-400 bg-red-400/10' :
                        g.priority === 'medium' ? 'text-amber-400 bg-amber-400/10' :
                        'text-gray-400 bg-gray-800'
                      }`}>{g.priority}</span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">{g.category}</p>
                    <p className="text-gray-600 text-xs">{g.department}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusColor(g.status)}`}>
                    {g.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Department Performance</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {depts?.slice(0, 8).map(dept => (
                <div key={dept.name as string} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-xs w-4">{dept.rank}</span>
                    <div>
                      <p className="text-gray-300 text-sm">{dept.name}</p>
                      <p className="text-gray-500 text-xs">{dept.complaints_received} complaints</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span className="text-white text-sm font-medium">{dept.satisfaction}</span>
                    </div>
                    <p className="text-emerald-400 text-xs">{dept.resolution_rate}% resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {st && (
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Live Feedback Stream</h3>
            <div className="space-y-2">
              {st.slice(0, 8).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.sentiment === 'positive' ? 'bg-emerald-400' :
                      item.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <p className="text-gray-400 text-sm truncate">{item.text}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-gray-600 text-xs">{item.source}</span>
                    <span className={`text-xs font-medium ${sentimentColor(item.sentiment)}`}>{item.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
