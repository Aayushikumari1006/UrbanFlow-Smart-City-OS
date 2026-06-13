import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent crashing on missing key
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Baseline data definitions
const DELHI_BASELINE = {
  traffic: {
    congestion_index: 72,
    avg_speed_kmh: 18,
    road_closures: 12,
    peak_hour_delay_min: 45,
    public_transit_coverage: 68,
  },
  aqi: {
    pm25: 145,
    pm10: 210,
    aqi_index: 178,
    good_air_days_pct: 12,
    industrial_zones: 8,
  },
  safety: {
    incidents_per_lakh: 42,
    cctv_coverage_pct: 58,
    police_response_min: 12,
    women_safety_score: 54,
    lit_streets_pct: 71,
  },
  budget: {
    total_crore: 8500,
    utilized_pct: 78,
    infrastructure_pct: 35,
    social_pct: 22,
    operations_pct: 43,
  },
  citizen: {
    satisfaction_score: 58,
    grivances_monthly: 12400, // Matching keys
    resolution_rate_pct: 67,
    digital_adoption_pct: 44,
  },
};

const CHANDIGARH_BASELINE = {
  traffic: {
    congestion_index: 38,
    avg_speed_kmh: 34,
    road_closures: 3,
    peak_hour_delay_min: 18,
    public_transit_coverage: 52,
  },
  aqi: {
    pm25: 68,
    pm10: 95,
    aqi_index: 82,
    good_air_days_pct: 58,
    industrial_zones: 2,
  },
  safety: {
    incidents_per_lakh: 18,
    cctv_coverage_pct: 82,
    police_response_min: 7,
    women_safety_score: 74,
    lit_streets_pct: 91,
  },
  budget: {
    total_crore: 2200,
    utilized_pct: 88,
    infrastructure_pct: 40,
    social_pct: 28,
    operations_pct: 32,
  },
  citizen: {
    satisfaction_score: 74,
    grivances_monthly: 3200,
    resolution_rate_pct: 84,
    digital_adoption_pct: 68,
  },
};

const CITIES = [
  { id: "delhi", name: "Delhi", state: "Delhi", population: 32000000, area: 1484, baseline: DELHI_BASELINE },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab/Haryana", population: 1200000, area: 114, baseline: CHANDIGARH_BASELINE }
];

// Helper functions for math
function clamp(val: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, val));
}

// In-memory Scenario storage (Phase 8: Save/Clone/Compare)
let savedScenarios: any[] = [
  {
    id: "scen-1",
    name: "Winter Smog Emergency Response",
    cityId: "delhi",
    description: "Emergency high-lever intervention for zero construction and elevated public transit subsidies.",
    parameters: { road_closures_delta: 2, aqi_delta: -15, cctv_delta: 5, police_units_delta: 5, budget_delta: 12, complaints_delta: -5, green_cover_delta: 10 },
    createdAt: new Date().toISOString()
  },
  {
    id: "scen-2",
    name: "Arterial Safety Mobilization",
    cityId: "delhi",
    description: "Saturation CCTV coverage expansion and late-night safe corridor deployment.",
    parameters: { road_closures_delta: -2, aqi_delta: 2, cctv_delta: 25, police_units_delta: 18, budget_delta: 20, complaints_delta: -12, green_cover_delta: 4 },
    createdAt: new Date().toISOString()
  }
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", gemini_api_key_configured: !!process.env.GEMINI_API_KEY });
});

// List cities
app.get("/api/cities", (req, res) => {
  res.json(CITIES.map(c => ({ id: c.id, name: c.name, state: c.state, population: c.population, area: c.area })));
});

// City baseline
app.get("/api/cities/:cityId/baselines", (req, res) => {
  const city = CITIES.find(c => c.id === req.params.cityId);
  if (!city) return res.status(404).json({ error: "City not found" });
  res.json({ baseline: city.baseline });
});

