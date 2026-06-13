from sqlalchemy.orm import Session
from db.models import City, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


DELHI_BASELINE = {
    "traffic": {
        "congestion_index": 72,
        "avg_speed_kmh": 18,
        "road_closures": 12,
        "peak_hour_delay_min": 45,
        "public_transit_coverage": 68,
    },
    "aqi": {
        "pm25": 145,
        "pm10": 210,
        "aqi_index": 178,
        "good_air_days_pct": 12,
        "industrial_zones": 8,
    },
    "safety": {
        "incidents_per_lakh": 42,
        "cctv_coverage_pct": 58,
        "police_response_min": 12,
        "women_safety_score": 54,
        "lit_streets_pct": 71,
    },
    "budget": {
        "total_crore": 8500,
        "utilized_pct": 78,
        "infrastructure_pct": 35,
        "social_pct": 22,
        "operations_pct": 43,
    },
    "citizen": {
        "satisfaction_score": 58,
        "grievances_monthly": 12400,
        "resolution_rate_pct": 67,
        "digital_adoption_pct": 44,
    },
}

CHANDIGARH_BASELINE = {
    "traffic": {
        "congestion_index": 38,
        "avg_speed_kmh": 34,
        "road_closures": 3,
        "peak_hour_delay_min": 18,
        "public_transit_coverage": 52,
    },
    "aqi": {
        "pm25": 68,
        "pm10": 95,
        "aqi_index": 82,
        "good_air_days_pct": 58,
        "industrial_zones": 2,
    },
    "safety": {
        "incidents_per_lakh": 18,
        "cctv_coverage_pct": 82,
        "police_response_min": 7,
        "women_safety_score": 74,
        "lit_streets_pct": 91,
    },
    "budget": {
        "total_crore": 2200,
        "utilized_pct": 88,
        "infrastructure_pct": 40,
        "social_pct": 28,
        "operations_pct": 32,
    },
    "citizen": {
        "satisfaction_score": 74,
        "grievances_monthly": 3200,
        "resolution_rate_pct": 84,
        "digital_adoption_pct": 68,
    },
}


def seed_database(db: Session):
    if db.query(City).count() > 0:
        return

    delhi = City(
        name="Delhi",
        state="Delhi",
        population=32000000,
        area_sq_km=1484,
        baseline_data=DELHI_BASELINE,
    )
    chandigarh = City(
        name="Chandigarh",
        state="Punjab/Haryana",
        population=1200000,
        area_sq_km=114,
        baseline_data=CHANDIGARH_BASELINE,
    )
    db.add(delhi)
    db.add(chandigarh)
    db.flush()

    users = [
        User(
            email="admin@urbanflow.in",
            name="Super Admin",
            hashed_password=pwd_context.hash("Admin@123"),
            role="super_admin",
        ),
        User(
            email="planner@delhi.gov.in",
            name="Delhi Planner",
            hashed_password=pwd_context.hash("Planner@123"),
            role="urban_planner",
            city_id=delhi.id,
        ),
        User(
            email="analyst@urbanflow.in",
            name="UrbanFlow Analyst",
            hashed_password=pwd_context.hash("Analyst@123"),
            role="analyst",
        ),
    ]
    for u in users:
        db.add(u)

    db.commit()
    print("✅ Database seeded with Delhi, Chandigarh, and demo users")
