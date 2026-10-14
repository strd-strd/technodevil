"use client";

import { useState } from "react";

type YoutubeEmbedProps = {
  id: string;
  title?: string;
};

/** Превью вместо iframe — YouTube грузится только по клику. */
export function YoutubeEmbed({ id, title = "TECHNODEVIL" }: YoutubeEmbedProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="youvideo__facade"
      onClick={() => setActive(true)}
      aria-label={`Смотреть: ${title}`}
      style={{
        backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`,
      }}
    >
      <span className="youvideo__play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path
            d="M66.52 7.74a8.3 8.3 0 0 0-5.84-5.88C55.83 1 34 1 34 1S12.17 1 7.32 1.86A8.3 8.3 0 0 0 1.48 7.74C.6 12.66.6 24 .6 24s0 11.34.88 16.26a8.3 8.3 0 0 0 5.84 5.88C12.17 47 34 47 34 47s21.83 0 26.68-.86a8.3 8.3 0 0 0 5.84-5.88C67.4 35.34 67.4 24 67.4 24s0-11.34-.88-16.26Z"
            fill="red"
          />
          <path d="M45 24 27 14v20Z" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}