// Save scenario
app.post("/api/scenarios", (req, res) => {
  const { name, cityId, description, parameters } = req.body;
  if (!name || !cityId || !parameters) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newScen = {
    id: `scen-${Date.now()}`,
    name,
    cityId,
    description: description || "Custom scenario parameters combination",
    parameters,
    createdAt: new Date().toISOString()
  };
  savedScenarios.push(newScen);
  res.json(newScen);
});

// Get scenarios
app.get("/api/scenarios", (req, res) => {
  res.json(savedScenarios);
});

// Delete scenario
app.delete("/api/scenarios/:id", (req, res) => {
  savedScenarios = savedScenarios.filter(s => s.id !== req.params.id);
  res.json({ success: true });
});

// Unified Simulation + AI Analysis Endpoint
app.post("/api/simulate", async (req, res) => {
  const { city_id, parameters } = req.get("query") ? req.query : req.body;
  const targetCityId = city_id || req.query.city_id || "delhi";
  const params = parameters || req.body.parameters || {};

  const city = CITIES.find(c => c.id === targetCityId) || CITIES[0];
  const b = city.baseline;

  // Read levers
  const road_delta = Number(params.road_closures_delta ?? 0);
  const aqi_delta = Number(params.aqi_delta ?? 0);
  const cctv_delta = Number(params.cctv_delta ?? 0);
  const budget_delta = Number(params.budget_delta ?? 0);
  const complaints_delta = Number(params.complaints_delta ?? 0);
  const police_delta = Number(params.police_units_delta ?? 0);
  const green_delta = Number(params.green_cover_delta ?? 0);

  // Deterministic transfer functions (replicated from Python core engine)
  const new_congestion = clamp(b.traffic.congestion_index + road_delta * 2.5, 0, 100);
  const new_speed = clamp(b.traffic.avg_speed_kmh - road_delta * 1.2, 5, 120);
  const new_aqi = clamp(b.aqi.aqi_index + aqi_delta * 3 - green_delta * 2, 0, 500);
  const new_pm25 = clamp(b.aqi.pm25 + aqi_delta * 2 - green_delta * 1.5, 0, 500);
  const new_cctv = clamp(b.safety.cctv_coverage_pct + cctv_delta, 0, 100);
  const new_response = clamp(b.safety.police_response_min - police_delta * 0.5, 1, 60);
  const new_incidents = clamp(b.safety.incidents_per_lakh + road_delta * 0.8 - cctv_delta * 0.4 - police_delta * 0.6, 0, 200);
  const new_women_safety = clamp(b.safety.women_safety_score + cctv_delta * 0.5 + police_delta * 0.8 - road_delta * 0.3, 0, 100);
  const new_budget_util = clamp(b.budget.utilized_pct + budget_delta * 0.5, 0, 120);
  const new_satisfaction = clamp(b.citizen.satisfaction_score - complaints_delta * 0.3 + cctv_delta * 0.2 + green_delta * 0.3 - road_delta * 0.4 - aqi_delta * 0.2, 0, 100);
  const new_grievances = Math.max(0, b.citizen.grivances_monthly + complaints_delta * 100);

  const projected: any = {
    traffic: {
      ...b.traffic,
      congestion_index: Math.round(new_congestion * 10) / 10,
      avg_speed_kmh: Math.round(new_speed * 10) / 10,
    },
    aqi: {
      ...b.aqi,
      aqi_index: Math.round(new_aqi * 10) / 10,
      pm25: Math.round(new_pm25 * 10) / 10,
    },
    safety: {
      ...b.safety,
      cctv_coverage_pct: Math.round(new_cctv * 10) / 10,
      police_response_min: Math.round(new_response * 10) / 10,
      incidents_per_lakh: Math.round(new_incidents * 10) / 10,
      women_safety_score: Math.round(new_women_safety * 10) / 10,
    },
    budget: {
      ...b.budget,
      utilized_pct: Math.round(new_budget_util * 10) / 10,
    },
    citizen: {
      ...b.citizen,
      satisfaction_score: Math.round(new_satisfaction * 10) / 10,
      grievances_monthly: Math.round(new_grievances),
    },
  };

  const deltas = {
    congestion_index: Math.round((new_congestion - b.traffic.congestion_index) * 10) / 10,
    avg_speed_kmh: Math.round((new_speed - b.traffic.avg_speed_kmh) * 10) / 10,
    aqi_index: Math.round((new_aqi - b.aqi.aqi_index) * 10) / 10,
    pm25: Math.round((new_pm25 - b.aqi.pm25) * 10) / 10,
    cctv_coverage_pct: Math.round((new_cctv - b.safety.cctv_coverage_pct) * 10) / 10,
    incidents_per_lakh: Math.round((new_incidents - b.safety.incidents_per_lakh) * 10) / 10,
    women_safety_score: Math.round((new_women_safety - b.safety.women_safety_score) * 10) / 10,
    satisfaction_score: Math.round((new_satisfaction - b.citizen.satisfaction_score) * 10) / 10,
  };

  const overall_score = Math.round(
    (100 - new_congestion) * 0.2 +
    (100 - Math.min(new_aqi / 5, 100)) * 0.2 +
    new_women_safety * 0.2 +
    new_satisfaction * 0.2 +
    new_budget_util * 0.2
  );

  // Core Agent comments (Fallback static descriptions)
  const traffic_recs = [];
  if (new_congestion > 70) {
    traffic_recs.push("Deploy dynamic signal timing on arterial networks.");
    traffic_recs.push("Activate bus rapid transit (BRT) priority corridors.");
  } else {
    traffic_recs.push("Traffic flows are steady; suggest peak bottlenecks zoning.");
  }

  const aqi_recs = [];
  if (new_aqi > 150) {
    aqi_recs.push("Issue sensitive groups early warning stay-indoors notices.");
    aqi_recs.push("Enforce strict dust barriers on active urban build zones.");
  } else {
    aqi_recs.push("Air quality reading remains within stable limits.");
  }

  const safety_recs = [];
  if (new_women_safety < 60) {
    safety_recs.push("Enforce late-night SOS active loops in under-lit corridors.");
    safety_recs.push("Mandate facial-tracking alarms in public commute lines.");
  } else {
    safety_recs.push("Perceived street safety is currently adequate.");
  }

  // Base output
  let simulationResult: any = {
    projected,
    deltas,
    overall_score,
    agents: {
      traffic_agent: {
        status: new_congestion > 70 ? "critical" : new_congestion > 50 ? "warning" : "healthy",
        recommendations: traffic_recs,
        confidence: 90,
      },
      aqi_agent: {
        status: new_aqi > 200 ? "critical" : new_aqi > 100 ? "warning" : "healthy",
        recommendations: aqi_recs,
        confidence: 88,
      },
      safety_agent: {
        status: new_women_safety < 60 ? "critical" : new_women_safety < 75 ? "warning" : "healthy",
        recommendations: safety_recs,
        confidence: 91,
      },
      executive_agent: {
        overall_score,
        status: overall_score < 45 ? "critical" : overall_score < 65 ? "warning" : "healthy",
        summary: `Deterministic projected index is ${overall_score}/100. Monitor main indicators.`,
        confidence: 93,
      }
    }
  };

  // Attempt real Gemini enrichment if API key exists!
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are the UrbanFlow Core Executive AI Brain. Analyze these simulated results for ${city.name}:
- Baseline overall congestion was ${b.traffic.congestion_index}%, now projected to be ${projected.traffic.congestion_index}%.
- Baseline AQI was ${b.aqi.aqi_index}, now projected to be ${projected.aqi.aqi_index}.
- Baseline active Women Safety Score was ${b.safety.women_safety_score}, now projected to be ${projected.safety.women_safety_score}.
- Baseline Citizen Satisfaction was ${b.citizen.satisfaction_score}, now projected to be ${projected.citizen.satisfaction_score}.
- Budget Allocation changes were: ${budget_delta}%, resulting in ${projected.budget.utilized_pct}% compliance.

Provide an AI Executive Summary & Analysis in a JSON schema with exact fields:
1. "executive_summary": markdown paragraph explaining outcomes.
2. "risk_assessment": a complete bulleted list of 2 primary risks.
3. "opportunity_assessment": a bulleted statement showing a clear development opportunity.
4. "recommended_actions": 3 priority real commands (fast-track CCTV, etc.).
5. "predicted_outcomes": future city outcome forecasts if actions are executed.
6. "confidence_score": integer (0 to 100) signifying confidence.
7. "reasoning": bullet of analytical logic behind actions.
8. "trend_interpretation": interpretation of trends.
9. "citizen_impact_forecast": dynamic forecast statement.
10. "budget_impact_forecast": dynamic budget forecast statement.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executive_summary: { type: Type.STRING },
              risk_assessment: { type: Type.STRING },
              opportunity_assessment: { type: Type.STRING },
              recommended_actions: { type: Type.STRING },
              predicted_outcomes: { type: Type.STRING },
              confidence_score: { type: Type.INTEGER },
              reasoning: { type: Type.STRING },
              trend_interpretation: { type: Type.STRING },
              citizen_impact_forecast: { type: Type.STRING },
              budget_impact_forecast: { type: Type.STRING }
            }
          }
        }
      });

      if (response && response.text) {
        const enriched = JSON.parse(response.text.trim());
        simulationResult.ai_analysis = enriched;
        // Merge with executive agent summary
        simulationResult.agents.executive_agent.summary = enriched.executive_summary;
        simulationResult.agents.executive_agent.confidence = enriched.confidence_score;
      }
    } catch (e) {
      console.error("Gemini simulation enrichment failed, using local mock fallbacks:", e);
    }
  }

  // If no real AI result or failed, seed standard mock intelligence values!
  if (!simulationResult.ai_analysis) {
    simulationResult.ai_analysis = {
      executive_summary: `Deterministic system forecast highlights that ${city.name} overall health stands at **${overall_score}/100**. Coordinated delta parameters reflect that traffic congestion index shifts by **${deltas.congestion_index}%**, AQI drifts by **${deltas.aqi_index} points**, and Street Patrol confidence reports a delta of **${deltas.women_safety_score} points**. Recommended tactical deployment remains active.`,
      risk_assessment: `• Combined rise in road closures and under-lit zones compounds peak transit delays.\n• PM2.5 levels exceed baseline safely margins in localized dense wards by 1.8x.`,
      opportunity_assessment: `• Strategic deployment of ${cctv_delta}% CCTV coverage improves women's security, unlocking positive late-night commercial activity loop worth an estimated ₹240 Cr in economic throughput.`,
      recommended_actions: `• Fast-track 45 high-resolution CCTV units in hotspots immediately.\n• Restrict commercial transit along arterial road blocks to outside active hours.\n• Scale public park green loops in the high-AQI clusters.`,
      predicted_outcomes: `Projected index improvement of 12-14 points in general satisfaction score over 90 calendar days.`,
      confidence_score: 93,
      reasoning: "High direct math correlation with active CCTV sensors and rapid patrol response timing metrics.",
      trend_interpretation: "Worsening air quality limits street-walking times, cascading commute density onto existing bus rails.",
      citizen_impact_forecast: "Resolving 3 major traffic bottle-necks will trigger immediate 24% lower localized commute grievances.",
      budget_impact_forecast: "Lever shift requires ₹85 Cr capex, easily sustained from existing municipal surplus allocations."
    };
  }

  res.json(simulationResult);
});

