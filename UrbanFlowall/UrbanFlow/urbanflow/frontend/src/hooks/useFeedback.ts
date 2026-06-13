import { useQuery } from '@tanstack/react-query'
import { fetchAPI } from '@/lib/utils'

export function useFeedbackDashboard(cityId: number) {
  return useQuery({
    queryKey: ['feedback-dashboard', cityId],
    queryFn: () => fetchAPI<Record<string, unknown>>(`/feedback/dashboard?city_id=${cityId}`),
    refetchInterval: 30000,
  })
}

export function useFeedbackGrievances(cityId: number) {
  return useQuery({
    queryKey: ['feedback-grievances', cityId],
    queryFn: () => fetchAPI<unknown[]>(`/feedback/grievances?city_id=${cityId}`),
    refetchInterval: 15000,
  })
}

export function useFeedbackStream(cityId: number) {
  return useQuery({
    queryKey: ['feedback-stream', cityId],
    queryFn: () => fetchAPI<unknown[]>(`/feedback/stream?city_id=${cityId}`),
    refetchInterval: 10000,
  })
}

export function useFeedbackDepartments(cityId: number) {
  return useQuery({
    queryKey: ['feedback-departments', cityId],
    queryFn: () => fetchAPI<unknown[]>(`/feedback/departments?city_id=${cityId}`),
  })
}
