from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from db.session import get_db
from db.models import Scenario, City
from core.engine import simulate
import jwt
from core.config import settings

router = APIRouter()


def get_current_user_id(request: Request) -> Optional[int]:
    token = request.cookies.get("urbanflow_token") or (
        request.headers.get("Authorization", "").replace("Bearer ", "")
    )
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return int(payload["sub"])
    except Exception:
        return None


class ScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    city_id: int
    parameters: Optional[Dict[str, Any]] = {}


class ScenarioRun(BaseModel):
    parameters: Dict[str, Any]


@router.get("/scenarios")
def list_scenarios(city_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Scenario)
    if city_id:
        q = q.filter(Scenario.city_id == city_id)
    scenarios = q.order_by(Scenario.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "city_id": s.city_id,
            "status": s.status,
            "parameters": s.parameters,
            "results": s.results,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in scenarios
    ]


@router.post("/scenarios")
def create_scenario(body: ScenarioCreate, request: Request, db: Session = Depends(get_db)):
    user_id = get_current_user_id(request)
    scenario = Scenario(
        name=body.name,
        description=body.description,
        city_id=body.city_id,
        created_by=user_id,
        parameters=body.parameters,
        status="draft",
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return {"id": scenario.id, "name": scenario.name, "status": scenario.status}


@router.get("/scenarios/{scenario_id}")
def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    s = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return {
        "id": s.id,
        "name": s.name,
        "description": s.description,
        "city_id": s.city_id,
        "status": s.status,
        "parameters": s.parameters,
        "results": s.results,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }


@router.post("/scenarios/{scenario_id}/run")
def run_scenario(scenario_id: int, body: ScenarioRun, db: Session = Depends(get_db)):
    s = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")

    city = db.query(City).filter(City.id == s.city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    results = simulate(city.baseline_data, body.parameters)
    s.parameters = body.parameters
    s.results = results
    s.status = "completed"
    db.commit()

    return {"scenario_id": scenario_id, "status": "completed", **results}


@router.post("/simulate")
def quick_simulate(body: ScenarioRun, city_id: int = 1, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    results = simulate(city.baseline_data, body.parameters)
    return results


@router.delete("/scenarios/{scenario_id}")
def delete_scenario(scenario_id: int, db: Session = Depends(get_db)):
    s = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")
    db.delete(s)
    db.commit()
    return {"message": "Deleted"}
