import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, LayoutDashboard, FlaskConical, Map, Shield, 
  ShieldCheck, Search, Bell, HelpCircle, ChevronRight, 
  Settings, CheckCircle2, Clock, Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { CityBaseline, SavedScenario, Proposal, Notification } from "./types";
import { NOTIFICATIONS_MOCKS } from "./data";

// Subcomponents
import { ExecutiveDashboard } from "./components/ExecutiveDashboard";
import { ScenarioLab } from "./components/ScenarioLab";
import { DigitalTwin } from "./components/DigitalTwin";
import { WomenSafety } from "./components/WomenSafety";
import { ProposalAnalyzer } from "./components/ProposalAnalyzer";
import { AICopilot } from "./components/AICopilot";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("executiveos");
  const [selectedCityNode, setSelectedCityNode] = useState<string>("delhi");
  const [cityName, setCityName] = useState("Delhi");

  // Telemetry Metrics states
  const [baselineMetrics, setBaselineMetrics] = useState<CityBaseline | null>(null);
  const [activeScore, setActiveScore] = useState<number>(58);
  const [activeAIAnalysis, setActiveAIAnalysis] = useState<any | null>(null);

  // Command palette & Search parameters
  const [commandOpen, setCommandOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");

  // Product onboarding tour
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  // Real-time ticking Clock
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live Notification Hub stack
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_MOCKS);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  // Saved scenarios from DB
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  // Update clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("en-US", { hour12: false }));
    };
    updateTime();
    const ticker = setInterval(updateTime, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Sync city name
  useEffect(() => {
    setCityName(selectedCityNode === "chandigarh" ? "Chandigarh" : "Delhi");
  }, [selectedCityNode]);

  // Command Palette Ctrl+K keybinder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch baseline and seed scenario simulator on startup and city swaps!
  const fetchBaselineAndSeed = async () => {
    try {
      // Get baseline metrics first
      const baselineRes = await fetch(`/api/cities/${selectedCityNode}/baselines`);
      const baselineData = await baselineRes.json();
      setBaselineMetrics(baselineData.baseline);

      // Trigger initial simulator run with zero parameters to generate AI Summary immediately!
      const simRes = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_id: selectedCityNode,
          parameters: {
            road_closures_delta: 0,
            aqi_delta: 0,
            cctv_delta: 0,
            police_units_delta: 0,
            budget_delta: 0,
            complaints_delta: 0,
            green_cover_delta: 0
          }
        })
      });
      const simData = await simRes.json();
      setActiveScore(simData.overall_score);
      setActiveAIAnalysis(simData.ai_analysis);
    } catch (e) {
      console.error("Startup synchronization failed, writing fallback mocks immediately:", e);
    }
  };

  // Saved Scenarios fetch
  const fetchSavedScenarios = async () => {
    try {
      const res = await fetch("/api/scenarios");
      const data = await res.json();
      setSavedScenarios(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBaselineAndSeed();
    fetchSavedScenarios();
  }, [selectedCityNode]);

  // Save scenario action wrapper
  const handleSaveScenario = async (name: string, desc: string, params: Record<string, number>) => {
    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cityId: selectedCityNode,
          description: desc,
          parameters: params
        })
      });
      const data = await res.json();
      fetchSavedScenarios(); // reload list
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  // Run simulation action wrapper
  const handleRunSimulation = async (params: Record<string, number>) => {
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city_id: selectedCityNode,
        parameters: params
      })
    });
    const data = await res.json();
    // Update dashboard metrics state to current run values!
    setActiveScore(data.overall_score);
    setActiveAIAnalysis(data.ai_analysis);
    return data;
  };

  // Delete scenario action wrapper
  const handleDeleteScenario = async (id: string) => {
    try {
      const res = await fetch(`/api/scenarios/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      fetchSavedScenarios();
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  // Add customized real-time notifications to stack
  const handleAddNotification = (message: string, level: "critical" | "warning" | "healthy" | "info") => {
    const freshAlert: Notification = {
      id: `${Date.now()}`,
      message,
      level,
      time: "Just now"
    };
    setNotifications(prev => [freshAlert, ...prev]);
  };

  // Analyze proposal action wrapper
  const handleAnalyzeProposal = async (title: string, text: string) => {
    const res = await fetch("/api/proposal/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        text,
        cityId: selectedCityNode
      })
    });
    const data = await res.json();
    return data;
  };

  // Guided Product Tour Steps Definition
  const tourSteps = [
    {
      title: "Welcome to UrbanFlow OS",
      text: "This is Google AI Studio's Smart City Operating System. It is constructed to make city command 95% AI-driven.",
      elementId: "brand-logo"
    },
    {
      title: "Executive Command Center",
      text: "The main surveillance panel. Instead of raw charts, the AI Executive Summary parses risk indices automatically.",
      elementId: "executive-command-center"
    },
    {
      title: "Simulation Scenario Sandbox",
      text: "Test strategic policy levers (like BRT transit levels, camera density etc.) to see real-time forecast overlays.",
      elementId: "nav-scenariolab"
    },
    {
      title: "Global Command Palette",
      text: "Activate shortcuts instantly by pressing Ctrl+K to jump between sectors or trigger notifications.",
      elementId: "search-bar-tour"
    }
  ];

  const handleNextTourStep = () => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex(tourIndex + 1);
    } else {
      setTourActive(false);
      setTourIndex(0);
    }
  };

  const handleCommandPaletteJump = (tab: string) => {
    setActiveTab(tab);
    setCommandOpen(false);
    setCmdSearch("");
  };

  const criticalNotificationsCount = notifications.filter(n => n.level === "critical").length;

  return (
    <div className="flex h-screen bg-[#020408] bg-[radial-gradient(circle_at_50%_50%,#0a0f1a_0%,#020408_100%)] overflow-hidden select-none font-sans text-slate-100">
      
      {/* 1. Global Product Tour overlay popup */}
      {tourActive && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111a2f] border border-blue-500/30 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative">
            <span className="text-[10px] font-mono text-blue-500 block">ONBOARDING PROTOCOL ({tourIndex + 1}/{tourSteps.length})</span>
            <h3 className="text-white font-display font-bold text-lg leading-tight">{tourSteps[tourIndex].title}</h3>
            <p className="text-gray-400 text-xs font-mono leading-relaxed leading-medium">{tourSteps[tourIndex].text}</p>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setTourActive(false)}
                className="text-gray-500 hover:text-white text-xs font-mono"
              >
                SKIP TOUR
              </button>
              <button
                onClick={handleNextTourStep}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-display font-semibold text-xs rounded-lg transition-all"
              >
                {tourIndex === tourSteps.length - 1 ? "FINISH TOUR" : "NEXT STEP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Command Palette (Ctrl+K) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 bg-black/65 z-50 flex items-start justify-center p-4 md:p-24 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-brand-card border border-brand-border rounded-xl max-w-lg w-full overflow-hidden shadow-2xl mt-12"
            >
              <div className="p-3 border-b border-brand-border flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Type an actions loop command (e.g., 'safety', 'sim', 'chandigarh')..."
                  value={cmdSearch}
                  onChange={e => setCmdSearch(e.target.value)}
                  className="w-full bg-transparent outline-none text-white font-mono text-sm placeholder-gray-600"
                  autoFocus
                />
                <button onClick={() => setCommandOpen(false)} className="text-[10px] font-mono text-gray-500 hover:text-white uppercase">
                  ESC
                </button>
              </div>

              <div className="p-3.5 space-y-2 max-h-64 overflow-y-auto bg-brand-dark/25">
                <span className="text-[9px] font-mono text-gray-500 block uppercase tracking-wider mb-2">OS NAVIGATIONS LOOP</span>
                
                <div
                  onClick={() => handleCommandPaletteJump("executiveos")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    <span>surveillance.exec_dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>

                <div
                  onClick={() => handleCommandPaletteJump("scenariolab")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group"
                >
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    <span>simulation.scenario_laboratory</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>

                <div
                  onClick={() => handleCommandPaletteJump("digitaltwin")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group"
                >
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    <span>digital_twin.spatial_monitoring</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>

                <div
                  onClick={() => handleCommandPaletteJump("safety")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    <span>women_safety.intelligence_center</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>

                <div
                  onClick={() => handleCommandPaletteJump("proposals")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-500 group-hover:text-white" />
                    <span>proposal.impact_analyzer</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </div>

                <span className="text-[9px] font-mono text-gray-500 block uppercase tracking-wider mt-4 mb-2">QUICK CONTROLLER COMMITS</span>
                
                <div
                  onClick={() => {
                    setSelectedCityNode(selectedCityNode === "delhi" ? "chandigarh" : "delhi");
                    setCommandOpen(false);
                  }}
                  className="p-2.5 rounded-lg hover:bg-brand-dark cursor-pointer font-mono text-xs text-gray-300 group flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-gray-500 group-hover:text-white animate-pulse" />
                  <span>core.server_swap_city_node ({selectedCityNode === "delhi" ? "Chandigarh" : "Delhi"})</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Static Sidebar Navigation */}
      <aside className="w-64 bg-[#0a0d14]/75 border-r border-white/10 flex flex-col justify-between shrink-0 hidden md:flex backdrop-blur-md">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3 relative overflow-hidden" id="brand-logo">
            <div className="w-8 h-8 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0">
              <div className="w-4 h-4 bg-[#0a0d14] rotate-45 flex items-center justify-center">
                <Bot className="-rotate-45 w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-display font-bold tracking-tighter text-[15px] leading-tight uppercase">UrbanFlow <span className="text-[10px] font-mono text-slate-500 ml-1">v1.0</span></h1>
              <p className="text-[9px] text-slate-500 uppercase font-medium tracking-[0.2em] leading-none mt-0.5">Smart City OS</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab("executiveos")}
              className={`w-full p-2.5 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "executiveos" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]" : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Surveillance Command</span>
            </button>

            <button
              id="nav-scenariolab"
              onClick={() => setActiveTab("scenariolab")}
              className={`w-full p-2.5 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "scenariolab" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]" : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FlaskConical className="w-4 h-4 shrink-0" />
              <span>Simulation Laboratory</span>
            </button>

            <button
              onClick={() => setActiveTab("digitaltwin")}
              className={`w-full p-2.5 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "digitaltwin" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]" : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Map className="w-4 h-4 shrink-0" />
              <span>Digital Twin Grid</span>
            </button>

            <button
              onClick={() => setActiveTab("safety")}
              className={`w-full p-2.5 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "safety" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]" : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Safety Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab("proposals")}
              className={`w-full p-2.5 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "proposals" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]" : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Proposal Evaluation</span>
            </button>
          </nav>
        </div>

        {/* Info footer metadata details */}
        <div className="p-4 border-t border-brand-border space-y-3 font-mono text-[9px] text-[#2c3f70]">
          <div>
            <span className="block font-bold">OS CORE LEVEL STATUS</span>
            <span className="block mt-0.5">VITE_PROD_DEPLOYED: TRUE</span>
            <span className="block">INTEGRATION_PLATFORM: AI_STUDIO</span>
          </div>

          <button
            onClick={() => setTourActive(true)}
            className="w-full py-2 bg-brand-dark/40 hover:bg-brand-border border border-brand-border hover:border-blue-500/20 text-gray-500 hover:text-blue-400 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            GUIDED SYSTEM TOUR
          </button>
        </div>
      </aside>

      {/* Main viewport frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top SURVEILLANCE Header Bar */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-[#0a0d14]/90 backdrop-blur-md relative z-35 shadow-2xl">
          <div className="flex items-center gap-4">
            {/* Search command bar trigger */}
            <div
              id="search-bar-tour"
              onClick={() => setCommandOpen(true)}
              className="bg-brand-dark border border-brand-border hover:border-cyan-500/40 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer select-none transition-all hidden md:flex"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Search command blocks...</span>
              <kbd className="px-1.5 py-0.5 bg-brand-card border border-brand-border rounded text-[9px] font-bold text-gray-500">Ctrl+K</kbd>
            </div>

            {/* Live Clock Surveillance */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 hidden xl:flex">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>SURVEILLANCE CLOCK: {currentTime}</span>
            </div>
          </div>

          {/* Right utility stack */}
          <div className="flex items-center gap-4">
            {/* City Health score preview */}
            <div className="flex flex-col items-end hidden lg:flex border-r border-white/10 pr-4 mr-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">City Health Index</span>
              <div className="flex items-center gap-2">
                <div className="h-1 w-20 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_#10b981]" style={{ width: `${activeScore}%` }}></div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">{activeScore}.4</span>
              </div>
            </div>

            {/* City Selection Node Swapper */}
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setSelectedCityNode("delhi")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                  selectedCityNode === "delhi" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-gray-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                Delhi Node
              </button>
              <button
                onClick={() => setSelectedCityNode("chandigarh")}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                  selectedCityNode === "chandigarh" ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-gray-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                Chandigarh Node
              </button>
            </div>

            {/* Notification Alert Toggler Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                className="p-2.5 bg-brand-dark/40 border border-brand-border rounded-lg text-gray-400 hover:text-blue-400 relative transition-all"
              >
                <Bell className="w-4 h-4 shrink-0" />
                {criticalNotificationsCount > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute top-1 right-1" />
                )}
              </button>

              {/* Notification Popup Dropdown Menu list */}
              {showNotificationsMenu && (
                <div className="absolute right-0 mt-2.5 w-80 bg-brand-card border border-brand-border rounded-xl shadow-2xl p-3.5 z-50 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-brand-border pb-2.5 mb-2.5 font-mono text-[10px] text-gray-500">
                    <span className="font-bold">CRITICAL ALERTS FEED ({notifications.length})</span>
                    <button onClick={() => setNotifications([])} className="hover:text-white uppercase text-[8px]">CLEAR ALL</button>
                  </div>
                  <div className="space-y-2.5 max-h-54 overflow-y-auto">
                    {notifications.map(n => {
                      const levelBorder = n.level === "critical" ? "border-red-500/20 bg-red-500/5 text-red-300" : "border-brand-border bg-brand-dark/30 text-gray-400";
                      return (
                        <div key={n.id} className={`p-2 border rounded-lg text-[10px] font-mono leading-relaxed leading-medium ${levelBorder}`}>
                          <div className="flex justify-between items-center mb-1 text-[8px] opacity-60">
                            <span>LEVEL: {n.level.toUpperCase()}</span>
                            <span>{n.time}</span>
                          </div>
                          {n.message}
                        </div>
                      );
                    })}

                    {notifications.length === 0 && (
                      <p className="text-[10px] text-gray-600 text-center py-4 font-mono">No active incident signals detected in surveillance stack.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport contents container */}
        <main className="flex-1 p-6 overflow-y-auto relative z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedCityNode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "executiveos" && baselineMetrics && activeAIAnalysis && (
                <ExecutiveDashboard
                  cityId={selectedCityNode}
                  cityName={cityName}
                  metrics={baselineMetrics}
                  overallScore={activeScore}
                  aiAnalysis={activeAIAnalysis}
                  onNavigate={(tab) => {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onTriggerSOS={() => {
                    setActiveTab("safety");
                    handleAddNotification("🚨 [CRITICAL_HELP] Emergency SOS beacon has been logged in Rohini Sector 5! Dispatchers mobilized.", "critical");
                  }}
                />
              )}

              {activeTab === "scenariolab" && (
                <ScenarioLab
                  cityId={selectedCityNode}
                  baseline={baselineMetrics}
                  savedScenarios={savedScenarios}
                  onSaveScenario={handleSaveScenario}
                  onRunSimulation={handleRunSimulation}
                  onDeleteScenario={handleDeleteScenario}
                />
              )}

              {activeTab === "digitaltwin" && (
                <DigitalTwin
                  cityId={selectedCityNode}
                  cityName={cityName}
                />
              )}

              {activeTab === "safety" && (
                <WomenSafety
                  cityId={selectedCityNode}
                  onAddNotification={handleAddNotification}
                />
              )}

              {activeTab === "proposals" && (
                <ProposalAnalyzer
                  cityId={selectedCityNode}
                  onAnalyzeProposal={handleAnalyzeProposal}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Resizable sticky AI Copilot */}
        <AICopilot
          cityId={selectedCityNode}
          cityName={cityName}
          metrics={baselineMetrics}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
