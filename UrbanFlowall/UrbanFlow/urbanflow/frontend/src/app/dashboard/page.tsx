'use client'

import TopNav from '@/components/TopNav'
import MetricCard from '@/components/MetricCard'
import { useSimulationStore } from '@/store/simulation'
import { useCityBaseline } from '@/hooks/useCities'
import { Activity, Users, Wind, Car, Shield, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const { cityId, cityName } = useSimulationStore()
  const { data: cityData, isLoading } = useCityBaseline(cityId)

  const baseline = cityData?.baseline as Record<string, Record<string, number>> | undefined

  return (
    <div className="flex flex-col h-full">
      <TopNav title="City Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-xl">{cityName} — Live Overview</h2>
            <p className="text-gray-500 text-sm">Real-time urban metrics and agent status</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-28 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : baseline ? (
          <>
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-amber-400" />
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Traffic</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Congestion Index" value={baseline.traffic?.congestion_index} unit="%" status={baseline.traffic?.congestion_index > 65 ? 'critical' : baseline.traffic?.congestion_index > 45 ? 'warning' : 'healthy'} inverseGood />
                <MetricCard label="Avg Speed" value={baseline.traffic?.avg_speed_kmh} unit="km/h" status={baseline.traffic?.avg_speed_kmh < 20 ? 'critical' : baseline.traffic?.avg_speed_kmh < 30 ? 'warning' : 'healthy'} />
                <MetricCard label="Road Closures" value={baseline.traffic?.road_closures} status={baseline.traffic?.road_closures > 8 ? 'critical' : 'warning'} inverseGood />
                <MetricCard label="Peak Delay" value={baseline.traffic?.peak_hour_delay_min} unit="min" status={baseline.traffic?.peak_hour_delay_min > 30 ? 'critical' : 'warning'} inverseGood />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Wind className="w-4 h-4 text-purple-400" />
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Air Quality</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="AQI Index" value={baseline.aqi?.aqi_index} status={baseline.aqi?.aqi_index > 150 ? 'critical' : baseline.aqi?.aqi_index > 100 ? 'warning' : 'healthy'} inverseGood />
                <MetricCard label="PM2.5" value={baseline.aqi?.pm25} unit="μg/m³" status={baseline.aqi?.pm25 > 100 ? 'critical' : baseline.aqi?.pm25 > 60 ? 'warning' : 'healthy'} inverseGood />
                <MetricCard label="Good Air Days" value={baseline.aqi?.good_air_days_pct} unit="%" status={baseline.aqi?.good_air_days_pct < 20 ? 'critical' : 'warning'} />
                <MetricCard label="Industrial Zones" value={baseline.aqi?.industrial_zones} status="warning" inverseGood />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Safety</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Incidents/Lakh" value={baseline.safety?.incidents_per_lakh} status={baseline.safety?.incidents_per_lakh > 35 ? 'critical' : 'warning'} inverseGood />
                <MetricCard label="CCTV Coverage" value={baseline.safety?.cctv_coverage_pct} unit="%" status={baseline.safety?.cctv_coverage_pct > 75 ? 'healthy' : 'warning'} />
                <MetricCard label="Response Time" value={baseline.safety?.police_response_min} unit="min" status={baseline.safety?.police_response_min > 15 ? 'critical' : 'warning'} inverseGood />
                <MetricCard label="Women Safety" value={baseline.safety?.women_safety_score} unit="/100" status={baseline.safety?.women_safety_score > 65 ? 'healthy' : 'warning'} />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Budget</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Total Budget" value={`₹${(baseline.budget?.total_crore / 100).toFixed(0)}B`} status="healthy" />
                  <MetricCard label="Utilized" value={baseline.budget?.utilized_pct} unit="%" status={baseline.budget?.utilized_pct > 90 ? 'warning' : 'healthy'} />
                </div>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-rose-400" />
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Citizens</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Satisfaction" value={baseline.citizen?.satisfaction_score} unit="/100" status={baseline.citizen?.satisfaction_score > 65 ? 'healthy' : 'warning'} />
                  <MetricCard label="Grievances/Mo" value={baseline.citizen?.grievances_monthly?.toLocaleString()} status="warning" inverseGood />
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-12">No data available</div>
        )}
      </div>
    </div>
  )
}
