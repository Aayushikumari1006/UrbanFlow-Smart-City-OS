import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/urbanflow"
    )
    secret_key: str = os.environ.get("SECRET_KEY", "urbanflow-secret-key-change-in-prod")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    app_name: str = "UrbanFlow"
    debug: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
