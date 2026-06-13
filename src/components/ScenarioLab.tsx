import React, { useState } from "react";
import { Play, RotateCcw, FlaskConical, Bookmark, ArrowRight, Table, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { SLIDERS, DEMO_SCENARIOS } from "../data";
import { SavedScenario, CityBaseline } from "../types";

interface ScenarioLabProps {
  cityId: string;
  baseline: CityBaseline | null;
  savedScenarios: SavedScenario[];
  onSaveScenario: (name: string, desc: string, params: Record<string, number>) => Promise<any>;
  onRunSimulation: (params: Record<string, number>) => Promise<any>;
  onDeleteScenario: (id: string) => Promise<any>;
}

export const ScenarioLab: React.FC<ScenarioLabProps> = ({
  cityId,
  baseline,
  savedScenarios,
  onSaveScenario,
  onRunSimulation,
  onDeleteScenario
}) => {
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(SLIDERS.map(s => [s.key, 0]))
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [activeGroup, setActiveGroup] = useState("Traffic");

  // Save Scenario state
  const [scenName, setScenName] = useState("");
  const [scenDesc, setScenDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compare Table state
  const [showCompare, setShowCompare] = useState(false);

  const currentGroupSliders = SLIDERS.filter(s => s.group === activeGroup);

  const runSimulation = async (customParams = params) => {
    setRunning(true);
    setResults(null);
    try {
      const res = await onRunSimulation(customParams);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const handleLoadDemo = (leverParams: Record<string, number>) => {
    setParams(leverParams);
    setResults(null);
  };

  const handleReset = () => {
    setParams(Object.fromEntries(SLIDERS.map(s => [s.key, 0])));
    setResults(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenName.trim()) return;
    setSaving(true);
    try {
      await onSaveScenario(scenName, scenDesc, params);
      setScenName("");
      setScenDesc("");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-white font-display font-bold text-xl">Simulation Scenario Laboratory</h2>
            <p className="text-gray-500 text-sm">Fine-tune municipal levers to simulate cross-domain structural actions and trace AI agent comments.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCompare(!showCompare)}
          className="px-4 py-2 bg-brand-dark/60 hover:bg-brand-border border border-brand-border rounded-lg text-xs font-mono font-medium text-blue-400 hover:text-white flex items-center gap-2 transition-all"
        >
          <Table className="w-4 h-4" />
          {showCompare ? "HIDE COMPARISON MATRIX" : "VIEW COMPARISON MATRIX"}
        </button>
      </div>

      {/* Demo Selection bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-2 font-semibold uppercase">PRE-POSITIONED STRATEGIC LEVER CODES</span>
        <div className="flex flex-wrap gap-2">
          {DEMO_SCENARIOS.map(s => (
            <button
              key={s.label}
              onClick={() => handleLoadDemo(s.params)}
              className="px-3 py-1.5 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-white rounded-lg flex items-center gap-2 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Overlay Panel */}
      {showCompare && (
        <div className="bg-slate-950/85 border border-cyan-500/30 rounded-2xl p-5 shadow-lg animate-fadeIn backdrop-blur-md">
          <h3 className="text-white font-display font-bold text-[15px] mb-3 flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            Saved Scenarios Comparison Master Sheet
          </h3>
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left font-mono text-xs text-slate-400">
              <thead className="bg-[#05080f] text-slate-500 border-b border-white/10">
                <tr>
                   <th className="p-3">Scenario Protocol</th>
                  <th className="p-3">Decentralized Levers</th>
                  <th className="p-3">CCTV Exp.</th>
                  <th className="p-3">Green Cov.</th>
                  <th className="p-3">Closure Lever</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Primary Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {savedScenarios.filter(scen => scen.cityId === cityId).map(scen => (
                  <tr key={scen.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">{scen.name}</td>
                    <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">{scen.description}</td>
                    <td className="p-3 text-[11px] text-cyan-400 font-bold">+{scen.parameters.cctv_delta}%</td>
                    <td className="p-3 text-[11px] text-emerald-400 font-bold">+{scen.parameters.green_cover_delta}%</td>
                    <td className="p-3 text-[11px] text-red-400 font-bold">+{scen.parameters.road_closures_delta} rds</td>
                    <td className="p-3 text-[10px] text-slate-600">{new Date(scen.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setParams(scen.parameters);
                          runSimulation(scen.parameters);
                          setShowCompare(false);
                        }}
                        className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500 hover:text-white border border-cyan-500/20 text-cyan-400 text-[10px] rounded"
                      >
                        Run
                      </button>
                      <button
                        onClick={() => onDeleteScenario(scen.id)}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-[10px] rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {savedScenarios.filter(scen => scen.cityId === cityId).length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No saved municipal scenario profiles detected for this city node.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Levers Card */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-5 backdrop-blur-md">
          <div className="flex border-b border-white/10 pb-3 mb-4 gap-2 overflow-x-auto">
            {["Traffic", "Air Quality", "Safety", "Budget", "Citizens", "Environment"].map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all whitespace-nowrap ${
                  activeGroup === g ? "bg-cyan-600/25 border border-cyan-500/50 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {currentGroupSliders.map(s => (
              <div key={s.key} className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>{s.label}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    params[s.key] === 0 ? "text-slate-600 bg-white/5" :
                    (s.inverseGood ? params[s.key] > 0 : params[s.key] < 0)
                      ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"
                  }`}>
                    {params[s.key] > 0 ? "+" : ""}{params[s.key]} {s.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={params[s.key]}
                  onChange={e => setParams(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                  className="w-full h-1 bg-[#05080f] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-600">
                  <span>{s.min} {s.unit}</span>
                  <span>0</span>
                  <span>+{s.max} {s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Footer */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
            <button
              onClick={handleReset}
              className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              RESET
            </button>
            <button
              onClick={() => runSimulation()}
              disabled={running}
              className="py-2.5 bg-cyan-600/20 hover:bg-cyan-500/30 disabled:opacity-50 border border-cyan-500/50 text-cyan-400 font-display font-bold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/10"
            >
              <Play className="w-3.5 h-3.5" />
              {running ? "CALCULATING..." : "RUN SIMULATOR"}
            </button>
          </div>

          {/* Save Scenario Form */}
          <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <span className="text-slate-500 text-[10px] font-mono tracking-wider block font-semibold uppercase">STORE AS PERMANENT OS SCENARIO PROTOCOL</span>
            <input
              type="text"
              placeholder="Enter scenario code protocol"
              value={scenName}
              onChange={e => setScenName(e.target.value)}
              className="w-full bg-[#05080f] border border-white/10 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-700 outline-none"
            />
            <input
              type="text"
              placeholder="Decentralized strategy outline notes"
              value={scenDesc}
              onChange={e => setScenDesc(e.target.value)}
              className="w-full bg-[#05080f] border border-white/10 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-700 outline-none"
            />
            <button
              type="submit"
              disabled={saving || !scenName.trim()}
              className="w-full py-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 disabled:opacity-30 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {saving ? "SAVING..." : "COMMIT TO DATABASE"}
            </button>

            {savedSuccess && (
              <p className="text-[10px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Successfully written to persistent datastore nodes!
              </p>
            )}
          </form>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-8 space-y-6">
          {results && baseline ? (
            <>
              {/* Projections Board */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-4 font-semibold uppercase">PREDICTED SYSTEM DELTAS</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 font-mono text-xs text-slate-400">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>Congestion index</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{baseline.traffic.congestion_index}%</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-white font-bold">{results.projected.traffic.congestion_index}%</span>
                        <span className={`font-semibold ${results.deltas.congestion_index > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {results.deltas.congestion_index > 0 ? "+" : ""}{results.deltas.congestion_index}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>Air Quality AQI</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{baseline.aqi.aqi_index}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-white font-bold">{results.projected.aqi.aqi_index}</span>
                        <span className={`font-semibold ${results.deltas.aqi_index > 0 ? "text-red-400" : "text-emerald-400"}`}>
                          {results.deltas.aqi_index > 0 ? "+" : ""}{results.deltas.aqi_index}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>Women Safety</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{baseline.safety.women_safety_score}/100</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-white font-bold">{results.projected.safety.women_safety_score}/100</span>
                        <span className={`font-semibold ${results.deltas.women_safety_score > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {results.deltas.women_safety_score > 0 ? "+" : ""}{results.deltas.women_safety_score}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span>Public Sentiment</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{baseline.citizen.satisfaction_score}/100</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-white font-bold">{results.projected.citizen.satisfaction_score}/100</span>
                        <span className={`font-semibold ${results.deltas.satisfaction_score > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {results.deltas.satisfaction_score > 0 ? "+" : ""}{results.deltas.satisfaction_score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Universal Neural Analysis */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-cyan-500/25 tracking-wider select-none">
                  NEURAL_UNIVERSAL_SENSORS (PHASE 2)
                </div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-white font-display font-semibold text-sm">Dynamic AI Universal Policy Insights</h4>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                      <span className="text-slate-500 text-[10px] font-mono block">AI CITIZEN IMPACT FORECAST</span>
                      <p className="text-slate-300 text-xs font-mono mt-1 leading-relaxed">{results.ai_analysis.citizen_impact_forecast}</p>
                    </div>
                    <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                      <span className="text-slate-500 text-[10px] font-mono block">AI BUDGET LEVER IMPACT FORECAST</span>
                      <p className="text-slate-300 text-xs font-mono mt-1 leading-relaxed">{results.ai_analysis.budget_impact_forecast}</p>
                    </div>
                  </div>
                  <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                    <span className="text-slate-500 text-[10px] font-mono block">AI RATIONALE EXPLAINABILITY (PHASE 9)</span>
                    <p className="text-slate-300 text-xs font-mono mt-1 leading-relaxed">{results.ai_analysis.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* Neural Agent Committee Consensus (Phase 3: Collaboration) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-4 font-semibold uppercase">AI AGENTS ADVISORY CONSENSUS PROTOCOL</span>
                <div className="space-y-3">
                  {Object.entries(results.agents).map(([key, value]: [string, any]) => {
                    const statusColors = value.status === "healthy" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : value.status === "warning" ? "border-amber-500/30 bg-amber-500/5 text-amber-400" : "border-red-500/30 bg-red-500/5 text-red-400";
                    return (
                      <div key={key} className={`border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 ${statusColors}`}>
                        <div>
                          <span className="font-display font-bold text-xs uppercase tracking-wider block text-white">{key.replace(/_/g, " ")}</span>
                          <p className="text-[11px] mt-1 font-mono leading-relaxed opacity-90">{value.recommendations[0]}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 md:text-right">
                          <span className="text-[10px] font-mono opacity-60">CONFIDENCE: {value.confidence}%</span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{value.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center backdrop-blur-md">
              <FlaskConical className="w-12 h-12 text-slate-800 mb-3 animate-bounce" />
              <p className="text-white font-display font-semibold text-base">Lab Sandbox Silent</p>
              <p className="text-slate-500 text-xs mt-1 max-w-sm">Adjust decentralised lever values on the sidebar, select a profile or connect to our simulation nodes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
