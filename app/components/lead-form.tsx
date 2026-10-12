"use client";

import { useCallback, useState, type FormEvent } from "react";
import { FormGuardFields, useFormGuard } from "@/app/components/form-guard-fields";
import { HONEYPOT_FIELD } from "@/lib/antispam";

export function LeadForm() {
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    startedAt,
    honeypot,
    setHoneypot,
    jsConfirm,
    setJsConfirm,
  } = useFormGuard();
  const onJsConfirmReady = useCallback(
    (value: string) => setJsConfirm(value),
    [setJsConfirm],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (name.length < 2) {
      setError("Укажите имя.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Укажите корректный e-mail.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          [HONEYPOT_FIELD]: honeypot,
          startedAt,
          td_confirm: jsConfirm,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          typeof (payload as { error?: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Не удалось отправить заявку. Попробуйте позже.";
        setError(message);
        setSubmitting(false);
        return;
      }

      setSent(true);
      setShake(true);
      form.reset();
      window.setTimeout(() => setShake(false), 500);
      setSubmitting(false);
    } catch {
      setError("Не удалось отправить заявку. Проверьте соединение.");
      setSubmitting(false);
    }
  }

  return (
    <form
      className={`feedback__form ${shake ? "is-sent" : ""}`}
      onSubmit={onSubmit}
      noValidate
    >
      <h3 className="feedback__title">Хотите посетить наше шоу?</h3>
      <p className="feedback__text">Оставьте заявку и мы свяжемся с вами.</p>
      <FormGuardFields
        startedAt={startedAt}
        honeypot={honeypot}
        onHoneypotChange={setHoneypot}
        jsConfirm={jsConfirm}
        onJsConfirmReady={onJsConfirmReady}
      />
      <input
        className="feedback__input"
        type="text"
        name="name"
        placeholder="Имя:"
        required
        autoComplete="name"
        disabled={submitting || sent}
      />
      <input
        className="feedback__input"
        type="email"
        name="email"
        placeholder="E-mail:"
        required
        autoComplete="email"
        disabled={submitting || sent}
      />
      <button
        className="outline-btn feedback__btn"
        type="submit"
        disabled={submitting || sent}
      >
        {submitting ? "ОТПРАВКА…" : "ОТПРАВИТЬ"}
      </button>
      {error ? <p className="form-error is-visible">{error}</p> : null}
      {sent ? (
        <p className="form-note is-visible">
          ТЕХНОДЬЯВОЛ скоро свяжется с вами.
        </p>
      ) : null}
    </form>
  );
}
