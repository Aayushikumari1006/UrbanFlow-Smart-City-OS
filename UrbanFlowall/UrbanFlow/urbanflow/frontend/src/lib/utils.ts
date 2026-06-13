import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE = '/api'

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export function statusColor(status: string) {
  if (status === 'healthy') return 'text-emerald-400'
  if (status === 'warning') return 'text-amber-400'
  if (status === 'critical') return 'text-red-400'
  return 'text-gray-400'
}

export function statusBg(status: string) {
  if (status === 'healthy') return 'bg-emerald-400/10 border-emerald-400/20'
  if (status === 'warning') return 'bg-amber-400/10 border-amber-400/20'
  if (status === 'critical') return 'bg-red-400/10 border-red-400/20'
  return 'bg-gray-400/10 border-gray-400/20'
}

export function deltaColor(delta: number) {
  if (delta > 0) return 'text-red-400'
  if (delta < 0) return 'text-emerald-400'
  return 'text-gray-400'
}

export function formatDelta(delta: number) {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}`
}
