# Tsubame Store

## Dev (local) – no nginx

```bash
docker compose up -d
```

- Frontend: http://localhost:8082  
- API / Swagger: http://localhost:8002/api/docs  
- No port 80, no SSL.

## Prod (server with domain)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

- Adds nginx (80/443).
- See [docs/SSL-and-production.md](docs/SSL-and-production.md) for SSL and Certbot.

## Seed DB and login

Seed the database with users and sample data (safe to run more than once):

**Dev:**
```bash
docker compose up -d   # ensure stack is running
./scripts/init-db.sh   # or: docker compose exec backend python init_db.py
```

**Prod:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
./scripts/init-db-prod.sh   # or: docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend python init_db.py
```

Then log in via API:

- **POST** `/api/auth/login` with JSON: `{"email":"admin@tsubame.com","password":"admin123"}` (or `user@tsubame.com` / `user123`).
- Use the returned `access_token` in the **Authorization: Bearer &lt;token&gt;** header for protected routes.

docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend python init_db.py
