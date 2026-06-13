import React, { useState, useEffect } from "react";
import { Map, Layers, Activity, ShieldAlert, Cpu, Heart, CheckCircle2 } from "lucide-react";
import { DEL_ZONES, CHD_ZONES } from "../data";
import { ZoneDetail } from "../types";

interface DigitalTwinProps {
  cityId: string;
  cityName: string;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ cityId, cityName }) => {
  const zones = cityId === "chandigarh" ? CHD_ZONES : DEL_ZONES;
  const [selectedZone, setSelectedZone] = useState<ZoneDetail>(zones[0]);
  const [diagnosticFlow, setDiagnosticFlow] = useState<string[]>([]);

  // Update selected zone if city changes
  useEffect(() => {
    setSelectedZone(zones[0]);
  }, [cityId]);

  // Simulate scrolling live sensor diagnostic telemetry
  useEffect(() => {
    const logs = [
      `[SYS_SEN] Optical CCTV optical attenuation nominal at Node CP_${Math.floor(Math.random() * 100)}`,
      `[AQI_SEN] Micro-moisture calibration complete (PM2.5 laser steady).`,
      `[FLOW_SEN] Congestion index recalculated via Bluetooth sensor polling.`,
      `[THERM] Thermal infrared loop registers delta of +0.4°C over sector core.`,
      `[GRID_SEN] Solar batteries state of health (SoH) verified at 94.2% dispatch rate.`
    ];
    setDiagnosticFlow(logs);

    const interval = setInterval(() => {
      const freshLog = `[TELEMETRIC] Reading Node_ID: ${(Math.random() * 100).toFixed(0)} - Sensor status ${Math.random() > 0.15 ? "NOMINAL" : "STN_CALIB"}`;
      setDiagnosticFlow(prev => [freshLog, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Map className="w-6 h-6 text-cyan-400" />
        <div>
          <h2 className="text-white font-display font-bold text-xl">Spatial Digital Twin Command Center</h2>
          <p className="text-slate-400 text-sm">Real-time localized spatial tracking, telemetry mapping, and smart sector troubleshooting (Phase 7).</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* SVG Map Section */}
        <div className="xl:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-display font-semibold text-sm">Interactive City Spatial Map</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">CLICK SECTOR TO TRACE TELEMETRY</span>
            </div>

            {/* Stylized Grid Sectors Map */}
            <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-6 relative flex flex-col items-center justify-center min-h-[340px] shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#1e2d4d_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Interactive Visual Sectors Grid */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
                {zones.map((z, idx) => {
                  const isSelected = selectedZone.id === z.id;
                  const borderCol = isSelected ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-102 bg-cyan-950/20" : "border-white/5 bg-white/3 hover:border-cyan-500/30";
                  const riskCol = z.risk === "high" ? "bg-red-500/10 text-red-400" : z.risk === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400";
                  return (
                    <div
                      key={z.id}
                      onClick={() => setSelectedZone(z)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${borderCol}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">SECTOR-0{idx + 1}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${riskCol}`}>
                          {z.risk} risk
                        </span>
                      </div>
                      <h4 className="text-white font-display font-semibold text-xs truncate">{z.name}</h4>
                      <p className="text-slate-500 text-[10px] font-mono mt-1">{z.type}</p>

                      <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-2.5">
                        <div>
                          <span className="text-slate-500 text-[8px] font-mono block uppercase">AQI</span>
                          <span className="text-white font-mono text-xs">{z.aqi}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[8px] font-mono block uppercase">CCTV</span>
                          <span className="text-white font-mono text-xs">{z.cctv}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[8px] font-mono block uppercase">CONG</span>
                          <span className="text-white font-mono text-xs">{z.congestion}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sensor stream feed */}
          <div className="mt-5 border-t border-white/10 pb-1 pt-4 font-mono text-[10px] text-slate-500 space-y-1.5 bg-[#05080f]/40 p-3 rounded-xl border border-white/5">
            <span className="text-slate-500 font-bold uppercase block tracking-wider mb-1">LIVE MUNICIPAL SENSOR AGGREGATE</span>
            {diagnosticFlow.map((log, index) => (
              <div key={index} className="flex gap-2 truncate last:opacity-60 first:text-cyan-400 first:font-medium">
                <span className="text-cyan-500/40">{`>`}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Localized Intelligence Panel */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-white font-display font-semibold text-sm">Zone Telemetry Trace</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-[9px] font-mono tracking-wider block uppercase">TARGET CORE</span>
                <p className="text-white font-display font-extrabold text-base">{selectedZone.name}</p>
                <p className="text-slate-500 text-xs font-mono">{selectedZone.type}</p>
              </div>

              {/* Dynamic stats list */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] font-mono block">AQI LEVEL</span>
                  <span className="text-white font-mono text-base font-bold">{selectedZone.aqi} pts</span>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] font-mono block">TRAFFIC DENSITY</span>
                  <span className="text-white font-mono text-base font-bold">{selectedZone.congestion}%</span>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] font-mono block">CCTV SATURATION</span>
                  <span className="text-white font-mono text-base font-bold">{selectedZone.cctv}%</span>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] font-mono block">COMPREHENSIVE SAFETY</span>
                  <span className="text-white font-mono text-base font-bold">{selectedZone.safety}/100</span>
                </div>
              </div>

              {/* Diagnostic report */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 font-mono text-xs text-red-300">
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">ACTIVE TROUBLESHOOT DIALECTICS</span>
                </div>
                <p className="leading-relaxed leading-medium">{selectedZone.diagnosis}</p>
              </div>

              {/* AI recommended treatment */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 font-mono text-xs text-emerald-300">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">AI RECOMMENDED INTERVENTIONS</span>
                </div>
                <p className="leading-relaxed leading-medium">{selectedZone.treatment}</p>
              </div>

              {/* Diagnostic core health */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 bg-[#05080f]/40 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TRANSPONDER: TX_GPX_A1</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-bold">HEALTHY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
