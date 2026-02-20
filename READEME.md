docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d tsubame-art.econictek.com \
  --email cheltonamai@gmail.com --agree-tos --no-eff-email