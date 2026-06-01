"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/**
 * Simple, compact inline VSL video (King-Kong style) — sits in normal page
 * flow, no pinning / scroll-scrub. Plays only on click; pauses when scrolled
 * off-screen. Centered animated play button + mute control.
 */
export function VideoReveal() {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Pause when scrolled off-screen (saves CPU). Never auto-plays.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section id="video" className="relative overflow-hidden py-12 md:py-20">
      {/* soft glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.14),rgba(139,92,246,0.08)_50%,transparent_72%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="group glass-strong relative aspect-video w-full overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
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
          <span className="absolute bottom-4 left-5 z-10 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
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
              className="pointer-events-auto relative grid size-16 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-brand-cyan/60 hover:text-brand-cyan"
            >
              {!playing && (
                <span className="absolute inset-0 animate-ping rounded-full border border-white/30" />
              )}
              {playing ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 translate-x-0.5" />
              )}
            </motion.button>
          </div>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute bottom-4 right-4 z-20 grid size-9 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
