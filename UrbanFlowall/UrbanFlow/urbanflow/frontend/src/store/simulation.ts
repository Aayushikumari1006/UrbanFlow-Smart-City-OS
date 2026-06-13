import { create } from 'zustand'

interface SimulationState {
  cityId: number
  cityName: string
  lastScenarioId: number | null
  results: Record<string, unknown> | null
  setCityId: (id: number, name: string) => void
  setLastScenarioId: (id: number) => void
  setResults: (results: Record<string, unknown>) => void
  clearResults: () => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  cityId: 1,
  cityName: 'Delhi',
  lastScenarioId: null,
  results: null,
  setCityId: (id, name) => set({ cityId: id, cityName: name }),
  setLastScenarioId: (id) => set({ lastScenarioId: id }),
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: null }),
}))
