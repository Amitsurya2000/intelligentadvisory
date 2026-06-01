"use client";

import { useEffect, useState } from "react";

/** Tracks the pointer position in viewport coordinates (throttled to rAF). */
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const handle = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", handle);
    return () => {
      window.removeEventListener("mousemove", handle);
      cancelAnimationFrame(frame);
    };
  }, []);

  return pos;
}
