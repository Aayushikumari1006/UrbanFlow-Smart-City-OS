import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  delta?: number
  status?: 'healthy' | 'warning' | 'critical'
  inverseGood?: boolean
}

export default function MetricCard({ label, value, unit, delta, status, inverseGood }: MetricCardProps) {
  const isGood = inverseGood ? (delta ?? 0) < 0 : (delta ?? 0) >= 0
  const DeltaIcon = (delta ?? 0) > 0 ? TrendingUp : (delta ?? 0) < 0 ? TrendingDown : Minus

  const statusStyles = {
    healthy: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    critical: 'border-red-500/20 bg-red-500/5',
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 bg-[#111827]',
      status ? statusStyles[status] : 'border-gray-800'
    )}>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            isGood ? 'text-emerald-400' : 'text-red-400'
          )}>
            <DeltaIcon className="w-3 h-3" />
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </div>
        )}
      </div>
      {status && (
        <div className={cn(
          'mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
          status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
          status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
          'bg-red-500/20 text-red-400'
        )}>
          {status}
        </div>
      )}
    </div>
  )
}
