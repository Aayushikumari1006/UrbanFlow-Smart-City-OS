import { SliderConfig, DemoScenario, ZoneDetail, Notification } from "./types";

export const SLIDERS: SliderConfig[] = [
  { key: "road_closures_delta", label: "Road Closures", min: -10, max: 20, step: 1, unit: "roads", inverseGood: true, group: "Traffic" },
  { key: "aqi_delta", label: "Industrial Activity", min: -20, max: 30, step: 1, unit: "pts", inverseGood: true, group: "Air Quality" },
  { key: "cctv_delta", label: "CCTV Coverage Expansion", min: -20, max: 30, step: 1, unit: "%", group: "Safety" },
  { key: "police_units_delta", label: "Patrol Units Deployed", min: -10, max: 20, step: 1, unit: "forces", group: "Safety" },
  { key: "budget_delta", label: "Extra Budget Lever", min: -20, max: 30, step: 1, unit: "%", group: "Budget" },
  { key: "complaints_delta", label: "Operational Grip", min: -20, max: 30, step: 1, unit: "pts", inverseGood: true, group: "Citizens" },
  { key: "green_cover_delta", label: "Green Cover Expansion", min: -10, max: 20, step: 1, unit: "%", group: "Environment" },
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  { label: "Normal City Baseline", desc: "Standard state of municipal variables", params: { road_closures_delta: 0, aqi_delta: 0, cctv_delta: 0, police_units_delta: 0, budget_delta: 0, complaints_delta: 0, green_cover_delta: 0 } },
  { label: "Traffic Gridlock Crisis", desc: "Simulated emergency lanes blockage", params: { road_closures_delta: 14, aqi_delta: 7, cctv_delta: 0, police_units_delta: 4, budget_delta: -5, complaints_delta: 12, green_cover_delta: 0 } },
  { label: "Winter Smog Emergency", desc: "Critical seasonal air quality stagnation", params: { road_closures_delta: 4, aqi_delta: 25, cctv_delta: 0, police_units_delta: 0, budget_delta: -10, complaints_delta: 15, green_cover_delta: -4 } },
  { label: "Hotspot Crime Containment", desc: "Rapid patrol and camera saturation", params: { road_closures_delta: 2, aqi_delta: 0, cctv_delta: 25, police_units_delta: 18, budget_delta: 15, complaints_delta: -6, green_cover_delta: 0 } },
  { label: "Sustainable OS Renewal", desc: "Optimal balanced infrastructure deployment", params: { road_closures_delta: -6, aqi_delta: -15, cctv_delta: 20, police_units_delta: 12, budget_delta: 20, complaints_delta: -12, green_cover_delta: 16 } },
];

export const SLIDER_GROUPS = ["Traffic", "Air Quality", "Safety", "Budget", "Citizens", "Environment"];

export const NOTIFICATIONS_MOCKS: Notification[] = [
  { id: "1", message: "AQI sensors spike past 178 index in industrial sectors — Air quality alarm triggered.", level: "critical", time: "2 min ago" },
  { id: "2", message: "Central CBD traffic congestion reaches critical peak threshold (72% density). Rerouting active.", level: "warning", time: "12 min ago" },
  { id: "3", message: "Women Safety Safe-Route satellite corridor reports lit-street illumination at 91% in Chandigarh.", level: "healthy", time: "1 hour ago" },
  { id: "4", message: "City Municipal Budget disbursement for Phase IV subway extension cleared at audit nodes.", level: "info", time: "3 hours ago" },
];

export const DEL_ZONES: ZoneDetail[] = [
  {
    id: "del-cbd",
    name: "Connaught Place (Central CBD)",
    type: "Commercial Hub",
    risk: "medium",
    congestion: 68,
    aqi: 162,
    cctv: 78,
    safety: 64,
    diagnosis: "Severe pedestrian congestion and vehicular queuing blocks clean cooling loops. Elevated peak hour thermal intensity.",
    treatment: "Deploy adaptive dynamic lane signals and fast-track cool pavement coating spray across Phase II corridors."
  },
  {
    id: "del-east",
    name: "Patparganj & Shahdara Industrial",
    type: "Manufacturing zone",
    risk: "high",
    congestion: 54,
    aqi: 245,
    cctv: 42,
    safety: 48,
    diagnosis: "Intense PM2.5 particulate loading from localized combustion. CCTV dead-zones limit enforcement capabilities.",
    treatment: "Halt industrial operations above 200 AQI and mandate dual-capture filtration systems on all active exhaust stacks."
  },
  {
    id: "del-north",
    name: "Rohini Sector 5",
    type: "Residential Ward",
    risk: "high",
    congestion: 48,
    aqi: 152,
    cctv: 32,
    safety: 38,
    diagnosis: "Critically low night-time illumination leads to highest localized gender safety risk. CCTV coverage is severely under target.",
    treatment: "Saturate with 45 dynamic micro-cameras, launch dual-button LED safety kiosks and increase patrol frequency from 8PM to midnight."
  },
  {
    id: "del-west",
    name: "Dwarka Complex Wards",
    type: "Suburban Ward",
    risk: "medium",
    congestion: 52,
    aqi: 138,
    cctv: 61,
    safety: 60,
    diagnosis: "Rapid population expand strains utility water lines and creates localized transit connection gaps to metro nodes.",
    treatment: "Deploy mini-shuttle feeders to key subway points and install smart leakage network indicators in major reservoirs."
  },
  {
    id: "del-south",
    name: "Asola Bhatti Sanctuary (West)",
    type: "Green Belt Sanctuary",
    risk: "low",
    congestion: 15,
    aqi: 72,
    cctv: 88,
    safety: 85,
    diagnosis: "Ecological balance pristine. Minor soil moisture dryness during peak heat summers.",
    treatment: "Maintain existing forest reserve safeguards and configure localized automated solar water-misters."
  }
];

