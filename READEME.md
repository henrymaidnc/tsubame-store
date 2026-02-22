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

Certbot
sudo apt update 
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone --preferred-challenges http -d tsubame-arts.econictek.com
sudo certbot --nginx -d tsubame-arts.econictek.com
sudo certbot renew
- Issue the cert:
sudo certbot certonly --webroot -w /var/www/certbot -d tsubame-arts.econictek.com
- Point Nginx to the certs:
ssl_certificate /etc/letsencrypt/live/tsubame-arts.econictek.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/tsubame-arts.econictek.com/privkey.pem;
- Reload Nginx:
sudo nginx -t && sudo nginx -s reload
- If Docker: docker compose exec -T nginx nginx -t && docker compose exec -T nginx nginx -s reload

Renewal hook
- Add a deploy hook to reload Nginx after renewals:
  - sudo crontab -e
  - 12 3 * * * certbot renew --deploy-hook "nginx -s reload"
  - If Docker: certbot renew --deploy-hook "docker compose exec -T nginx nginx -s reload"

## Seed DB and login

Seed the database with users and sample data (safe to run more than once):

**Dev:**
```bash
docker compose up -d   # ensure stack is running
docker compose exec backend python init_db.py
```

**Prod:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
./scripts/init-db-prod.sh   
# or: docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend python init_db.py
```

Then log in via API:

- **POST** `/api/auth/login` with JSON: `{"email":"admin@tsubame.com","password":"admin123"}` (or `user@tsubame.com` / `user123`).
- Use the returned `access_token` in the **Authorization: Bearer &lt;token&gt;** header for protected routes.

## Alembic migrations (manual)

Run schema migrations manually when deploying or after model changes:

Local:
```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

Docker:
```bash
docker compose exec backend alembic upgrade head
```

Troubleshooting:
- To redo last step: `alembic downgrade -1 && alembic upgrade head`
- Show current: `alembic current`
- If you want backend to skip running migrations at startup, set env:
  - `RUN_MIGRATIONS=false` for the backend container entrypoint
  - `RUN_MIGRATIONS_AT_STARTUP=false` to skip the in-app startup hook

In Google Search Console:
- Add and verify the new URL prefix property: https://tsubame-arts.econictek.com/
- Submit the new sitemap: https://tsubame-arts.econictek.com/sitemap.xml
- Request indexing for:
  - https://tsubame-arts.econictek.com/
  - https://tsubame-arts.econictek.com/about
  - https://tsubame-arts.econictek.com/contact
