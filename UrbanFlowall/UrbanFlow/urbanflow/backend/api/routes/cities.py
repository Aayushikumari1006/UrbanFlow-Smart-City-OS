from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import City

router = APIRouter()


@router.get("/cities")
def get_cities(db: Session = Depends(get_db)):
    cities = db.query(City).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "state": c.state,
            "population": c.population,
            "area_sq_km": c.area_sq_km,
        }
        for c in cities
    ]


@router.get("/cities/{city_id}/baselines")
def get_baselines(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return {"city_id": city_id, "name": city.name, "baseline": city.baseline_data}
