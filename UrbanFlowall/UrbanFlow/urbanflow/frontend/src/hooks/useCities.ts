import { useQuery } from '@tanstack/react-query'
import { fetchAPI } from '@/lib/utils'

export interface City {
  id: number
  name: string
  state: string
  population: number
  area_sq_km: number
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => fetchAPI<City[]>('/cities'),
  })
}

export function useCityBaseline(cityId: number) {
  return useQuery({
    queryKey: ['city-baseline', cityId],
    queryFn: () => fetchAPI<{ city_id: number; name: string; baseline: Record<string, unknown> }>(`/cities/${cityId}/baselines`),
    enabled: !!cityId,
  })
}