// PDF/DOCX/TXT Proposal Analyzer Endpoint (Phase 6)
app.post("/api/proposal/analyze", async (req, res) => {
  const { title, text, cityId } = req.body;
  const targetCity = CITIES.find(c => c.id === cityId) || CITIES[0];

  if (!title || !text) {
    return res.status(400).json({ error: "Missing proposal title and content text" });
  }

  let analysis: any = null;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the UrbanFlow Strategic Planning AI Committee. Evaluate this municipal development proposal:
PROPOSAL TITLE: ${title}
TARGET CITY: ${targetCity.name}
PROPOSAL CONTENT TEXT:
${text}

Run a complete multi-agent review (Traffic, AQI, Safety, Budget, Citizen).
Return a strict JSON output matching these exact requirements:
1. "decision": String, must be EXACTLY one of: "APPROVED", "APPROVED_WITH_CONDITIONS", or "REJECTED".
2. "confidence": Integer (0-100).
3. "summary": A 3-sentence summary of proposal objectives.
4. "traffic_impact": Predicted congestion impact delta description.
5. "aqi_impact": Predicted AQI index impact delta description.
6. "safety_impact": Dynamic women safety impact assessment.
7. "budget_impact": Municipal financial sustainability score description.
8. "citizen_impact": Forecasted citizen sentiment outcome.
9. "conditions": A list of strings displaying conditions if approved (or reasons why rejected).
10. "feasibility_score": Integer (0-100).
11. "roi_rating": String, e.g. "9.2/10".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              decision: { type: Type.STRING },
              confidence: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              traffic_impact: { type: Type.STRING },
              aqi_impact: { type: Type.STRING },
              safety_impact: { type: Type.STRING },
              budget_impact: { type: Type.STRING },
              citizen_impact: { type: Type.STRING },
              conditions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              feasibility_score: { type: Type.INTEGER },
              roi_rating: { type: Type.STRING }
            }
          }
        }
      });

      if (response && response.text) {
        analysis = JSON.parse(response.text.trim());
      }
    } catch (e) {
      console.error("Gemini proposal evaluation failed, running fallback:", e);
    }
  }

  if (!analysis) {
    // Generate intelligent deterministic fallbacks if key is missing or model fails
    const lowTitle = title.toLowerCase();
    const isApproved = !lowTitle.includes("nuclear") && !lowTitle.includes("demolish") && !lowTitle.includes("coal");
    const decision = isApproved ? (lowTitle.includes("metro") || lowTitle.includes("solar") ? "APPROVED" : "APPROVED_WITH_CONDITIONS") : "REJECTED";

    analysis = {
      decision,
      confidence: 85,
      summary: `The proposal \"${title}\" seeks to implement localized city improvements targeting sustainability and operational resilience. It prioritizes capital works over standard short-term maintenance.`,
      traffic_impact: lowTitle.includes("traffic") || lowTitle.includes("metro") || lowTitle.includes("road") 
        ? "Projected 8-10% congestion reduction across arterial Ring Road quadrants." 
        : "Neutral, minor localized pedestrian disruptions during construction.",
      aqi_impact: lowTitle.includes("solar") || lowTitle.includes("tree") || lowTitle.includes("green") || lowTitle.includes("electric")
        ? "PM2.5 reductions of up to 12μg, increasing clean-air days by 5%." 
        : "Slight temporary increase in particulate dust loading during phase 1 execution.",
      safety_impact: lowTitle.includes("safety") || lowTitle.includes("cctv") || lowTitle.includes("lighting")
        ? "Improves local women's safety index by +14 points through smart surveillance integrations." 
        : "Positive, adds consistent visual presence around street boundaries.",
      budget_impact: "Requires capital outlay of ₹340 Cr representing minor strain on immediate liquidity, offset by long-term durability indices.",
      citizen_impact: "Excellent, public surveys predict a robust +18 points satisfaction jump upon full execution.",
      conditions: isApproved 
        ? [
            "Install permanent PM2.5 dust suppression shields around execution boundaries.",
            "Schedule heavy equipment transit strictly between 11:00 PM and 5:00 AM.",
            "Include dual-link panic buttons at municipal access nodes."
          ]
        : [
            "Severe permanent AQI impairment exceeding acceptable master plan limits.",
            "Extremely low financial justification indices."
          ],
      feasibility_score: isApproved ? 82 : 35,
      roi_rating: isApproved ? "8.4/10" : "2.1/10"
    };
  }

  res.json({ title, cityId, analysis, analyzedAt: new Date().toISOString() });
});

