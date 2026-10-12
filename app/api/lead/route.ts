import {
  getClientIp,
  guardPublicForm,
  HONEYPOT_FIELD,
  isPlausibleEmail,
  isPlausibleName,
} from "@/lib/antispam";
import { sendLeadEmail } from "@/lib/lead-mail";

export const runtime = "nodejs";

function softOk() {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return Response.json({ error: "Некорректный запрос." }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    const ip = getClientIp(request);
    const verdict = guardPublicForm({
      honeypot: payload[HONEYPOT_FIELD],
      jsConfirm: payload.td_confirm,
      startedAt:
        typeof payload.startedAt === "number"
          ? payload.startedAt
          : Number(payload.startedAt),
      rateKey: `lead:${ip}`,
      rateLimit: 6,
      rateWindowMs: 15 * 60 * 1000,
    });

    if (!verdict.ok) {
      if (verdict.soft) {
        return softOk();
      }
      return Response.json(
        { error: verdict.message },
        { status: verdict.status },
      );
    }

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const email = typeof payload.email === "string" ? payload.email.trim() : "";

    if (!isPlausibleName(name)) {
      return Response.json({ error: "Укажите имя." }, { status: 400 });
    }
    if (!isPlausibleEmail(email)) {
      return Response.json(
        { error: "Укажите корректный e-mail." },
        { status: 400 },
      );
    }

    const mailed = await sendLeadEmail({ name, email });
    if (!mailed.ok) {
      return Response.json(
        {
          error:
            "Не удалось отправить заявку. Напишите нам напрямую на почту.",
        },
        { status: 503 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    console.error("[technodevil] lead_failed");
    return Response.json(
      { error: "Не удалось отправить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }
}
