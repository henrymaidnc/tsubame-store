"""
Tsubame Store API — FastAPI app.

Structure (FastAPI best practices):
- core/     : config, dependencies
- crud/     : BaseCRUD + per-entity CRUD (products, etc.)
- api/      : routers (auth, products, ...)
- models/   : SQLAlchemy models, Pydantic schemas

Swagger UI: /api/docs   (test all endpoints)
ReDoc:     /api/redoc
OpenAPI:   /api/openapi.json
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic import command
from alembic.config import Config
from pathlib import Path
import os

from core.config import settings
from models.database import Base
from api import auth, materials, products

def run_migrations():
    cfg = Config(str(Path(__file__).with_name("alembic.ini")))
    cfg.set_main_option("sqlalchemy.url", settings.database_url)
    cfg.set_main_option("script_location", str(Path(__file__).with_name("alembic")))
    command.upgrade(cfg, "head")

if os.getenv("RUN_MIGRATIONS_AT_STARTUP", "false").lower() != "false":
    run_migrations()

app = FastAPI(
    title=settings.project_name,
    openapi_url=settings.openapi_url,
    docs_url=settings.docs_url,
    redoc_url=settings.redoc_url,
)
_default = (
    "https://tsubame-arts.econictek.com,"
    "https://www.tsubame-arts.econictek.com,"
    "http://localhost:8082,http://127.0.0.1:8082,"
)
_allowed = [x.strip() for x in os.getenv("CORS_ORIGINS", _default).split(",") if x.strip()]
_origin_regex = os.getenv("CORS_ORIGIN_REGEX", r"https?://(localhost|127\.0\.0\.1)(:\d+)?$")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=_origin_regex,
)

# API v1 routers under /api
app.include_router(products.router, prefix=settings.api_v1_prefix)
app.include_router(materials.router, prefix=settings.api_v1_prefix)
app.include_router(auth.router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {"message": settings.project_name, "version": "1.0.0", "docs": "/api/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
