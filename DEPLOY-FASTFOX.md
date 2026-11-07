# FastFox RU: TECHNODEVIL

Сервер: `5.44.41.186` (`srv-1793837301`) · SSH `sglonass-fastfox` / root  
Папка: `/var/www/technodevil` · PM2: `technodevil` · порт: **3007**  
Домены: `technodevil.ru` (основной) · `технодьявол.рф` → 301 на `technodevil.ru`

**Не трогать** чужие `/var/www/*`, порты 3000–3006, чужие PM2.

---

## DNS

| Домен | A |
|---|---|
| `technodevil.ru` / `www` | `5.44.41.186` |
| `технодьявол.рф` (`xn--b1adc0ahgc0a2a7e7a.xn--p1ai`) | `5.44.41.186` (иначе certbot/редирект не взлетит) |

---

## Деплой с Mac (rsync)

Сборка на Mac (в проекте `next/font/google` — на RU часто падает).

```bash
cd /Users/udolbaniy/Desktop/WEB2026/technodevil
npm ci && npm run build

ssh sglonass-fastfox 'mkdir -p /var/www/technodevil'

rsync -avz \
  -e "ssh -o IdentitiesOnly=yes" \
  --exclude node_modules \
  --exclude .git \
  --exclude .env.local \
  --exclude '.next/cache' \
  --exclude '.next/dev' \
  /Users/udolbaniy/Desktop/WEB2026/technodevil/ \
  sglonass-fastfox:/var/www/technodevil/
```

Env на сервере (`chmod 600`, не в git):

```bash
ssh sglonass-fastfox 'cat > /var/www/technodevil/.env.local <<EOF
SITE_URL=https://technodevil.ru
RESEND_API_KEY=re_...
LEAD_TO_EMAIL=denis.lishkov@gmail.com
# LEAD_FROM_EMAIL=TECHNODEVIL <noreply@technodevil.ru>
EOF
chmod 600 /var/www/technodevil/.env.local
chown nodejs:nodejs /var/www/technodevil/.env.local'
```

Install + PM2 (без `npm run build` на сервере, если `.next` уже с Mac):

```bash
ssh sglonass-fastfox '
  chown -R nodejs:nodejs /var/www/technodevil
  sudo -u nodejs -H bash -c "cd /var/www/technodevil && npm ci --omit=dev"
  sudo -u nodejs pm2 describe technodevil >/dev/null 2>&1 \
    && sudo -u nodejs pm2 restart technodevil \
    || sudo -u nodejs pm2 start /var/www/technodevil/ecosystem.config.cjs
  sudo -u nodejs pm2 save
  curl -sI http://127.0.0.1:3007 | head
'
```

Nginx + SSL:

```bash
ssh sglonass-fastfox '
  cp /var/www/technodevil/deploy/nginx-technodevil.conf /etc/nginx/sites-available/technodevil
  ln -sf /etc/nginx/sites-available/technodevil /etc/nginx/sites-enabled/technodevil
  nginx -t && systemctl reload nginx
  certbot --nginx \
    -d technodevil.ru -d www.technodevil.ru \
    -d xn--b1adc0ahgc0a2a7e7a.xn--p1ai \
    -d www.xn--b1adc0ahgc0a2a7e7a.xn--p1ai \
    --non-interactive --agree-tos --redirect \
    -m denis.lishkov@gmail.com || true
'
```

Если `технодьявол.рф` ещё не на этот IP — certbot только для `technodevil.ru` / `www`.
