"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";

const links = [
  { href: "#concept", label: "CONCEPT" },
  { href: "#premier", label: "PREMIER" },
  { href: "#promo", label: "PROMO" },
  { href: "#live", label: "TECHNO & LIVE" },
  { href: "#contacts", label: "КОНТАКТЫ" },
];

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setClosing((isClosing) => {
      if (isClosing) return isClosing;
      window.setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 280);
      return true;
    });
  }, []);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
      return;
    }
    setClosing(false);
    setOpen(true);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open || closing) return;
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
  }, [open, closing]);

  return (
    <>
      <button
        className={`header__nav${open && !closing ? " is-open" : ""}`}
        type="button"
        aria-label={open && !closing ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open && !closing}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        <span className="header__nav-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open ? (
        <div className={`nav-drawer${closing ? " is-closing" : " is-open"}`}>
          <button
            className="nav-drawer__backdrop"
            type="button"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          />
          <nav
            id={panelId}
            ref={panelRef}
            className="nav-drawer__panel"
            aria-label="Разделы"
          >
            <button
              className="nav-drawer__close"
              type="button"
              onClick={closeMenu}
              aria-label="Закрыть"
            >
              ×
            </button>
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                style={{ "--i": index } as CSSProperties}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
