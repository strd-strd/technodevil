# Beget VPS: TECHNODEVIL рядом с lishkov / ollmet

Сервер: `82.202.129.89` · Termius **root** (`jocuqftino`) · GitHub `strd-strd/technodevil`

**Соседство:** не трогать `/var/www/html` (proect-1 :3000) и `/var/www/ollmet` (:3001).

| | technodevil | ollmet | lishkov |
|---|---|---|---|
| Папка | `/var/www/technodevil` | `/var/www/ollmet` | `/var/www/html` |
| Порт | **3002** | 3001 | 3000 |
| PM2 | `technodevil` | `ollmet` | `proect-1` |
| Домены | technodevil.ru · technodevil.net · технодьявол.рф | олл-мет.рф | lishkov.com |

Punycode: `технодьявол.рф` → `xn--b1adc0ahgc0a2a7e7a.xn--p1ai`

---

## DNS (панель Beget, до certbot)

Для **каждого** домена (`technodevil.ru`, `technodevil.net`, `технодьявол.рф`) A-запись `@` (и `www`, если есть) → **`82.202.129.89`**.

Проверка с Mac:

```bash
dig +short technodevil.ru A
dig +short technodevil.net A
dig +short xn--b1adc0ahgc0a2a7e7a.xn--p1ai A
# все три → 82.202.129.89
```

Пока DNS на `45.130.41.22` — старый shared-сайт. После смены DNS старые файлы на shared можно удалить.

---

## Первый перенос (Termius, root)

Нужен GitHub PAT (classic, scope `repo`) и `git-lfs` на сервере (в репо большое mp4).

```bash
# LFS один раз, если ещё нет:
command -v git-lfs || (curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash && apt-get install -y git-lfs)
git lfs install

git config --global --add safe.directory /var/www/technodevil
git config --global credential.helper store

cd /var/www
git clone https://github.com/strd-strd/technodevil.git technodevil
# login: strd-strd · password: PAT
cd /var/www/technodevil && git lfs pull
chown -R nodejs:nodejs /var/www/technodevil

sudo -u nodejs -H bash -c 'cd /var/www/technodevil && rm -rf .next && npm ci && npm run build'
echo "build exit: $?"
# только если 0:
sudo -u nodejs -H bash -c 'cd /var/www/technodevil && pm2 start ecosystem.config.cjs'
sudo -u nodejs pm2 save
curl -sI http://127.0.0.1:3002 | head

cp /var/www/technodevil/deploy/nginx-technodevil.conf /etc/nginx/sites-available/technodevil
ln -sf /etc/nginx/sites-available/technodevil /etc/nginx/sites-enabled/technodevil
nginx -t && systemctl reload nginx
```

SSL **после** DNS → VPS:

```bash
certbot --nginx \
  -d technodevil.ru -d www.technodevil.ru \
  -d technodevil.net -d www.technodevil.net \
  -d xn--b1adc0ahgc0a2a7e7a.xn--p1ai \
  -d www.xn--b1adc0ahgc0a2a7e7a.xn--p1ai
```

Если `www` нет в зоне — убрать соответствующие `-d`.

---

## Env: заявки на почту

Файл `/var/www/technodevil/.env.local` (`chmod 600`, git не затирает):

```
RESEND_API_KEY=re_...
LEAD_TO_EMAIL=denis.lishkov@gmail.com
# LEAD_FROM_EMAIL=TECHNODEVIL <noreply@technodevil.ru>
```

Ключ можно взять с ollmet: `grep RESEND /var/www/ollmet/.env.local`  
После смены env — полная пересборка и `pm2 restart technodevil`.

---

## Обычный деплой (после правок на Mac)

```bash
# Mac:
git push origin main
```

На VPS:

```bash
cd /var/www/technodevil
git fetch origin
git reset --hard origin/main
git lfs pull
chown -R nodejs:nodejs /var/www/technodevil
sudo -u nodejs -H bash -c 'cd /var/www/technodevil && rm -rf .next && npm ci && npm run build'
# только если exit 0:
sudo -u nodejs pm2 restart technodevil
sudo -u nodejs pm2 save
curl -sI http://127.0.0.1:3002 | head
```

Логи: `sudo -u nodejs pm2 logs technodevil --lines 30 --nostream`
