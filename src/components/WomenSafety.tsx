import React, { useState, useEffect, useRef } from "react";
import { Shield, Camera, Users, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronRight, Video, Wifi, Target } from "lucide-react";
import { NOTIFICATIONS_MOCKS } from "../data";

interface WomenSafetyProps {
  cityId: string;
  onAddNotification: (msg: string, level: "critical" | "warning" | "healthy" | "info") => void;
}

export const WomenSafety: React.FC<WomenSafetyProps> = ({ cityId, onAddNotification }) => {
  // SOS Simulator variables
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [dispatchProgress, setDispatchProgress] = useState(0);

  // Camera Gesture AI variables
  const [cameraActive, setCameraActive] = useState(false);
  const [syntheticScanning, setSyntheticScanning] = useState(false);
  const [recognizedGesture, setRecognizedGesture] = useState<string>("CALIBRATING_SIGHT...");
  const [jointOffsets, setJointOffsets] = useState<{ x: number; y: number }[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Hotspots info
  const hotspots = [
    { ward: "Rohini Sector 5 (North)", danger: "Critical", incidents: "15/mo", cctv: "32% (Critical Blackout)" },
    { ward: "Shahdara Industrial Corridor", danger: "High Risk", incidents: "12/mo", cctv: "45% (Deficient)" },
    { ward: "Chandni Chowk Market Lane", danger: "Medium Risk", incidents: "8/mo", cctv: "54% (Sub-optimal)" },
    { ward: "Connaught Place Subway Links", danger: "Low Risk", incidents: "2/mo", cctv: "88% (Adequate)" }
  ];

  // SOS Countdown Timer
  useEffect(() => {
    let timer: any;
    if (sosActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setDispatchLogs(logs => ["🏁 [DISPATCH] Patrol Unit arrived at incident coordinates. Safe containment zone active.", ...logs]);
            clearInterval(timer);
            return 0;
          }
          // Progress ratio
          setDispatchProgress(parseFloat(((120 - (prev - 1)) / 120 * 100).toFixed(1)));
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sosActive, countdown]);

  // Simulated Dispatch logs updater
  useEffect(() => {
    let interval: any;
    if (sosActive) {
      const milestones = [
        "🛸 [SENTINEL DU-9] Launching autonomous safety drone from Digital Twin Hub A.",
        "🛰️ [GEO-LOC] High-accuracy coordinates localized: Ward 3 Grid Section B.",
        "🚓 [DISPATCH] Squad Cruiser Unit 14 mobilized with emergency siren clearance.",
        "⚡ [NETWORK] CCTV cameras focused on target perimeter stream. Signal healthy.",
        "📞 [SOS] Dispatcher voice-contact connected with node. User trace stable."
      ];
      let pointer = 0;
      interval = setInterval(() => {
        if (pointer < milestones.length) {
          setDispatchLogs(prev => [milestones[pointer], ...prev]);
          pointer++;
        } else {
          clearInterval(interval);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [sosActive]);

  const triggerSOS = () => {
    setSosActive(true);
    setCountdown(120);
    setDispatchProgress(0);
    const logs = [
      "🚨 [EMERGENCY_SOS] SOS signal dispatched to Central safety grid nodes.",
      "📡 [TELEMETRY] Broadcast beacon active at 433MHz. Pinging municipal responders."
    ];
    setDispatchLogs(logs);
    onAddNotification("🚨 [CRITICAL_HELP] Emergency SOS beacon has been logged in Rohini Sector 5! Dispatchers mobilized.", "critical");
  };

  const stopSOS = () => {
    setSosActive(false);
    setCountdown(120);
    setDispatchProgress(0);
    setDispatchLogs([]);
  };

  // Simulated Computer Vision Skeleton animation
  useEffect(() => {
    let frameId: any;
    const updateSkeleton = () => {
      // Simulate random waving coordinate vectors
      const time = Date.now() * 0.005;
      const waveY = Math.sin(time) * 12;
      const waveX = Math.cos(time) * 8;
      
      const parts = [
        { x: 100, y: 70 }, // Head
        { x: 100, y: 110 }, // Spine
        { x: 130 + waveX, y: 80 + waveY }, // Left hand (Waving)
        { x: 70 - waveX, y: 80 - waveY }, // Right hand (Waving)
        { x: 120, y: 160 }, // Left foot
        { x: 80, y: 160 } // Right foot
      ];
      setJointOffsets(parts);
      
      // Toggle recognized labels based on wave frequency
      const speed = Math.abs(waveY);
      if (speed > 8) {
        setRecognizedGesture("⚠️ EMG_EVENT: GESTURE DUAL_HANDS WAVE_SOS DETECTED (CONFIDENCE 96.8%)");
      } else {
        setRecognizedGesture("🔍 SCANNING: CALIBRATED (NO EMG_EVENTS REGISTERED)");
      }
      
      frameId = requestAnimationFrame(updateSkeleton);
    };

    if (syntheticScanning) {
      frameId = requestAnimationFrame(updateSkeleton);
    }
    return () => cancelAnimationFrame(frameId);
  }, [syntheticScanning]);

  // Handle Real Webcam access safely
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      setSyntheticScanning(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setSyntheticScanning(true);
      } catch (err) {
        console.warn("Camera hardware unavailable or denied. Fallback to AI Synthetic Sight Model.", err);
        // Fallback to synthetic wireframe scanner
        setSyntheticScanning(true);
      }
    }
  };

  // Cleanup stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-cyan-400" />
        <div>
          <h2 className="text-white font-display font-bold text-xl">Women Safety Intelligence Center</h2>
          <p className="text-slate-400 text-sm">Empowering street monitoring through computer-vision gesture sensors (Phase 5) and tactical emergency networks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Hotspots & SOS Dispatch Grid */}
        <div className="xl:col-span-7 space-y-6">
          {/* Safety Hotspot Matrix */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <span className="text-slate-500 text-[10px] font-mono tracking-wider block mb-4 font-semibold uppercase">LOCALIZED SURVEILLANCE TARGET WARDS</span>
            
            <div className="space-y-3">
              {hotspots.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/10 last:border-0 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-white font-medium">{h.ward}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-[11px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded uppercase">{h.danger}</span>
                    <span className="text-slate-550 hidden md:inline">{h.incidents} incidents</span>
                    <span className="text-slate-500">{h.cctv}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOS Dispatch Simulator Board */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-[#2c3f70] tracking-wider select-none">
              TAC_DISPATCH_OS_V2
            </div>
            
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="text-white font-display font-semibold text-sm">Emergency Dispatch Tracker</h3>
            </div>

            {sosActive ? (
              <div className="space-y-5">
                {/* Visual Telemetry Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[9px] font-mono uppercase">DISPATCH TELEMETRY PROGRESS</span>
                    <span className="text-cyan-400 font-mono text-2xl font-bold tracking-tight mt-1">{dispatchProgress}%</span>
                  </div>

                  <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-[9px] font-mono uppercase">EST_DISPATCH_ARRIVAL</span>
                    <span className="text-red-400 font-mono text-2xl font-bold tracking-tight mt-1 animate-pulse">{formatTime(countdown)}</span>
                  </div>

                  <button
                    onClick={stopSOS}
                    className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-xs font-mono font-bold transition-all uppercase"
                  >
                    DISMISS SIGNAL
                  </button>
                </div>

                {/* Tracking bar */}
                <div className="w-full h-1.5 bg-[#05080f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${dispatchProgress}%`, transition: "width 1s linear" }}
                  />
                </div>

                {/* Dispatch logs */}
                <div className="bg-[#05080f]/40 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-slate-500 space-y-1.5 h-32 overflow-y-auto">
                  {dispatchLogs.map((log, listIdx) => (
                    <div key={listIdx} className="flex gap-1.5 first:text-red-400 first:font-semibold">
                      <span>{`>`}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Target className="w-12 h-12 text-slate-800 mb-3" />
                <p className="text-white font-display font-medium text-sm">Dispatched loop idle. Safe perimeters hold.</p>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mb-6">Planners can simulate an instant distress trigger to check drone routing and dispatch timers.</p>
                <button
                  onClick={triggerSOS}
                  className="px-6 py-2.5 bg-red-650/90 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-white font-display font-bold text-xs tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  INITIATE SIMULATED RESCUE DISPATCH
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gesture AI Vision Scanner */}
        <div className="xl:col-span-5 col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-display font-semibold text-sm">Emergency Gesture Sensory Loop</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">NEURAL_VISION_CV11</span>
            </div>

            {/* Simulated Live Frame Viewer */}
            <div className="bg-[#05080f]/40 border border-white/5 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] shadow-inner">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono">
                <Wifi className="w-3 h-3 text-red-500 animate-ping" />
                <span className="text-slate-400 uppercase">STREAM REC: ONLINE</span>
              </div>

              {/* Genuine Video Stream Frame OR Skeleton fall-back wireframe */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 bg-[#05080f] object-cover absolute inset-0"
                />
              ) : null}

              {/* Overlapping animated joint wireframe coords */}
              {syntheticScanning && (
                <svg className="w-48 h-48 relative z-20" viewBox="0 0 200 200">
                  {jointOffsets.length > 0 && (
                    <>
                      {/* Lines */}
                      <line x1={jointOffsets[0].x} y1={jointOffsets[0].y} x2={jointOffsets[1].x} y2={jointOffsets[1].y} stroke="#22d3ee" strokeWidth={2} />
                      <line x1={jointOffsets[1].x} y1={jointOffsets[1].y} x2={jointOffsets[2].x} y2={jointOffsets[2].y} stroke="#22d3ee" strokeWidth={2} />
                      <line x1={jointOffsets[1].x} y1={jointOffsets[1].y} x2={jointOffsets[3].x} y2={jointOffsets[3].y} stroke="#22d3ee" strokeWidth={2} strokeDasharray="3 3" />
                      
                      {/* Nodes */}
                      {jointOffsets.map((pt, index) => (
                        <circle
                          key={index}
                          cx={pt.x}
                          cy={pt.y}
                          r={index === 0 ? "8" : "5"}
                          fill={index < 2 ? "#22d3ee" : "#f59e0b"}
                          className="animate-pulse"
                        />
                      ))}
                    </>
                  )}
                </svg>
              )}

              {!cameraActive && !syntheticScanning && (
                <div className="text-center relative z-10 p-6 flex flex-col items-center">
                  <Camera className="w-10 h-10 text-slate-800 animate-pulse mb-3" />
                  <p className="text-slate-500 text-xs font-mono">Sensory scanner inactive. Click feed to calibration.</p>
                </div>
              )}
            </div>

            {/* Diagnostics recognized feed info */}
            <div className="mt-4 p-3 bg-[#05080f]/40 border border-white/5 rounded-xl text-xs font-mono flex items-center justify-between">
              <span className="text-slate-500">GESTURE_STATE:</span>
              <span className={`font-semibold ${recognizedGesture.includes("WAVE_SOS") ? "text-red-400 animate-pulse font-bold" : "text-slate-300"}`}>
                {recognizedGesture}
              </span>
            </div>

            <button
              onClick={toggleCamera}
              className="mt-4 w-full py-2.5 bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-display font-bold text-xs tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md uppercase"
            >
              <Camera className="w-4 h-4 shrink-0" />
              {cameraActive || syntheticScanning ? "TERMINATE CV STREAM" : "CALIBRATE GESTURE FEED"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