export const CHD_ZONES: ZoneDetail[] = [
  {
    id: "chd-cbd",
    name: "Sector 17 Plaza (Central CBD)",
    type: "Civic Plaza & Commercial",
    risk: "low",
    congestion: 32,
    aqi: 78,
    cctv: 88,
    safety: 82,
    diagnosis: "Pedestrian-only zoning protects air channels. Occasional peak congestion near external transit hubs.",
    treatment: "Introduce solar EV shuttle links to sector borders and integrate smart reservation slots inside parking bays."
  },
  {
    id: "chd-ind",
    name: "Industrial Area Phase I",
    type: "Light Manufacturing Zone",
    risk: "medium",
    congestion: 45,
    aqi: 112,
    cctv: 72,
    safety: 68,
    diagnosis: "Moderate freight traffic idling. Some dust loading during midday production periods.",
    treatment: "Enforce smart freight routing limits and mandate misting sprinklers on raw gravel storage yards."
  },
  {
    id: "chd-res",
    name: "Sector 35 Residential",
    type: "Residential Ward",
    risk: "low",
    congestion: 28,
    aqi: 64,
    cctv: 85,
    safety: 78,
    diagnosis: "High civic compliance and well-distributed green parks. Minor pedestrian street light gaps in pocket parks.",
    treatment: "Expand micro-LED lighting in secondary pathways and configure public emergency solar chargers."
  }
];

export const PRELOADED_PROPOSALS = [
  {
    id: "prop-1",
    title: "Delhi Metro Phase V Corridor Integration",
    summary: "High-density subway linkage spanning 42km of active coordinates to bypass congested Ring Road sectors, estimated to displace 120,000 daily personal vehicles.",
    text: `PROPOSAL ANALYSIS FOR URBAN EXPANSION
TITLE: Delhi Metro Phase V Corridor Integration
SCOPE: Spans 42.5km connecting residential Western nodes directly to Commercial CBD corridors.
BUDGET: ₹4,800 Crore, to be co-financed by Municipal bonds and State development coffers.
ENVIRONMENTAL ANALYSIS: Will temporarily disrupt 2.4 hectares of sub-surface soil corridors. However, it is projected to reduce overall vehicular carbon emissions by 42,000 metric tons annually.
TRAFFIC PROJECTIONS: Bypasses Ring Road bottleneck sectors, reducing overall congestion indices in central districts by a forecasted 11.5% and increasing average speeds from 18km/h to 24km/h.
CITIZEN IMPACT: Drastically lowers daily commute times of 140,000 residential voters by an estimated 22 minutes per trip. Feasibility evaluation rating is marked outstanding.`
  },
  {
    id: "prop-2",
    title: "EcoShield Carbon Scrubber Net (Zone A)",
    summary: "Installation of 120 high-capacity modular solar-powered ambient carbon scrubbers in the Shahdara industrial zone to combat critical PM2.5 concentrations.",
    text: `MUNICIPAL DEVELOPMENT PLAN
TITLE: EcoShield Carbon Scrubber Net (Zone A)
SCOPE: Deploy 120 decentralized, self-cleaning solar scrubbing towers around High-Risk Industrial East sectors.
BUDGET: ₹350 Crore, fully funded under the Clean Air National Allocation.
SPECIFICATIONS: Active particle collectors capture pm2.5 and atmospheric nitrogen oxides. Solar panels charge battery cells on-site, ensuring zero operational draw on city electric grids.
HEALTH OUTCOMES: Forecasted to reduce localized industrial pm2.5 concentrations by 24% (approx 35μg) within 60 days of complete site commissioning, resulting in 18% fewer respiratory emergency rooms admissions.`
  },
  {
    id: "prop-3",
    title: "Solar Safe-Zone Lighting & Camera Grids",
    summary: "Deploying 1,200 smart motion-activated LED lights and continuous-gaze CCTV cameras across 8 selected high-risk dark alleys in Rohini Sector 5.",
    text: `COMMUNITY SAFETY INITIATIVE PROPOSAL
TITLE: Solar Safe-Zone Lighting & Camera Grids
SCOPE: Saturation installation of intelligent lighting and neural-link CCTV systems in 14 high-incident alleys.
BUDGET: ₹125 Crore, drawn from the National Women's Safety Allocation.
SYSTEMS LOGIC: Streets will utilize continuous-gaze high-resolution visual cameras carrying facial alarm recognition. Street poles are equipped with SOS call domes linking to localized dispatch centers.
PREVENTIVE OUTCOMES: Street light illumination is guaranteed to reach 96%, totally eliminating night-time blind spots. Safe-Zone scores are projected to rise by 22 points, lowering active incidents dramatically.`
  },
  {
    id: "prop-4",
    title: "Arterial Coal Plant Extension",
    summary: "Adding a supplementary 500MW coal combustor unit at the eastern perimeter to absorb rising CBD air conditioning energy demands.",
    text: `ENERGY SECURITY AMENDMENT
TITLE: Eastern Coal Combustor units addition
SCOPE: Erect supplementary 500MW coal furnace inside Eastern industrial outskirts to support rising retail heat waves.
BUDGET: ₹850 Crore.
ENVIRONMENTAL THREATS: Air scrubbing analysis estimates an auxiliary release of 150 tons of toxic particulate ash yearly into the atmospheric valley. Localized AQI index is projected to deteriorate permanently by over 45 points, violating legal WHO safety ceilings.
FEASIBILITY ANALYSIS: Underfunded filters represent high regulatory and public health litigation risks. Expected to trigger mass citizen protests and lawsuits.`
  }
];
