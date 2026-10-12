import { Resend } from "resend";

const BRAND = "TECHNODEVIL";

export type LeadMailPayload = {
  name: string;
  email: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function parseLeadRecipients(raw: string | undefined): string[] {
  const fallback = "denis.lishkov@gmail.com";
  const source = (raw?.trim() || fallback).slice(0, 500);
  const list = source
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter((part) => part.includes("@") && part.length <= 200)
    .slice(0, 5);
  return list.length > 0 ? list : [fallback];
}

export async function sendLeadEmail(
  payload: LeadMailPayload,
): Promise<{ ok: true } | { ok: false; code: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = parseLeadRecipients(process.env.LEAD_TO_EMAIL);
  const from =
    process.env.LEAD_FROM_EMAIL?.trim() ||
    `${BRAND} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.error("[technodevil] lead_mail_unconfigured");
    return { ok: false, code: "lead_mail_unconfigured" };
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `Заявка TECHNODEVIL: ${payload.name.slice(0, 60)}`;
    const text = [
      `Имя: ${payload.name}`,
      `E-mail: ${payload.email}`,
      "",
      `Сайт: ${BRAND}`,
    ].join("\n");
    const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;font-size:15px;color:#111;line-height:1.45;">
<p style="margin:0 0 12px;"><b>${BRAND}</b> — заявка с сайта</p>
<table style="border-collapse:collapse;width:100%;max-width:36rem;">
<tr><td style="padding:6px 0;color:#667;"><b>Имя</b></td><td style="padding:6px 0;">${escapeHtml(payload.name)}</td></tr>
<tr><td style="padding:6px 0;color:#667;"><b>E-mail</b></td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
</table>
</body></html>`;

    let sent = 0;
    for (const recipient of to) {
      const result = await resend.emails.send({
        from,
        to: [recipient],
        subject,
        text,
        html,
        replyTo: payload.email,
      });
      if (result.error) {
        console.error("[technodevil] lead_mail_provider", {
          to: recipient,
          provider: result.error.name ?? "resend",
        });
        continue;
      }
      sent += 1;
    }

    if (sent === 0) {
      return { ok: false, code: "lead_mail_provider" };
    }
    return { ok: true };
  } catch {
    console.error("[technodevil] lead_mail_failed");
    return { ok: false, code: "lead_mail_failed" };
  }
}
