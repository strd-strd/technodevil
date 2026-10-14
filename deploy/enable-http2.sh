#!/usr/bin/env bash
# Включить HTTP/2 в nginx vhost technodevil (после certbot).
# Запуск от root: bash /var/www/technodevil/deploy/enable-http2.sh

set -euo pipefail
CONF=/etc/nginx/sites-enabled/technodevil

if [[ ! -f "$CONF" ]]; then
  echo "нет $CONF"
  exit 1
fi

# Бэкап НЕ в sites-enabled — иначе nginx подхватит .bak и упадёт на duplicate listen
cp -a "$CONF" "/root/technodevil.nginx.bak.$(date +%Y%m%d%H%M%S)"

python3 - <<'PY'
from pathlib import Path
path = Path("/etc/nginx/sites-enabled/technodevil")
text = path.read_text()
out = []
for line in text.splitlines(keepends=True):
    stripped = line.lstrip()
    if stripped.startswith("listen") and "443" in stripped and "ssl" in stripped and "http2" not in stripped:
        line = line.replace(" ssl", " ssl http2", 1)
    out.append(line)
path.write_text("".join(out))
print("patched", path)
PY

nginx -t
systemctl reload nginx

echo "--- listen ---"
grep -n listen "$CONF" || true
echo "--- probe ---"
curl -sI --http2 https://technodevil.ru | head -8
