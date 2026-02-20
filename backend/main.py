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

from core.config import settings
from models.database import Base, engine
from api import auth, materials, products

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.project_name,
    openapi_url=settings.openapi_url,
    docs_url=settings.docs_url,
    redoc_url=settings.redoc_url,
)
default_origins = (
    "https://www.tsubame-art.econictek.com,https://tsubame-art.econictek.com"
)
allowed_origins = os.getenv("CORS_ORIGINS", default_origins).split(",")

# CORS configuration for development and production
if os.getenv("ENVIRONMENT") == "production":
    # Production: Use specific origins from environment
    pass
else:
    # Development: Allow all origins
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
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
