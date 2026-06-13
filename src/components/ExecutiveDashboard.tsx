import React from "react";
import { Shield, TrendingUp, AlertTriangle, Lightbulb, CheckSquare, Zap, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { CityBaseline, AIAnalysis } from "../types";

interface ExecutiveDashboardProps {
  cityId: string;
  cityName: string;
  metrics: CityBaseline;
  overallScore: number;
  aiAnalysis: AIAnalysis;
  onNavigate: (tab: string) => void;
  onTriggerSOS: () => void;
}

const HISTORICAL_DATA_MOCKS = {
  delhi: [
    { month: "Jan", health: 50, congestion: 78, aqi: 240, safety: 48 },
    { month: "Feb", health: 52, congestion: 75, aqi: 210, safety: 50 },
    { month: "Mar", health: 55, congestion: 74, aqi: 195, safety: 52 },
    { month: "Apr", health: 54, congestion: 71, aqi: 188, safety: 53 },
    { month: "May", health: 58, congestion: 72, aqi: 178, safety: 54 }
  ],
  chandigarh: [
    { month: "Jan", health: 70, congestion: 42, aqi: 95, safety: 70 },
    { month: "Feb", health: 71, congestion: 40, aqi: 90, safety: 72 },
    { month: "Mar", health: 73, congestion: 39, aqi: 85, safety: 73 },
    { month: "Apr", health: 74, congestion: 38, aqi: 82, safety: 74 },
    { month: "May", health: 75, congestion: 38, aqi: 82, safety: 74 }
  ]
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  cityId,
  cityName,
  metrics,
  overallScore,
  aiAnalysis,
  onNavigate,
  onTriggerSOS
}) => {
  const history = HISTORICAL_DATA_MOCKS[cityId as "delhi" | "chandigarh"] || HISTORICAL_DATA_MOCKS.delhi;

  // Compute status ring colors
  const statusColor = overallScore >= 70 ? "text-emerald-400 stroke-emerald-500" : overallScore >= 50 ? "text-amber-400 stroke-amber-500" : "text-red-400 stroke-red-500";
  const statusBg = overallScore >= 70 ? "bg-emerald-500/10 text-emerald-400" : overallScore >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400";
  const statusLabel = overallScore >= 70 ? "OPTIMAL ENVIRONMENT" : overallScore >= 50 ? "ELEVATED CONSTRAINTS" : "CRITICAL RISK SHORTFALL";

  return (
    <div className="space-y-6" id="executive-command-center">
      {/* City Health & AI Summary Master Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Gauge Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group backdrop-blur-md">
          <div className="absolute inset-0 bg-radial(from_center,rgba(6,182,212,0.08),transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <span className="text-slate-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-1">CITY COMMAND STATUS</span>
          <h3 className="text-white font-display font-bold text-xl mb-4 truncate w-full">{cityName} Operating Index</h3>

          <div className="relative w-44 h-44 flex items-center justify-center mb-5">
            {/* SVG Progress Circle with double concentric aesthetics */}
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.15)]" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="5"
                stroke="rgba(255, 255, 255, 0.03)"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                strokeWidth="6"
                className={statusColor}
                strokeDasharray={`${overallScore * 2.639} 263.9`}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-5xl font-display font-extrabold text-white tracking-tighter"
              >
                {overallScore}
              </motion.span>
              <span className="text-slate-500 text-[9px] font-mono tracking-[0.15em] -mt-1 leading-none uppercase">Health Score</span>
            </div>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest ${statusBg} border border-current/15 animate-pulse`}>
            {statusLabel}
          </span>
        </div>

        {/* AI Executive summary */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-600 tracking-wider select-none pointer-events-none uppercase">
            Surveillance System Active • COG_v1.0
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgb(34,211,238)] animate-pulse" />
              <h3 className="text-white font-display font-bold text-lg tracking-tight">AI Executive Analytics Summary</h3>
            </div>
            
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans italic border-l-2 border-cyan-500/45 pl-4 mb-4">
              {aiAnalysis.executive_summary}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#05080f] border border-white/5 rounded-xl p-3.5 shadow-inner">
                <span className="text-slate-500 text-[10px] font-mono block uppercase tracking-wider mb-1">CONGESTION</span>
                <span className="text-cyan-400 font-mono text-lg font-bold">{metrics.traffic.congestion_index}%</span>
              </div>
              <div className="bg-[#05080f] border border-white/5 rounded-xl p-3.5 shadow-inner">
                <span className="text-slate-500 text-[10px] font-mono block uppercase tracking-wider mb-1">AIR QUALITY</span>
                <span className="text-emerald-400 font-mono text-lg font-bold">AQI {metrics.aqi.aqi_index}</span>
              </div>
              <div className="bg-[#05080f] border border-white/5 rounded-xl p-3.5 shadow-inner">
                <span className="text-slate-500 text-[10px] font-mono block uppercase tracking-wider mb-1">WOMEN SAFETY</span>
                <span className="text-indigo-400 font-mono text-lg font-bold">{metrics.safety.women_safety_score}/100</span>
              </div>
              <div className="bg-[#05080f] border border-white/5 rounded-xl p-3.5 shadow-inner">
                <span className="text-slate-500 text-[10px] font-mono block uppercase tracking-wider mb-1">SATISFACTION</span>
                <span className="text-amber-400 font-mono text-lg font-bold">{metrics.citizen.satisfaction_score}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risks of non-intervention vs. Opportunity Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Risks */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h4 className="text-white font-display font-semibold text-[15px]">AI Strategic Risks Feed</h4>
          </div>
          <div className="text-slate-300 text-xs leading-relaxed space-y-2 whitespace-pre-line font-mono bg-red-955/10 p-3 rounded-xl border border-red-500/20 shadow-inner">
            {aiAnalysis.risk_assessment}
          </div>
          <button 
            onClick={() => onNavigate("scenariolab")}
            className="mt-4 w-full py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-red-400 hover:text-white rounded-xl text-xs font-mono font-medium transition-all"
          >
            LAUNCH SCENARIO MITIGATION LAB
          </button>
        </div>

        {/* Top Opportunities */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-display font-semibold text-[15px]">AI Opportunity Mapping</h4>
          </div>
          <div className="text-slate-300 text-xs leading-relaxed space-y-2 whitespace-pre-line font-mono bg-emerald-955/10 p-3 rounded-xl border border-emerald-500/20 shadow-inner">
            {aiAnalysis.opportunity_assessment}
          </div>
          <button 
            onClick={() => onNavigate("proposals")}
            className="mt-4 w-full py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-emerald-400 hover:text-white rounded-xl text-xs font-mono font-medium transition-all"
          >
            EVALUATE MUNICIPAL OPPORTUNITIES
          </button>
        </div>
      </div>

      {/* Recommended Actions & Live Historical Data Performance Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recommended Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 xl:col-span-1 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <CheckSquare className="w-5 h-5 text-cyan-400" />
              <h4 className="text-white font-display font-semibold text-[15px]">Urgent Actions Required</h4>
            </div>
            
            <div className="space-y-3">
              {aiAnalysis.recommended_actions.split("\n").map((act, idx) => {
                const text = act.replace(/^•|^-|\d+\./g, "").trim();
                if (!text) return null;
                return (
                  <div key={idx} className="flex gap-3 bg-white/3 border border-white/5 hover:border-cyan-500/30 p-3 rounded-xl transition-all group">
                    <span className="w-5 h-5 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono flex items-center justify-center rounded-lg shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <p className="text-slate-300 text-xs leading-relaxed font-mono">{text}</p>
                      <span className="text-[9px] text-slate-500 font-mono tracking-wider block mt-1 uppercase">EXPLAINABLE_ROI: HIGH</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={onTriggerSOS}
            className="mt-6 w-full py-2.5 bg-red-650/90 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-white font-display font-semibold text-xs tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all animate-pulse"
          >
            <Shield className="w-4 h-4 shrink-0" />
            TRIGGER MUNICIPAL EMERGENCY SOS
          </button>
        </div>

        {/* Recharts Analytics Progression */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 xl:col-span-2 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h4 className="text-white font-display font-semibold text-[15px]">Multi-Month City Health Index</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Telemetry Logs</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0d14", borderColor: "rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                  labelStyle={{ color: "#ffffff", fontFamily: "var(--font-display)", fontSize: "12px" }}
                  itemStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
                />
                <Area type="monotone" name="OS index" dataKey="health" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHealth)" />
                <Area type="monotone" name="AQI index" dataKey="aqi" stroke="#f59e0b" strokeWidth={1} fillOpacity={1} fill="url(#colorAqi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-6 mt-3 justify-center text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
              <span>OS health score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
              <span>AQI index (inverted risk)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
