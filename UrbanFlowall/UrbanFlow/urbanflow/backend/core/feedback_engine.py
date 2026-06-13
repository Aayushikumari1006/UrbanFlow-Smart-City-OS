"""
Module 06: Citizen Feedback Intelligence Engine
Simulates kiosk, grievance, department, and stream data.
"""
import random
from typing import Dict, Any, List
from datetime import datetime, timedelta


COMPLAINT_CATEGORIES = [
    "Road Condition", "Water Supply", "Garbage Collection",
    "Street Lighting", "Noise Pollution", "Encroachment",
    "Sewage", "Air Quality", "Public Transport", "Parks & Recreation"
]

DEPARTMENTS = [
    "Public Works", "Water & Sanitation", "Municipal Corporation",
    "Traffic Police", "Environment Dept", "Transport Dept",
    "Health Dept", "Parks Dept", "Electricity Board", "Revenue Dept"
]

KIOSK_LOCATIONS = [
    "Connaught Place", "Karol Bagh", "Lajpat Nagar", "Dwarka Sector 10",
    "Rohini Sector 3", "Saket", "Noida Sector 18", "Greater Kailash",
    "Sector 17 Chandigarh", "Sector 22 Chandigarh"
]


def generate_dashboard(city_id: int) -> Dict[str, Any]:
    random.seed(city_id * 42)
    total = random.randint(8000, 15000)
    resolved = int(total * random.uniform(0.6, 0.85))
    pending = total - resolved
    satisfaction = round(random.uniform(55, 78), 1)

    return {
        "total_grievances": total,
        "resolved": resolved,
        "pending": pending,
        "resolution_rate": round(resolved / total * 100, 1),
        "avg_resolution_days": round(random.uniform(3, 12), 1),
        "citizen_satisfaction": satisfaction,
        "top_categories": random.sample(COMPLAINT_CATEGORIES, 5),
        "monthly_trend": [
            {"month": (datetime.now() - timedelta(days=30 * i)).strftime("%b"),
             "count": random.randint(600, 1400)}
            for i in range(6, 0, -1)
        ],
    }


def generate_kiosks(city_id: int) -> List[Dict[str, Any]]:
    random.seed(city_id * 13)
    return [
        {
            "id": i + 1,
            "location": KIOSK_LOCATIONS[i % len(KIOSK_LOCATIONS)],
            "status": random.choice(["online", "online", "online", "offline"]),
            "complaints_today": random.randint(10, 80),
            "avg_wait_min": round(random.uniform(2, 8), 1),
            "satisfaction_rating": round(random.uniform(3.2, 4.8), 1),
        }
        for i in range(8)
    ]


def generate_grievances(city_id: int) -> List[Dict[str, Any]]:
    random.seed(city_id * 7)
    statuses = ["open", "in_progress", "resolved", "escalated"]
    priorities = ["high", "medium", "low"]
    return [
        {
            "id": f"GR-{2024000 + i}",
            "category": random.choice(COMPLAINT_CATEGORIES),
            "description": f"Issue reported at {random.choice(KIOSK_LOCATIONS)}",
            "status": random.choice(statuses),
            "priority": random.choice(priorities),
            "submitted_at": (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
            "department": random.choice(DEPARTMENTS),
        }
        for i in range(20)
    ]


def generate_departments(city_id: int) -> List[Dict[str, Any]]:
    random.seed(city_id * 19)
    return [
        {
            "name": dept,
            "complaints_received": random.randint(50, 800),
            "resolved": random.randint(30, 700),
            "resolution_rate": round(random.uniform(55, 92), 1),
            "avg_days": round(random.uniform(2, 15), 1),
            "satisfaction": round(random.uniform(3.0, 4.9), 1),
            "rank": i + 1,
        }
        for i, dept in enumerate(random.sample(DEPARTMENTS, len(DEPARTMENTS)))
    ]


def generate_stream(city_id: int) -> List[Dict[str, Any]]:
    random.seed(city_id)
    sentiments = ["positive", "neutral", "negative", "negative"]
    return [
        {
            "id": i + 1,
            "text": f"Feedback from citizen about {random.choice(COMPLAINT_CATEGORIES).lower()} in {random.choice(KIOSK_LOCATIONS)}",
            "sentiment": random.choice(sentiments),
            "category": random.choice(COMPLAINT_CATEGORIES),
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(1, 120))).isoformat(),
            "source": random.choice(["kiosk", "app", "web", "call_center"]),
        }
        for i in range(15)
    ]
