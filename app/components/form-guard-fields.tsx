"use client";

import { useEffect, useState } from "react";
import { HONEYPOT_FIELD, JS_CONFIRM_VALUE } from "@/lib/antispam";

type FormGuardFieldsProps = {
  startedAt: number;
  honeypot: string;
  onHoneypotChange: (value: string) => void;
  jsConfirm: string;
  onJsConfirmReady: (value: string) => void;
};

/** Невидимые поля: honeypot + JS-confirm после монтирования. */
export function FormGuardFields({
  startedAt,
  honeypot,
  onHoneypotChange,
  jsConfirm,
  onJsConfirmReady,
}: FormGuardFieldsProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onJsConfirmReady(JS_CONFIRM_VALUE);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [onJsConfirmReady]);

  return (
    <>
      <div className="td-hp" aria-hidden="true">
        <label>
          Сайт
          <input
            type="text"
            name={HONEYPOT_FIELD}
            value={honeypot}
            onChange={(event) => onHoneypotChange(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={String(startedAt)} readOnly />
      <input type="hidden" name="td_confirm" value={jsConfirm} readOnly />
    </>
  );
}

export function useFormGuard() {
  const [startedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [jsConfirm, setJsConfirm] = useState("");

  return {
    startedAt,
    honeypot,
    setHoneypot,
    jsConfirm,
    setJsConfirm,
  };
}
