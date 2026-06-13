from fastapi import APIRouter, Query
from core.feedback_engine import (
    generate_dashboard, generate_kiosks, generate_grievances,
    generate_departments, generate_stream
)

router = APIRouter()


@router.get("/feedback/dashboard")
def feedback_dashboard(city_id: int = Query(1)):
    return generate_dashboard(city_id)


@router.get("/feedback/kiosks")
def feedback_kiosks(city_id: int = Query(1)):
    return generate_kiosks(city_id)


@router.get("/feedback/grievances")
def feedback_grievances(city_id: int = Query(1)):
    return generate_grievances(city_id)


@router.get("/feedback/departments")
def feedback_departments(city_id: int = Query(1)):
    return generate_departments(city_id)


@router.get("/feedback/stream")
def feedback_stream(city_id: int = Query(1)):
    return generate_stream(city_id)
