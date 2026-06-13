import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, ChevronDown, HelpCircle } from "lucide-react";
import { CityBaseline } from "../types";

interface AICopilotProps {
  cityId: string;
  cityName: string;
  metrics: CityBaseline | null;
  activeTab: string;
}

export const AICopilot: React.FC<AICopilotProps> = ({ cityId, cityName, metrics, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: "model",
      content: `Greetings Planner. I am the **UrbanFlow Global Co-pilot**.\n\nI have continuous telemetry sync with your active panel (**${activeTab.toUpperCase()}**) and current focus node (**${cityName}**).\n\nHow may I help you configure policies, trace risk delta vectors, or optimize citizen satisfaction grids today?`
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on fresh messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Handle suggested presets
  const handleSuggestedPrompt = (prompt: string) => {
    setInputVal(prompt);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || generating) return;

    const userMsg = { role: "user", content: inputVal };
    setInputVal("");
    setMessages(prev => [...prev, userMsg]);
    setGenerating(true);

    try {
      const res = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentCity: cityName,
          currentMetrics: metrics,
          activePage: activeTab
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "model", content: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "model", content: "⚠️ System connection interrupted. Connecting to fallback in-memory models... Try verifying your GEMINI_API_KEY settings." }]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono text-xs">
      {/* Closed floating toggle marker */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-display font-medium shadow-xl shadow-cyan-500/10 cursor-pointer animate-bounce hover:scale-105 transition-all rounded-xl"
        >
          <Bot className="w-5 h-5 shrink-0 text-cyan-400" />
          <span>GLOBAL AI COPILOT</span>
        </button>
      )}

      {/* Toggled chat window */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[500px] backdrop-blur-lg">
          {/* Header */}
          <div className="p-3.5 bg-[#05080f]/95 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-white font-display font-bold text-[13px] block">Global Urban Planner Co-pilot</span>
                <span className="text-[9px] text-slate-500 font-mono tracking-wider leading-none uppercase select-none">Sync active: {activeTab}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Presets list */}
          <div className="p-2 border-b border-white/10 bg-[#05080f]/30 flex gap-2 overflow-x-auto">
            <button
              onClick={() => handleSuggestedPrompt("What dynamic levers improve AQI most?")}
              className="px-2.5 py-1 bg-[#05080f]/40 hover:bg-white/5 border border-white/10 text-[9px] text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              How-to AQI?
            </button>
            <button
              onClick={() => handleSuggestedPrompt("Analyze women safety scores")}
              className="px-2.5 py-1 bg-[#05080f]/40 hover:bg-white/5 border border-white/10 text-[9px] text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Analyze safety
            </button>
            <button
              onClick={() => handleSuggestedPrompt("What is CP thermal intensity bottleneck?")}
              className="px-2.5 py-1 bg-[#05080f]/40 hover:bg-white/5 border border-white/10 text-[9px] text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              CP Heat
            </button>
          </div>

          {/* Messages list container */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[290px] bg-[#05080f]/20 flex flex-col">
            {messages.map((m, index) => {
              const isAi = m.role === "model";
              return (
                <div key={index} className={`flex flex-col max-w-[85%] ${isAi ? "self-start" : "self-end"}`}>
                  <span className="text-[8px] text-slate-600 block mb-1 uppercase tracking-widest">{isAi ? "OS_CORE_BOT" : "PLANNER_CMD"}</span>
                  <div className={`p-3 rounded-xl border leading-relaxed text-xs leading-medium whitespace-pre-line ${
                    isAi ? "bg-[#05080f]/60 border-white/10 text-slate-350" : "bg-cyan-600/30 border-cyan-500/50 text-white font-sans"
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {generating && (
              <div className="self-start flex flex-col max-w-[85%]">
                <span className="text-[8px] text-[#2c3f70] block mb-1 uppercase">GENERATING...</span>
                <div className="p-3 rounded-xl border border-white/10 bg-[#05080f]/50 text-slate-500 italic block">
                  Translating model vectors...
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3.5 bg-[#05080f]/95 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about current policies..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-500 rounded-xl p-2 text-white font-mono placeholder-slate-650 outline-none text-xs"
            />
            <button
              type="submit"
              disabled={generating || !inputVal.trim()}
              className="p-2 bg-cyan-600/30 hover:bg-cyan-500/40 border border-cyan-500/50 disabled:opacity-40 text-cyan-400 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 shrink-0" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