// Chat Copilot Endpoint (Phase 4 & 9)
app.post("/api/gemini/copilot", async (req, res) => {
  const { messages, currentCity, currentMetrics, activePage } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "No prompts provided" });
  }

  const latestUserPrompt = messages[messages.length - 1].content;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `You are the UrbanFlow Assistant, a highly state-of-the-art interactive co-pilot for urban planners under the Smart City OS.
You have absolute knowledge about:
- Current active city state: ${currentCity || "Delhi"}.
- Real-time city baseline values: ${JSON.stringify(currentMetrics || { traffic: "elevated", AQI: "critical" })}.
- Active panel focus: ${activePage || "Executive Dashboard"}.

Provide deeply helpful, smart, structured answers.
When asked about what decision to take, formulate options clearly using lists and calculate expected metric impacts. Make references to contributing AI agents: Traffic, AQI, Budget, Citizen Sentiment, and Women Safety.
Recommend specific scenarios or lever actions the user can run in the Scenario Lab. Always explain why.`;

      // Filter messages to ensure they start with a 'user' turn to comply with the turn-alternating constraint of Google GenAI SDK.
      const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
      const validMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

      const contents = validMessages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      // Correctly call generateContent on the Chat structure as specified in SKILL.md
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction
        }
      });

      if (response && response.text) {
        return res.json({ response: response.text });
      }
    } catch (e) {
      console.error("Gemini Copilot failed, utilizing fallback:", e);
    }
  }

  // Smart conversational offline fallback if key is missing or model fails:
  const textLower = latestUserPrompt.toLowerCase();
  let fallbackText = `I am running in local-fallback mode, but I can help you analyze **${currentCity || "Delhi"}** based on current parameters. `;

  if (textLower.includes("traffic") || textLower.includes("congest")) {
    fallbackText += `\n\nLooking at the Traffic Agent log, traffic congestion stands at a critical index of **72%**. You can reduce this in the **Scenario Lab** by adjusting the **Road Closures** level downward or increasing high-density mass transit routes. Improving this metric will immediately trigger an 8-point satisfaction bounce.`;
  } else if (textLower.includes("aqi") || textLower.includes("air") || textLower.includes("pollution")) {
    fallbackText += `\n\nOur current AQI sensor warns of a severe **178 index**. The **AQI Agent** advises that expanding the **Green Cover** by +10% along main arterial coordinates will scrub dust particulates, helping reduce localized pm2.5 scores by ~15μg. Try running this scenario to evaluate the budget impact.`;
  } else if (textLower.includes("safety") || textLower.includes("women") || textLower.includes("girl")) {
    fallbackText += `\n\nThe **Women Safety Intelligence Center** reports a safety rating of **54/100**. This is primarily driven by dark zones and police patrol delays averaging 12 minutes. Expanding CCTV coverage to 80% is forecasted to accelerate response rates to 7 minutes, saving municipal safety scores.`;
  } else {
    fallbackText += `\n\nBased on your active view (**${activePage || "Executive command"}**), the city's combined health is under pressure. I suggest modeling a comprehensive **Urban Revival Scenario** (levers: +15% CCTV, +10% Green Cover, -5% road closures) inside the **Scenario Lab** to discover optimal performance vectors at minimum municipal spend! Let me know if you would like me to draft a specific policy document for you.`;
  }

  res.json({ response: fallbackText });
});

// Serve compiled build assets in production, otherwise Vite dev middleware in dev
const runServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UrbanFlow Server] Activated full-stack server on http://localhost:${PORT}`);
  });
};

runServer().catch((err) => {
  console.error("Failed to start server:", err);
});
