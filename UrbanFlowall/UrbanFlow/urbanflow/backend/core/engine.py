"""
UrbanFlow Simulation Engine — deterministic transfer functions.
All math is self-contained; no external API calls.
"""
from typing import Dict, Any


def clamp(val: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, val))


def simulate(baseline: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Apply parameter deltas to baseline and return projected state + agent outputs.
    params keys: road_closures_delta, aqi_delta, cctv_delta, budget_delta,
                 complaints_delta, police_units_delta, green_cover_delta
    """
    b = baseline
    p = params

    road_delta = p.get("road_closures_delta", 0)
    aqi_delta = p.get("aqi_delta", 0)
    cctv_delta = p.get("cctv_delta", 0)
    budget_delta = p.get("budget_delta", 0)
    complaints_delta = p.get("complaints_delta", 0)
    police_delta = p.get("police_units_delta", 0)
    green_delta = p.get("green_cover_delta", 0)

    t = b.get("traffic", {})
    a = b.get("aqi", {})
    s = b.get("safety", {})
    bud = b.get("budget", {})
    c = b.get("citizen", {})

    new_congestion = clamp(t.get("congestion_index", 50) + road_delta * 2.5)
    new_speed = clamp(t.get("avg_speed_kmh", 30) - road_delta * 1.2, 5, 120)
    new_aqi = clamp(a.get("aqi_index", 100) + aqi_delta * 3 - green_delta * 2, 0, 500)
    new_pm25 = clamp(a.get("pm25", 80) + aqi_delta * 2 - green_delta * 1.5, 0, 500)
    new_cctv = clamp(s.get("cctv_coverage_pct", 60) + cctv_delta)
    new_response = clamp(s.get("police_response_min", 10) - police_delta * 0.5, 1, 60)
    new_incidents = clamp(
        s.get("incidents_per_lakh", 30) + road_delta * 0.8 - cctv_delta * 0.4 - police_delta * 0.6
    )
    new_women_safety = clamp(
        s.get("women_safety_score", 60) + cctv_delta * 0.5 + police_delta * 0.8 - road_delta * 0.3
    )
    new_budget_util = clamp(bud.get("utilized_pct", 80) + budget_delta * 0.5)
    new_satisfaction = clamp(
        c.get("satisfaction_score", 60)
        - complaints_delta * 0.3
        + cctv_delta * 0.2
        + green_delta * 0.3
        - road_delta * 0.4
        - aqi_delta * 0.2
    )
    new_grievances = max(0, c.get("grievances_monthly", 5000) + complaints_delta * 100)

    projected = {
        "traffic": {
            **t,
            "congestion_index": round(new_congestion, 1),
            "avg_speed_kmh": round(new_speed, 1),
        },
        "aqi": {
            **a,
            "aqi_index": round(new_aqi, 1),
            "pm25": round(new_pm25, 1),
        },
        "safety": {
            **s,
            "cctv_coverage_pct": round(new_cctv, 1),
            "police_response_min": round(new_response, 1),
            "incidents_per_lakh": round(new_incidents, 1),
            "women_safety_score": round(new_women_safety, 1),
        },
        "budget": {
            **bud,
            "utilized_pct": round(new_budget_util, 1),
        },
        "citizen": {
            **c,
            "satisfaction_score": round(new_satisfaction, 1),
            "grievances_monthly": int(new_grievances),
        },
    }

    deltas = {
        "congestion_index": round(new_congestion - t.get("congestion_index", 50), 1),
        "avg_speed_kmh": round(new_speed - t.get("avg_speed_kmh", 30), 1),
        "aqi_index": round(new_aqi - a.get("aqi_index", 100), 1),
        "pm25": round(new_pm25 - a.get("pm25", 80), 1),
        "cctv_coverage_pct": round(new_cctv - s.get("cctv_coverage_pct", 60), 1),
        "incidents_per_lakh": round(new_incidents - s.get("incidents_per_lakh", 30), 1),
        "women_safety_score": round(new_women_safety - s.get("women_safety_score", 60), 1),
        "satisfaction_score": round(new_satisfaction - c.get("satisfaction_score", 60), 1),
    }

    agents = _run_agents(projected, deltas, p)

    return {"projected": projected, "deltas": deltas, "agents": agents}


def _run_agents(projected: dict, deltas: dict, params: dict) -> dict:
    t = projected["traffic"]
    a = projected["aqi"]
    s = projected["safety"]
    c = projected["citizen"]
    bud = projected["budget"]

    traffic_recs = []
    if t["congestion_index"] > 70:
        traffic_recs.append("Deploy dynamic signal timing on arterial roads")
        traffic_recs.append("Activate bus rapid transit priority lanes")
    if t["avg_speed_kmh"] < 20:
        traffic_recs.append("Implement odd-even vehicle restriction")
    if not traffic_recs:
        traffic_recs.append("Traffic flow is within acceptable parameters")

    aqi_recs = []
    if a["aqi_index"] > 150:
        aqi_recs.append("Issue health advisory — sensitive groups stay indoors")
        aqi_recs.append("Halt construction activities near residential zones")
    if a["pm25"] > 100:
        aqi_recs.append("Increase water sprinkling frequency on major roads")
    if not aqi_recs:
        aqi_recs.append("Air quality is within safe limits")

    safety_recs = []
    if s["incidents_per_lakh"] > 35:
        safety_recs.append("Deploy additional patrol units to high-incident zones")
    if s["cctv_coverage_pct"] < 65:
        safety_recs.append("Expand CCTV network — coverage below safe threshold")
    if s["women_safety_score"] < 60:
        safety_recs.append("Activate women safety helplines and safe-zone designations")
    if not safety_recs:
        safety_recs.append("Safety metrics within acceptable range")

    citizen_recs = []
    if c["satisfaction_score"] < 55:
        citizen_recs.append("Launch citizen engagement portal for grievance resolution")
        citizen_recs.append("Increase resolution SLA compliance monitoring")
    if c["grievances_monthly"] > 10000:
        citizen_recs.append("Fast-track grievance resolution for top complaint categories")
    if not citizen_recs:
        citizen_recs.append("Citizen satisfaction is healthy")

    budget_recs = []
    if bud["utilized_pct"] < 60:
        budget_recs.append("Accelerate infrastructure project disbursements")
    if bud["utilized_pct"] > 95:
        budget_recs.append("Request supplementary budget allocation from state government")
    if not budget_recs:
        budget_recs.append("Budget utilization is on track")

    planning_recs = []
    if deltas.get("satisfaction_score", 0) < -5:
        planning_recs.append("Prioritize citizen-facing service improvements in next quarter")
    if deltas.get("aqi_index", 0) > 20:
        planning_recs.append("Integrate green infrastructure into new development approvals")
    if not planning_recs:
        planning_recs.append("Current urban plan is aligned with city targets")

    overall_score = round(
        (
            (100 - t["congestion_index"]) * 0.2
            + (100 - min(a["aqi_index"] / 5, 100)) * 0.2
            + s["women_safety_score"] * 0.2
            + c["satisfaction_score"] * 0.2
            + bud["utilized_pct"] * 0.2
        ),
        1,
    )

    return {
        "traffic_agent": {
            "status": "critical" if t["congestion_index"] > 70 else "warning" if t["congestion_index"] > 50 else "healthy",
            "recommendations": traffic_recs,
            "confidence": 92,
        },
        "aqi_agent": {
            "status": "critical" if a["aqi_index"] > 200 else "warning" if a["aqi_index"] > 100 else "healthy",
            "recommendations": aqi_recs,
            "confidence": 88,
        },
        "safety_agent": {
            "status": "critical" if s["incidents_per_lakh"] > 40 else "warning" if s["incidents_per_lakh"] > 25 else "healthy",
            "recommendations": safety_recs,
            "confidence": 90,
        },
        "citizen_agent": {
            "status": "critical" if c["satisfaction_score"] < 45 else "warning" if c["satisfaction_score"] < 60 else "healthy",
            "recommendations": citizen_recs,
            "confidence": 85,
        },
        "budget_agent": {
            "status": "warning" if bud["utilized_pct"] < 60 or bud["utilized_pct"] > 95 else "healthy",
            "recommendations": budget_recs,
            "confidence": 94,
        },
        "planning_agent": {
            "status": "warning" if deltas.get("satisfaction_score", 0) < -5 else "healthy",
            "recommendations": planning_recs,
            "confidence": 87,
        },
        "executive_agent": {
            "overall_score": overall_score,
            "status": "critical" if overall_score < 40 else "warning" if overall_score < 60 else "healthy",
            "summary": f"Urban health score is {overall_score}/100. {'Immediate intervention required.' if overall_score < 40 else 'Monitor key metrics.' if overall_score < 60 else 'City is performing well.'}",
            "confidence": 91,
        },
    }
