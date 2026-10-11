"use client";

import { useCallback, useEffect, useState } from "react";

export function PrivacyLink() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closePopup = useCallback(() => {
    setClosing((isClosing) => {
      if (isClosing) return isClosing;
      window.setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 200);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closePopup]);

  return (
    <>
      <button className="footer__link" type="button" onClick={() => setOpen(true)}>
        Политика конфиденциальности
      </button>
      {open ? (
        <div
          className={`popup ${closing ? "is-closing" : "is-open"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePopup();
          }}
        >
          <div className="popup__content">
            <button className="popup__close" type="button" onClick={closePopup} aria-label="Закрыть">
              X
            </button>
            <div className="popup__title" id="privacy-title">
              Политика конфиденциальности:
            </div>
            <p className="popup__text">Мы сохраняем полную конфиденциальность всех посетителей наших мероприятий.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
