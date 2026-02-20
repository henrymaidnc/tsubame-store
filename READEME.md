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

- Adds nginx (80/443) and certbot.
- See [docs/SSL-and-production.md](docs/SSL-and-production.md) for SSL and Certbot.
