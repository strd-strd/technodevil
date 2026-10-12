/**
 * Антиспам для публичной формы заявки.
 * Honeypot / нет JS → тихий «успех». Слишком быстро / rate limit → ошибка.
 */

export const HONEYPOT_FIELD = "website";

/** Токен, который выставляет только клиентский JS после монтирования. */
export const JS_CONFIRM_VALUE = "technodevil";

/** Минимум времени от открытия формы до отправки, мс. */
export const MIN_SUBMIT_MS = 2800;

const RATE_BUCKETS = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first.slice(0, 64);
    }
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) {
    return real.slice(0, 64);
  }
  return "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(key);
  if (!bucket || now >= bucket.resetAt) {
    RATE_BUCKETS.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isMissingJsConfirm(value: unknown): boolean {
  return value !== JS_CONFIRM_VALUE;
}

export function isSubmitTooFast(startedAt: unknown, now = Date.now()): boolean {
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return true;
  }
  if (startedAt > now + 5_000) {
    return true;
  }
  return now - startedAt < MIN_SUBMIT_MS;
}

export function isPlausibleName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) {
    return false;
  }
  if (/https?:\/\//i.test(trimmed) || /www\./i.test(trimmed)) {
    return false;
  }
  return true;
}

export function isPlausibleEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 200) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export type SpamVerdict =
  | { ok: true }
  | { ok: false; soft: true; reason: string }
  | { ok: false; soft: false; reason: string; status: number; message: string };

type GuardInput = {
  honeypot: unknown;
  jsConfirm: unknown;
  startedAt: unknown;
  rateKey: string;
  rateLimit?: number;
  rateWindowMs?: number;
};

export function guardPublicForm(input: GuardInput): SpamVerdict {
  if (isHoneypotTriggered(input.honeypot)) {
    return { ok: false, soft: true, reason: "honeypot" };
  }
  if (isMissingJsConfirm(input.jsConfirm)) {
    return { ok: false, soft: true, reason: "no_js" };
  }
  if (isSubmitTooFast(input.startedAt)) {
    return {
      ok: false,
      soft: false,
      reason: "too_fast",
      status: 400,
      message: "Отправьте форму ещё раз через пару секунд.",
    };
  }
  const limit = input.rateLimit ?? 6;
  const windowMs = input.rateWindowMs ?? 15 * 60 * 1000;
  if (!checkRateLimit(input.rateKey, limit, windowMs)) {
    return {
      ok: false,
      soft: false,
      reason: "rate_limit",
      status: 429,
      message: "Слишком много заявок. Подождите несколько минут.",
    };
  }
  return { ok: true };
}
