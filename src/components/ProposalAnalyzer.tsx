import React, { useState } from "react";
import { ShieldCheck, FileText, Upload, Sparkles, AlertCircle, Info, Calendar, ArrowRight, CheckSquare } from "lucide-react";
import { PRELOADED_PROPOSALS } from "../data";
import { Proposal } from "../types";

interface ProposalAnalyzerProps {
  cityId: string;
  onAnalyzeProposal: (title: string, text: string) => Promise<Proposal>;
}

export const ProposalAnalyzer: React.FC<ProposalAnalyzerProps> = ({ cityId, onAnalyzeProposal }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);

  // File Upload states
  const [customTitle, setCustomTitle] = useState("");
  const [customText, setCustomText] = useState("");
  const [showDraft, setShowDraft] = useState(false);

  const runEvaluation = async (title: string, text: string) => {
    setAnalyzing(true);
    setActiveProposal(null);
    try {
      const res = await onAnalyzeProposal(title, text);
      setActiveProposal(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const text = await file.text();
    const cleanTitle = file.name.replace(/\.[^/.]+$/, ""); // strip extension
    setCustomTitle(cleanTitle);
    setCustomText(text);
    setShowDraft(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
    setCustomTitle(cleanTitle);
    setCustomText(text);
    setShowDraft(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-cyan-400" />
        <div>
          <h2 className="text-white font-display font-bold text-xl">AI Project Development Impact Analyzer</h2>
          <p className="text-slate-400 text-sm">Analyze structural proposal files to generate simulated municipal cross-domain evaluations (Phase 6).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* upload & Presets side */}
        <div className="xl:col-span-4 space-y-6">
          {/* Presets List */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-3 font-semibold uppercase">PRE-LOADED PROPOSAL EXAMPLES</span>
            <div className="space-y-2.5">
              {PRELOADED_PROPOSALS.map(p => (
                <div
                  key={p.id}
                  onClick={() => runEvaluation(p.title, p.text)}
                  className="bg-[#05080f]/40 hover:bg-[#05080f]/70 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl cursor-pointer transition-all group"
                >
                  <h4 className="text-white font-display text-xs font-semibold group-hover:text-cyan-400 transition-colors">{p.title}</h4>
                  <p className="text-slate-500 text-[10px] font-mono mt-1 leading-relaxed truncate">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Upload drag and drop */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-3 font-semibold uppercase">SUBMIT CUSTOM PHYSICAL DOSSIERS</span>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-white/15 rounded-xl p-6 text-center hover:bg-white/5 transition-all flex flex-col items-center justify-center cursor-pointer relative"
            >
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
              <p className="text-slate-300 font-display font-semibold text-xs">Drag and drop file proposals</p>
              <p className="text-slate-500 text-[9px] font-mono mt-1 uppercase">Supports TXT, MD, JSON docs</p>
            </div>

            {/* Draft dialog popup */}
            {showDraft && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <input
                  type="text"
                  placeholder="Entered proposal title"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full bg-[#05080f]/45 border border-white/10 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-650 outline-none"
                />
                <textarea
                  placeholder="Provide proposal body text..."
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  className="w-full bg-[#05080f]/45 border border-white/10 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-650 outline-none h-24 resize-none"
                />
                <button
                  onClick={() => {
                    runEvaluation(customTitle, customText);
                    setShowDraft(false);
                  }}
                  className="w-full py-2.5 bg-cyan-600/30 hover:bg-cyan-500/40 border border-cyan-500/50 text-cyan-300 font-display font-bold text-xs tracking-wider rounded-xl transition-all"
                >
                  LAUNCH CUSTOM EVALUATION
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Committee report side */}
        <div className="xl:col-span-8">
          {analyzing ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-24 text-center flex flex-col items-center justify-center backdrop-blur-md">
              <Sparkles className="w-12 h-12 text-cyan-400 mb-3 animate-spin" />
              <p className="text-white font-display font-semibold text-base">Municipal AI Planning Panel Activated</p>
              <p className="text-slate-400 text-xs mt-1 max-w-sm">Generating comprehensive multidepartment consensus forecasts and ROI scoring metrics...</p>
            </div>
          ) : activeProposal ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 animate-fadeIn backdrop-blur-md">
              {/* Verdict header banner */}
              <div className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                activeProposal.analysis.decision === "APPROVED" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" :
                activeProposal.analysis.decision === "APPROVED_WITH_CONDITIONS" ? "border-amber-500/30 bg-amber-500/5 text-amber-400" :
                "border-red-500/30 bg-red-500/5 text-red-400"
              }`}>
                <div>
                  <span className="text-[10px] font-mono block uppercase">COMMITTEE DECREE VERDICT</span>
                  <span className="font-display font-extrabold text-lg uppercase tracking-wider">{activeProposal.analysis.decision.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>CONFIDENCE: {activeProposal.analysis.confidence}%</span>
                  <span>FEASIBILITY: {activeProposal.analysis.feasibility_score}%</span>
                  <span>ROI: {activeProposal.analysis.roi_rating}</span>
                </div>
              </div>

              {/* Strategic overview */}
              <div>
                <span className="text-slate-500 text-[9px] font-mono tracking-wider block uppercase">EXECUTIVE OUTLINE SUMMARY</span>
                <p className="text-slate-300 text-xs font-mono leading-relaxed mt-1">{activeProposal.analysis.summary}</p>
              </div>

              {/* Departmental impacts list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono text-xs text-slate-400">
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] block">AIR QUALITY INDEX (AQI) IMPACT</span>
                  <p className="text-slate-300 mt-1 leading-relaxed leading-medium">{activeProposal.analysis.aqi_impact}</p>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] block">TRAFFIC FLOW & BRT DYNAMICS</span>
                  <p className="text-slate-300 mt-1 leading-relaxed leading-medium">{activeProposal.analysis.traffic_impact}</p>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] block">STREET PATRIOT SAFETY CHANNELS</span>
                  <p className="text-slate-300 mt-1 leading-relaxed leading-medium">{activeProposal.analysis.safety_impact}</p>
                </div>
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3">
                  <span className="text-slate-500 text-[9px] block">FINANCIAL OUTLAY SUSTAINABILITY</span>
                  <p className="text-slate-300 mt-1 leading-relaxed leading-medium">{activeProposal.analysis.budget_impact}</p>
                </div>
              </div>

              {/* Conditions / Rejections List */}
              <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2">
                  <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-white">MANDATED PROJECT PROVISOS</span>
                </div>
                <div className="space-y-2">
                  {activeProposal.analysis.conditions.map((cond, listId) => (
                    <div key={listId} className="flex gap-2.5 items-start font-mono text-xs text-slate-400 leading-relaxed leading-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 mt-1.5 shrink-0" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer trace codes */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 bg-[#05080f]/40 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ISSUED TIMESTAMP: {new Date(activeProposal.analyzedAt).toUTCString()}</span>
                </div>
                <span className="text-emerald-400 font-bold">COMMITTEE LOCK: TRUE</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center backdrop-blur-md">
              <FileText className="w-12 h-12 text-slate-700 mb-3 animate-bounce" />
              <p className="text-white font-display font-semibold text-base">Analyzer Registry Empty</p>
              <p className="text-slate-500 text-xs mt-1 max-w-sm">Choose one of the presets on the side or upload a local dossier to deploy AI committee review algorithms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
