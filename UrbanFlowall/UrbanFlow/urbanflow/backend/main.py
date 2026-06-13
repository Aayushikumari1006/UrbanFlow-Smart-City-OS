from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.session import Base, engine, SessionLocal
from db.seed import seed_database
from api.routes import health, cities, auth, scenarios, feedback


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="UrbanFlow API",
    version="1.0.0",
    description="Multi-Agent Urban Intelligence Platform",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(cities.router)
app.include_router(auth.router)
app.include_router(scenarios.router)
app.include_router(feedback.router)


@app.get("/")
def root():
    return {"message": "UrbanFlow API is running", "docs": "/docs"}
