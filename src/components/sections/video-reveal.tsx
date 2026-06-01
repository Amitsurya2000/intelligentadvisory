"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const KEYWORDS = [
  { text: "Strategy", className: "left-[6%] top-[18%]" },
  { text: "Technology", className: "right-[6%] top-[18%]" },
  { text: "Growth", className: "left-1/2 top-[7%] -translate-x-1/2" },
  { text: "Transformation", className: "left-[6%] bottom-[18%]" },
  { text: "Innovation", className: "right-[6%] bottom-[18%]" },
];

/* -------------------------------------------------------------------------- */
/*  Background AI-network particle canvas (pauses when off-screen)             */
/* -------------------------------------------------------------------------- */

function useParticleNetwork(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  activeRef: React.RefObject<boolean>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(46, Math.floor((w * h) / 26000));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!activeRef.current) return; // pause work when section is off-screen
      ctx.clearRect(0, 0, w, h);
      const LINK = Math.min(w, h) * 0.14;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(120,200,255,${(1 - d / LINK) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(165,243,252,0.6)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, activeRef, enabled]);
}

/* -------------------------------------------------------------------------- */
/*  Video Reveal — pinned, scroll-scrubbed cinematic sequence                  */
/* -------------------------------------------------------------------------- */

export function VideoReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const active = useRef(false); // true while the section is on-screen
  const [enabledParticles, setEnabledParticles] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  useParticleNetwork(canvasRef, active, enabledParticles);

  // Run particles while the section is on-screen, and pause the video when it
  // scrolls away. The video itself only plays on the user's click — no auto-play.
  useEffect(() => {
    const section = sectionRef.current;
    const v = videoRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        active.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setEnabledParticles(true);
        } else {
          v?.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // The scroll-scrubbed timeline.
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const init = { w: isMobile ? "55%" : "38%", mid: isMobile ? "72%" : "50%", end: isMobile ? "85%" : "60%" };

    // Reduced motion → present the final, balanced state with no scrubbing.
    if (reduced) {
      gsap.set(card, { width: init.end, scale: 1, rotateX: 0, borderRadius: 18 });
      gsap.set([particlesRef.current, beamsRef.current, glowRef.current], { opacity: 1 });
      gsap.set(".vr-keyword", { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(card, { width: init.w, scale: 0.8, rotateX: 8, y: 28, borderRadius: 28 });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set([particlesRef.current, beamsRef.current], { opacity: 0 });
      gsap.set(glowRef.current, { opacity: 0.25, scale: 0.9 });
      gsap.set(".vr-keyword", { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // smooth, premium catch-up
        },
      });

      // PHASE 1 — moves toward you, focus shifts
      tl.to(card, { rotateX: 0, scale: 0.94, y: 0, ease: "power2.out", duration: 1 }, 0)
        .to(backdropRef.current, { opacity: 0.55, duration: 1 }, 0)

        // PHASE 2 — expand, glow, particles + beams + keywords
        .to(card, {
          width: init.mid,
          boxShadow:
            "0 40px 130px -25px rgba(0,0,0,0.85), 0 0 90px -10px rgba(34,211,238,0.4), 0 0 140px -20px rgba(139,92,246,0.3)",
          ease: "power2.inOut",
          duration: 1,
        }, 1)
        .to(glowRef.current, { opacity: 0.8, scale: 1.05, duration: 1 }, 1)
        .to(particlesRef.current, { opacity: 1, duration: 1 }, 1)
        .to(beamsRef.current, { opacity: 0.65, duration: 1 }, 1)
        .to(".vr-keyword", { opacity: 1, y: 0, stagger: 0.18, duration: 0.8 }, 1.05)

        // PHASE 3 — final, balanced size (NOT fullscreen)
        .to(card, { width: init.end, borderRadius: 18, ease: "power2.inOut", duration: 1 }, 2);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="video" className="relative h-[115vh] md:h-[160vh]">
      {/* Pinned stage */}
      <div
        ref={pinRef}
        className="sticky top-0 grid h-[46vh] place-items-center overflow-hidden md:h-[70vh]"
        style={{ perspective: 1200 }}
      >
        {/* Darken backdrop (Phase 1) */}
        <div ref={backdropRef} className="pointer-events-none absolute inset-0 bg-black" aria-hidden />

        {/* BACKGROUND LAYER — AI network particles */}
        <div ref={particlesRef} className="pointer-events-none absolute inset-0 opacity-0" aria-hidden>
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>

        {/* MIDDLE LAYER — light beams */}
        <div ref={beamsRef} className="pointer-events-none absolute inset-0 opacity-0" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[140%] w-[22rem] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-gradient-to-b from-transparent via-brand-cyan/10 to-transparent blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[140%] w-[18rem] -translate-x-1/2 -translate-y-1/2 rotate-[32deg] bg-gradient-to-b from-transparent via-brand-violet/10 to-transparent blur-2xl" />
        </div>

        {/* MIDDLE LAYER — soft glow behind the card */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.22),rgba(139,92,246,0.12)_45%,transparent_70%)] blur-2xl"
          aria-hidden
        />

        {/* Keywords — fade in around the video during the scroll reveal */}
        {KEYWORDS.map((k) => (
          <span
            key={k.text}
            className={`vr-keyword pointer-events-none absolute z-30 hidden font-display text-lg font-semibold uppercase tracking-[0.2em] text-white/70 lg:block ${k.className}`}
            aria-hidden
          >
            {k.text}
          </span>
        ))}

        {/* FOREGROUND LAYER — floating video card */}
        <div className="relative z-20 flex w-full max-w-[1500px] justify-center px-4">
          <motion.div
            className="flex w-full justify-center"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              ref={cardRef}
              style={{ transformOrigin: "center center", transformStyle: "preserve-3d" }}
              className="group glass-strong relative aspect-video max-h-[50vh] w-[38%] overflow-hidden rounded-[24px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 will-change-transform"
            >
              <video
                ref={videoRef}
                src="/vsl.mp4"
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
              <span className="absolute bottom-5 left-6 z-10 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
                Intelligent Advisory
              </span>

              {/* Centered play / pause — fades back while playing, returns on hover */}
              <div
                className={`pointer-events-none absolute inset-0 z-20 grid place-items-center transition-opacity duration-300 ${
                  playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <motion.button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause video" : "Play video"}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="pointer-events-auto relative grid size-16 place-items-center rounded-full border border-white/25 bg-black/40 text-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan sm:size-20"
                >
                  {!playing && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-white/30" />
                  )}
                  {playing ? (
                    <Pause className="size-6 sm:size-7" />
                  ) : (
                    <Play className="size-6 translate-x-0.5 sm:size-7" />
                  )}
                </motion.button>
              </div>

              {/* Mute toggle, bottom-right */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="absolute bottom-4 right-4 z-20 grid size-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
