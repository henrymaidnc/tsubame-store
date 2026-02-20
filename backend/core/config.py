"""Application configuration."""
import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """App settings from environment."""

    # API
    api_v1_prefix: str = os.getenv("API_V1_PREFIX", "/api")
    project_name: str = os.getenv("PROJECT_NAME", "Tsubame Store API")
    openapi_url: Optional[str] = "/api/openapi.json"
    docs_url: Optional[str] = "/api/docs"
    redoc_url: Optional[str] = "/api/redoc"

    # Database
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "password")
    postgres_db: str = os.getenv("POSTGRES_DB", "tsubame_store")
    postgres_host: str = os.getenv("POSTGRES_HOST", "postgres")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    # Auth
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )


settings = Settings()
