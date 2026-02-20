# Tsubame Store Backend

FastAPI backend with **BaseCRUD** pattern, SQLAlchemy, and PostgreSQL. Structure follows [FastAPI bigger applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/) best practices.

## Project structure

```
backend/
├── main.py           # FastAPI app, mounts API under /api
├── core/             # Config and dependencies
│   ├── config.py     # Settings (DB, API prefix, auth)
│   └── deps.py       # get_db, etc.
├── crud/             # BaseCRUD + per-entity CRUD
│   ├── base.py       # Generic BaseCRUD[Model, CreateSchema, UpdateSchema]
│   ├── product.py    # product_crud
│   └── material.py   # material_crud
├── api/              # Routers (auth, products, materials)
├── models/           # SQLAlchemy models + Pydantic schemas
├── services/         # Auth helpers (password, JWT) — used by api/auth
└── dependencies.py   # Re-exports core.deps (backward compat)
```

## Testing in Swagger

- **With Docker Compose (Nginx):**  
  - API: `http://localhost/api`  
  - **Swagger UI:** `http://localhost/api/docs`  
  - ReDoc: `http://localhost/api/redoc`  
  - OpenAPI JSON: `http://localhost/api/openapi.json`

- **Backend only (no Nginx):**  
  - **Swagger UI:** `http://localhost:8002/api/docs`  
  - (Backend exposed on port 8002 when running `docker compose up`)

In Swagger you can try **GET /api/products**, **POST /api/auth/login**, then use **Authorize** with the returned Bearer token for **GET /api/auth/me**.

## BaseCRUD pattern (scaling retail modules)

`crud/base.py` defines a generic `BaseCRUD[ModelT, CreateSchemaT, UpdateSchemaT]` with:

- `get_multi(db, skip, limit, **filters)`
- `get(db, id)` / `get_or_404(db, id, detail=...)`
- `create(db, schema=...)`
- `update(db, id, schema=..., detail=...)`
- `delete(db, id, detail=...)`

To add a new module (e.g. Distributors):

1. Add `DistributorCreate` / `DistributorUpdate` in `models/schemas.py`.
2. Add `crud/distributor.py`:  
   `class DistributorCRUD(BaseCRUD[Distributor, DistributorCreate, DistributorUpdate]): __model__ = Distributor`  
   and `distributor_crud = DistributorCRUD()`.
3. Add `api/distributors.py` with router using `distributor_crud`.
4. In `main.py`: `app.include_router(distributors.router, prefix=settings.api_v1_prefix)`.

## Setup

```bash
pip install -r requirements.txt
python main.py   # or: uvicorn main:app --host 0.0.0.0 --port 8001
```

With Docker Compose (see repo root): Nginx proxies `/api/` to the backend; use `http://localhost/api/docs` for Swagger.

## Default users (after init_db)

- **Admin:** admin@tsubame.com / admin123  
- **User:** user@tsubame.com / user123  

## Environment variables

- `SECRET_KEY` – JWT secret (change in production)  
- `POSTGRES_*` / `DATABASE_URL` – PostgreSQL connection  
- `API_V1_PREFIX` – default `/api`  
- `ACCESS_TOKEN_EXPIRE_MINUTES` – JWT expiry  
