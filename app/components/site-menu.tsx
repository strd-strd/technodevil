"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

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
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  return (
    <>
      <button
        className="header__nav"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="header__nav-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      {open ? (
        <nav className={`nav-overlay ${closing ? "is-closing" : "is-open"}`} aria-label="Разделы">
          <button className="nav-overlay__close" type="button" onClick={closeMenu} aria-label="Закрыть">
            X
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
      ) : null}
    </>
  );
}
