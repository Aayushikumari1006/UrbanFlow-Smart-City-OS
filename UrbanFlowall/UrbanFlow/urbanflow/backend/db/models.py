from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.session import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    state = Column(String(100))
    population = Column(Integer)
    area_sq_km = Column(Float)
    baseline_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scenarios = relationship("Scenario", back_populates="city")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="analyst")
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    parameters = Column(JSON, default={})
    results = Column(JSON, default={})
    status = Column(String(50), default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    city = relationship("City", back_populates="scenarios")


class FeedbackSnapshot(Base):
    __tablename__ = "feedback_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    snapshot_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
