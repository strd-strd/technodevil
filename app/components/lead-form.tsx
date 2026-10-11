"use client";

import { useState, type FormEvent } from "react";

export function LeadForm() {
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSent(true);
    setShake(true);
    form.reset();
    window.setTimeout(() => setShake(false), 500);
    window.alert("ТЕХНОДЬЯВОЛ скоро свяжется с вами.");
  }

  return (
    <form className={`feedback__form ${shake ? "is-sent" : ""}`} onSubmit={onSubmit}>
      <h3 className="feedback__title">Хотите посетить наше шоу?</h3>
      <p className="feedback__text">Оставьте заявку и мы свяжемся с вами.</p>
      <input className="feedback__input" type="text" name="name" placeholder="Имя:" required autoComplete="name" />
      <input className="feedback__input" type="email" name="email" placeholder="E-mail:" required autoComplete="email" />
      <button className="outline-btn feedback__btn" type="submit">
        ОТПРАВИТЬ
      </button>
      {sent ? <p className="form-note is-visible">ТЕХНОДЬЯВОЛ скоро свяжется с вами.</p> : null}
    </form>
  );
}
