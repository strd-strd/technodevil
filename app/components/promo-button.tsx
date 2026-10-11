"use client";

import { useCallback, useEffect, useState } from "react";

export function PromoButton() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeModal = useCallback(() => {
    setClosing((isClosing) => {
      if (isClosing) return isClosing;
      window.setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 220);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  return (
    <>
      <button className="outline-btn video-popup" type="button" onClick={() => setOpen(true)}>
        <svg width="19" height="23" viewBox="0 0 19 23" fill="none" aria-hidden="true">
          <path d="M19 11.5L0.25 22.3253L0.25 0.674683L19 11.5Z" fill="#ce0f0c" />
        </svg>
        <span>PLAY PROMO</span>
      </button>
      {open ? (
        <div
          className={`video-modal ${closing ? "is-closing" : "is-open"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Промо"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <button className="video-modal__close" type="button" onClick={closeModal} aria-label="Закрыть">
            X
          </button>
          <video src="/video/TD_PROMO_2019.mp4" controls autoPlay playsInline />
        </div>
      ) : null}
    </>
  );
}
