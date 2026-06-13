import { useQuery } from '@tanstack/react-query'
import { fetchAPI } from '@/lib/utils'

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => fetchAPI<{ status: string; version: string; database: string }>('/health'),
    refetchInterval: 30000,
  })
}
