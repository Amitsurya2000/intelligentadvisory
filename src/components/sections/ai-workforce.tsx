"use client";

import { useEffect, useRef } from "react";

/* AIWorkforce — full-bleed cinematic hero background (Canvas 2D).
   "Your AI Workforce" operations center: a pulsing INTELLIGENCE CORE acts as the
   brain; five named AI agents orbit it in harmony, each cycling an activity
   micro-label. Labelled task chips stream in from the right and are CAUGHT by the
   agent that handles their source type; that agent lights with a ripple and fires
   a glowing comet packet onward to the exact destination SYSTEM row in a
   holographic command-center panel, whose KPI counters tick UP on arrival. A
   subtle operator is implied at the command desk (supervising, not doing the
   repetitive work). Activity stays right/center; the left stays near-black so the
   headline reads. Seamless, pooled, 60fps. No three.js / WebGL / assets. */

const CYAN = "34,211,238";
const VIOLET = "139,92,246";
const FUCHSIA = "217,70,239";
const SLATE = "148,163,184";

type AgentDef = {
  name: string;
  color: string;
  acts: readonly string[];
  dest: string; // destination system label for routed work
  sources: readonly string[]; // task types this agent plausibly catches
};

const AGENTS: readonly AgentDef[] = [
  { name: "AI SALES", color: CYAN, acts: ["Qualifying lead", "Updating CRM", "Assigning"], dest: "CRM", sources: ["WEBSITE LEAD", "WHATSAPP"] },
  { name: "AI MARKETING", color: VIOLET, acts: ["Building campaign", "Analyzing traffic", "Optimizing"], dest: "DASHBOARD", sources: ["MARKETING REQ", "EMAIL"] },
  { name: "AI SUPPORT", color: FUCHSIA, acts: ["Answering", "Resolving ticket", "Handling FAQ"], dest: "RESOLUTION", sources: ["SUPPORT TICKET", "WHATSAPP"] },
  { name: "AI OPERATIONS", color: CYAN, acts: ["Processing workflow", "Moving data", "Automating"], dest: "PIPELINE", sources: ["DOCUMENT", "EMAIL"] },
  { name: "AI ANALYTICS", color: VIOLET, acts: ["Generating report", "Tracking KPIs", "Producing insight"], dest: "REPORTS", sources: ["REPORT", "DOCUMENT"] },
] as const;

type Kpi = { label: string; value: number; step: number; color: string; flash: number };

const TAU = Math.PI * 2;

function AIWorkforceImpl(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const c = ctx;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let mobile = false;

  // geometry (recomputed on resize)
  let coreX = 0;
  let coreY = 0;
  let agentR = 0;
  // base orbit anchors; live positions add a gentle harmonic bob each frame
  const agentBase: { ang: number; x: number; y: number }[] = [];
  const agentPos: { x: number; y: number }[] = [];

  // command-center panel rect + per-KPI landing anchors (set during panel draw)
  let panel = { x: 0, y: 0, w: 0, h: 0 };
  const kpiAnchor: { x: number; y: number }[] = [];

  // KPI state — counters tick UP in real time, flashing on packet arrival
  const kpis: Kpi[] = [
    { label: "TASKS COMPLETED", value: 18420, step: 5, color: CYAN, flash: 0 },
    { label: "LEADS QUALIFIED", value: 3127, step: 2, color: VIOLET, flash: 0 },
    { label: "MESSAGES ANSWERED", value: 41980, step: 8, color: FUCHSIA, flash: 0 },
    { label: "REPORTS GENERATED", value: 942, step: 1, color: CYAN, flash: 0 },
    { label: "WORKFLOWS AUTOMATED", value: 5610, step: 3, color: VIOLET, flash: 0 },
  ];
  for (let i = 0; i < kpis.length; i++) kpiAnchor.push({ x: 0, y: 0 });
  let lastTick = -1e9;

  // map a destination system to the KPI it credits on arrival
  function kpiForDest(dest: string): number {
    switch (dest) {
      case "CRM":
        return 1; // leads qualified
      case "RESOLUTION":
        return 2; // messages answered
      case "REPORTS":
        return 3; // reports generated
      case "PIPELINE":
        return 4; // workflows automated
      default:
        return 0; // tasks completed (dashboard etc.)
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    mobile = w < 768;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    coreX = w * 0.6;
    coreY = h * (mobile ? 0.46 : 0.5);
    agentR = Math.min(w * 0.42, h) * (mobile ? 0.26 : 0.27);

    // agents orbit on the right hemisphere only, evenly spaced in harmony
    agentBase.length = 0;
    agentPos.length = 0;
    const a0 = -Math.PI * 0.62;
    const a1 = Math.PI * 0.62;
    const n = AGENTS.length;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const ang = a0 + (a1 - a0) * t;
      const x = coreX + Math.cos(ang) * agentR;
      const y = coreY + Math.sin(ang) * agentR;
      agentBase.push({ ang, x, y });
      agentPos.push({ x, y });
    }

    // holographic command-center panel: top-right
    const pw = mobile ? Math.min(w * 0.5, 240) : Math.min(w * 0.32, 360);
    const ph = mobile ? 156 : 210;
    panel = { x: w - pw - (mobile ? 14 : 32), y: mobile ? 16 : 28, w: pw, h: ph };
  }

  // ---- pools / schedule ----
  type Chip = { label: string; born: number; dur: number; sy: number; target: number; active: boolean };
  type Packet = {
    ax: number; ay: number; bx: number; by: number;
    born: number; dur: number; color: string; bow: number;
    kpi: number; arrived: boolean; active: boolean;
  };

  const chips: Chip[] = [];
  const packets: Packet[] = [];
  for (let i = 0; i < 14; i++) chips.push({ label: "", born: 0, dur: 0, sy: 0, target: 0, active: false });
  for (let i = 0; i < 48; i++)
    packets.push({ ax: 0, ay: 0, bx: 0, by: 0, born: 0, dur: 0, color: CYAN, bow: 0, kpi: 0, arrived: false, active: false });

  // per-agent lit intensity + incoming "catch" ripple
  const agentLit = new Float32Array(AGENTS.length);
  const agentCatch = new Float32Array(AGENTS.length);

  let lastSpawn = -1e9;
  let lastBeat = -1e9;

  const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // cached radial gradients (NO shadowBlur in hot path)
  type GradCache = Record<string, CanvasGradient>;
  const glowCache: GradCache = {};
  function glow(x: number, y: number, r: number, color: string, alpha: number) {
    const key = `${color}|${alpha.toFixed(2)}|${Math.round(r)}`;
    let g = glowCache[key];
    if (!g) {
      g = c.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${color},${alpha})`);
      g.addColorStop(1, `rgba(${color},0)`);
      glowCache[key] = g;
    }
    c.save();
    c.translate(x, y);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fill();
    c.restore();
  }

  // gentle harmonic orbit bob so the agents read as alive/in-harmony (not static)
  function updateAgentPositions(now: number) {
    for (let i = 0; i < agentBase.length; i++) {
      const b = agentBase[i];
      const drift = mobile ? 2.5 : 4.5;
      const swing = Math.sin(now / 2600 + i * 1.4) * drift;
      const radial = Math.cos(now / 3300 + i * 0.9) * drift * 0.6;
      agentPos[i].x = b.x + Math.cos(b.ang) * radial - Math.sin(b.ang) * swing;
      agentPos[i].y = b.y + Math.sin(b.ang) * radial + Math.cos(b.ang) * swing;
    }
  }

  // A task chip streams in, assigned to an agent that handles its source type.
  function spawnChip(now: number) {
    const ch = chips.find((k) => !k.active);
    if (!ch) return;
    const ai = Math.floor(Math.random() * AGENTS.length);
    const def = AGENTS[ai];
    ch.active = true;
    ch.label = def.sources[Math.floor(Math.random() * def.sources.length)];
    ch.born = now;
    ch.dur = mobile ? 2200 : 2600;
    ch.target = ai;
    ch.sy = agentPos[ai].y + (Math.random() - 0.5) * (mobile ? 30 : 50);
  }

  // When a chip reaches its agent: light the agent and route a packet to a system.
  function deliverToAgent(ai: number, now: number) {
    agentLit[ai] = 1;
    agentCatch[ai] = 1;
    const def = AGENTS[ai];
    const a = agentPos[ai];
    const p = packets.find((k) => !k.active);
    if (!p) return;
    const kpiIdx = kpiForDest(def.dest);
    p.active = true;
    p.arrived = false;
    p.ax = a.x;
    p.ay = a.y;
    p.bx = kpiAnchor[kpiIdx].x || panel.x + 14;
    p.by = kpiAnchor[kpiIdx].y || panel.y + panel.h * 0.6;
    p.born = now;
    p.dur = mobile ? 760 : 880;
    p.color = def.color;
    p.bow = (Math.random() - 0.5) * (mobile ? 36 : 64);
    p.kpi = kpiIdx;
  }

  // ---- drawing helpers ----
  function roundRect(x: number, y: number, rw: number, rh: number, r: number) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + rw, y, x + rw, y + rh, r);
    c.arcTo(x + rw, y + rh, x, y + rh, r);
    c.arcTo(x, y + rh, x, y, r);
    c.arcTo(x, y, x + rw, y, r);
    c.closePath();
  }

  function drawAtmosphere() {
    c.fillStyle = "#05060c";
    c.fillRect(0, 0, w, h);
    // soft cinematic glow right-of-center
    const g = c.createRadialGradient(w * 0.64, h * 0.46, 0, w * 0.64, h * 0.46, w * 0.6);
    g.addColorStop(0, `rgba(${VIOLET},0.16)`);
    g.addColorStop(0.5, `rgba(${CYAN},0.05)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    // dot lattice on the right, alpha-masked toward the left
    const cell = 16;
    const startX = Math.floor(w * 0.42);
    c.fillStyle = `rgba(${SLATE},1)`;
    for (let x = startX; x < w; x += cell) {
      const mask = Math.min(1, (x - w * 0.42) / (w * 0.3));
      for (let y = cell; y < h; y += cell) {
        c.globalAlpha = 0.05 * mask;
        c.fillRect(x, y, 1, 1);
      }
    }
    c.globalAlpha = 1;
  }

  function drawConnectors(now: number) {
    c.lineWidth = 1;
    // core <-> agent spokes, brighter while the agent is lit + a travelling bead
    for (let i = 0; i < AGENTS.length; i++) {
      const lit = agentLit[i];
      const a = agentPos[i];
      c.strokeStyle = `rgba(${AGENTS[i].color},${0.06 + lit * 0.2})`;
      c.beginPath();
      c.moveTo(coreX, coreY);
      c.lineTo(a.x, a.y);
      c.stroke();
      // ambient bead drifting core -> agent (the workforce stays in motion)
      const bead = (now / 2600 + i * 0.31) % 1;
      const bx = lerp(coreX, a.x, bead);
      const by = lerp(coreY, a.y, bead);
      c.beginPath();
      c.arc(bx, by, 1.4, 0, TAU);
      c.fillStyle = `rgba(${AGENTS[i].color},${0.25 + lit * 0.4})`;
      c.fill();
      // on catch, send a brief acknowledgment pulse back toward the core
      if (lit > 0.03) {
        const ack = (1 - lit);
        const px = lerp(a.x, coreX, ack);
        const py = lerp(a.y, coreY, ack);
        c.beginPath();
        c.arc(px, py, 1.8, 0, TAU);
        c.fillStyle = `rgba(${AGENTS[i].color},${0.5 * lit})`;
        c.fill();
      }
    }
    // faint agent -> panel rails (the data spine of the dashboard)
    c.strokeStyle = `rgba(${SLATE},0.05)`;
    for (let i = 0; i < AGENTS.length; i++) {
      const a = agentPos[i];
      c.beginPath();
      c.moveTo(a.x, a.y);
      const mx = (a.x + panel.x) / 2;
      c.quadraticCurveTo(mx, a.y - 20, panel.x + 14, panel.y + panel.h * 0.6);
      c.stroke();
    }
  }

  function drawCore(now: number) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 850);
    const R = (mobile ? 36 : 50) * (1 + pulse * 0.05);
    // breathing brain glow (cached)
    glow(coreX, coreY, R * 3.4, VIOLET, 0.18 + pulse * 0.07);
    glow(coreX, coreY, R * 1.6, CYAN, 0.1);
    // rotating tri-color rim
    const rot = now / 2600;
    const rim = c.createLinearGradient(
      coreX + Math.cos(rot) * R,
      coreY + Math.sin(rot) * R,
      coreX - Math.cos(rot) * R,
      coreY - Math.sin(rot) * R
    );
    rim.addColorStop(0, `rgba(${CYAN},0.95)`);
    rim.addColorStop(0.5, `rgba(${VIOLET},0.95)`);
    rim.addColorStop(1, `rgba(${FUCHSIA},0.95)`);
    c.lineWidth = 2;
    c.strokeStyle = rim;
    c.beginPath();
    c.arc(coreX, coreY, R, 0, TAU);
    c.stroke();

    // inner glass hex (the "brain")
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + rot * 0.4;
      const px = coreX + Math.cos(a) * R * 0.72;
      const py = coreY + Math.sin(a) * R * 0.72;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
    c.fillStyle = `rgba(${CYAN},0.07)`;
    c.fill();
    c.lineWidth = 1;
    c.strokeStyle = `rgba(${CYAN},0.45)`;
    c.stroke();

    // synaptic inner spokes
    c.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU - rot * 0.7;
      c.strokeStyle = `rgba(${VIOLET},${0.1 + 0.1 * Math.sin(now / 600 + i)})`;
      c.beginPath();
      c.moveTo(coreX, coreY);
      c.lineTo(coreX + Math.cos(a) * R * 0.6, coreY + Math.sin(a) * R * 0.6);
      c.stroke();
    }

    // heartbeat ring on inhale cadence
    const beat = ((now - lastBeat) % 2200) / 1100;
    if (beat < 1) {
      c.beginPath();
      c.arc(coreX, coreY, R + beat * R * 2.2, 0, TAU);
      c.strokeStyle = `rgba(${CYAN},${0.22 * (1 - beat)})`;
      c.lineWidth = 1.5;
      c.stroke();
    }

    c.fillStyle = "rgba(226,232,240,0.62)";
    c.font = `700 ${mobile ? 8 : 10}px ui-monospace, monospace`;
    c.textAlign = "center";
    c.fillText("INTELLIGENCE CORE", coreX, coreY + R + 16);
  }

  // A refined, understated command desk + operator glyph below the core.
  // The human supervises; the AI does the repetitive work.
  function drawOperator(now: number) {
    if (mobile) return;
    const ox = coreX;
    const oy = coreY + agentR + 34;
    const breathe = 0.5 + 0.5 * Math.sin(now / 1700);

    // desk arc (the command console) + soft holographic glow
    c.strokeStyle = `rgba(${CYAN},${0.16 + breathe * 0.08})`;
    c.lineWidth = 1.4;
    c.beginPath();
    c.arc(ox, oy, 30, Math.PI * 1.08, Math.PI * 1.92);
    c.stroke();
    glow(ox, oy - 4, 46, CYAN, 0.05 + breathe * 0.03);

    // operator silhouette — head + shoulders, minimal, not a robot
    c.strokeStyle = `rgba(${SLATE},0.5)`;
    c.fillStyle = `rgba(${SLATE},0.12)`;
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(ox, oy - 12, 5, 0, TAU); // head
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(ox, oy + 6, 12, Math.PI * 1.15, Math.PI * 1.85); // shoulders
    c.stroke();

    c.fillStyle = `rgba(${SLATE},0.4)`;
    c.font = "600 8px ui-monospace, monospace";
    c.textAlign = "center";
    c.fillText("YOU · SUPERVISING", ox, oy + 30);
  }

  function drawChips(now: number) {
    const maxN = mobile ? 4 : 7;
    let drawn = 0;
    for (const ch of chips) {
      if (!ch.active) continue;
      const t = (now - ch.born) / ch.dur;
      if (t >= 1) {
        // chip reached its agent — hand off the work, fire the packet onward
        deliverToAgent(ch.target, ch.born + ch.dur);
        ch.active = false;
        continue;
      }
      if (drawn >= maxN) continue;
      drawn++;
      const a = agentPos[ch.target];
      const sx = w + 40;
      const sy = ch.sy;
      const e = ease(t);
      const px = lerp(sx, a.x, e);
      const py = lerp(sy, a.y, e) - Math.sin(t * Math.PI) * (mobile ? 14 : 24);
      const alpha = t < 0.12 ? t / 0.12 : t > 0.84 ? (1 - t) / 0.16 : 1;
      const scale = t > 0.84 ? 0.4 + 0.6 * ((1 - t) / 0.16) : 1;
      const cw = (mobile ? 64 : 90) * scale;
      const chh = (mobile ? 18 : 22) * scale;
      const col = AGENTS[ch.target].color;
      c.globalAlpha = alpha;
      roundRect(px - cw / 2, py - chh / 2, cw, chh, chh / 2);
      c.fillStyle = "rgba(8,10,18,0.76)";
      c.fill();
      c.lineWidth = 1;
      c.strokeStyle = `rgba(${col},0.55)`;
      c.stroke();
      // type pip in the destination agent's color
      c.beginPath();
      c.arc(px - cw / 2 + chh * 0.55, py, chh * 0.18, 0, TAU);
      c.fillStyle = `rgba(${col},0.95)`;
      c.fill();
      c.fillStyle = "rgba(226,232,240,0.92)";
      c.font = `600 ${mobile ? 7 : 8}px ui-monospace, monospace`;
      c.textAlign = "left";
      c.fillText(ch.label, px - cw / 2 + chh * 0.9, py + 3);
      c.globalAlpha = 1;
    }
  }

  function drawPackets(now: number) {
    for (const p of packets) {
      if (!p.active) continue;
      const t = (now - p.born) / p.dur;
      if (t > 1) {
        if (!p.arrived) {
          // credit the destination KPI + TASKS COMPLETED, flash on arrival
          const k = kpis[p.kpi];
          k.value += k.step + Math.floor(Math.random() * (k.step + 1));
          k.flash = 1;
          if (p.kpi !== 0) {
            kpis[0].value += 1;
            kpis[0].flash = Math.max(kpis[0].flash, 0.6);
          }
          p.arrived = true;
        }
        p.active = false;
        continue;
      }
      if (t < 0) continue;
      const e = ease(t);
      const cx = (p.ax + p.bx) / 2;
      const cy = (p.ay + p.by) / 2 + p.bow;
      const px = (1 - e) * (1 - e) * p.ax + 2 * (1 - e) * e * cx + e * e * p.bx;
      const py = (1 - e) * (1 - e) * p.ay + 2 * (1 - e) * e * cy + e * e * p.by;
      const e2 = ease(Math.max(0, t - 0.08));
      const tx = (1 - e2) * (1 - e2) * p.ax + 2 * (1 - e2) * e2 * cx + e2 * e2 * p.bx;
      const ty = (1 - e2) * (1 - e2) * p.ay + 2 * (1 - e2) * e2 * cy + e2 * e2 * p.by;
      // glowing comet tail
      const grad = c.createLinearGradient(tx, ty, px, py);
      grad.addColorStop(0, `rgba(${p.color},0)`);
      grad.addColorStop(1, `rgba(${p.color},0.9)`);
      c.strokeStyle = grad;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(tx, ty);
      c.lineTo(px, py);
      c.stroke();
      c.beginPath();
      c.arc(px, py, 2.6, 0, TAU);
      c.fillStyle = `rgba(${p.color},1)`;
      c.fill();
    }
  }

  function drawAgents(now: number) {
    for (let i = 0; i < AGENTS.length; i++) {
      const { x, y } = agentPos[i];
      const def = AGENTS[i];
      const lit = agentLit[i];
      const caught = agentCatch[i];
      const idle = 0.5 + 0.5 * Math.sin(now / 1200 + i * 1.3);
      const r = (mobile ? 7 : 10) * (1 + lit * 0.35);

      if (lit > 0.02) glow(x, y, r * 4.5, def.color, 0.3 * lit);

      // catch ripple when a task lands
      if (caught > 0.02) {
        c.beginPath();
        c.arc(x, y, r + (1 - caught) * r * 3, 0, TAU);
        c.strokeStyle = `rgba(${def.color},${0.5 * caught})`;
        c.lineWidth = 1.4;
        c.stroke();
      }

      // node — clean digital "employee", not a robot
      roundRect(x - r, y - r, r * 2, r * 2, r * 0.55);
      c.fillStyle = `rgba(${def.color},${0.12 + lit * 0.45})`;
      c.fill();
      c.lineWidth = 1.2;
      c.strokeStyle = `rgba(${def.color},${0.5 + idle * 0.2})`;
      c.stroke();
      // inner status pip
      c.beginPath();
      c.arc(x, y, r * 0.34, 0, TAU);
      c.fillStyle = `rgba(${def.color},${0.6 + lit * 0.4})`;
      c.fill();

      const right = x >= coreX - 6;
      c.textAlign = right ? "left" : "right";
      const lx = x + (right ? r + 8 : -r - 8);
      // agent name
      c.fillStyle = `rgba(226,232,240,${0.7 + lit * 0.3})`;
      c.font = `700 ${mobile ? 8 : 9}px ui-monospace, monospace`;
      c.fillText(def.name, lx, y - 2);
      // cycling activity micro-label (changes ~every 2.4s, offset per agent)
      if (!mobile || lit > 0.1) {
        const ai = Math.floor((now / 2400 + i * 0.7) % def.acts.length);
        const phase = (now / 2400 + i * 0.7) % 1;
        const fade = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 1;
        c.globalAlpha = 0.5 + 0.5 * fade;
        c.fillStyle = `rgba(${def.color},0.85)`;
        c.font = `500 ${mobile ? 7 : 8}px ui-monospace, monospace`;
        c.fillText(def.acts[ai], lx, y + 9);
        c.globalAlpha = 1;
        // tiny activity sweep underline
        const uw = mobile ? 26 : 44;
        const ux = right ? lx : lx - uw;
        c.strokeStyle = `rgba(${def.color},0.3)`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(ux, y + 13);
        c.lineTo(ux + uw, y + 13);
        c.stroke();
        const sweep = (now / 1000 + i) % 1;
        c.strokeStyle = `rgba(${def.color},0.9)`;
        c.beginPath();
        c.moveTo(ux + uw * sweep, y + 13);
        c.lineTo(ux + Math.min(uw, uw * sweep + 8), y + 13);
        c.stroke();
      }
    }
  }

  function drawPanel(now: number) {
    if (mobile && w < 560) {
      // too narrow — skip the dashboard but anchor KPIs near the core so
      // packets still have valid landing points
      for (let i = 0; i < kpiAnchor.length; i++) {
        kpiAnchor[i].x = coreX;
        kpiAnchor[i].y = coreY;
      }
      return;
    }
    const P = panel;
    // glassy body
    roundRect(P.x, P.y, P.w, P.h, 14);
    c.fillStyle = "rgba(10,12,22,0.62)";
    c.fill();
    c.lineWidth = 1;
    c.strokeStyle = `rgba(${CYAN},0.22)`;
    c.stroke();
    // top header glow
    glow(P.x + P.w * 0.5, P.y, P.w * 0.7, VIOLET, 0.05);
    c.fillStyle = "rgba(226,232,240,0.92)";
    c.font = "700 10px ui-monospace, monospace";
    c.textAlign = "left";
    c.fillText("AI WORKFORCE · COMMAND CENTER", P.x + 16, P.y + 22);
    // live status dot
    const live = 0.5 + 0.5 * Math.sin(now / 500);
    c.beginPath();
    c.arc(P.x + P.w - 16, P.y + 18, 3, 0, TAU);
    c.fillStyle = `rgba(${CYAN},${0.5 + live * 0.5})`;
    c.fill();
    c.fillStyle = `rgba(${SLATE},0.7)`;
    c.font = "600 7px ui-monospace, monospace";
    c.textAlign = "right";
    c.fillText("LIVE 24/7", P.x + P.w - 24, P.y + 21);
    // header divider
    c.strokeStyle = `rgba(${SLATE},0.15)`;
    c.beginPath();
    c.moveTo(P.x + 14, P.y + 32);
    c.lineTo(P.x + P.w - 14, P.y + 32);
    c.stroke();

    // KPI rows — mono numerals ticking up; packets land on these anchors
    const rowTop = P.y + 44;
    const rowH = (P.h - 56) / kpis.length;
    for (let i = 0; i < kpis.length; i++) {
      const k = kpis[i];
      const ry = rowTop + rowH * i;
      const midY = ry + rowH * 0.5;
      kpiAnchor[i].x = P.x + 14;
      kpiAnchor[i].y = midY;

      // arrival flash background
      if (k.flash > 0.01) {
        c.globalAlpha = k.flash * 0.16;
        roundRect(P.x + 10, ry + 2, P.w - 20, rowH - 4, 5);
        c.fillStyle = `rgba(${k.color},1)`;
        c.fill();
        c.globalAlpha = 1;
      }

      // label
      c.fillStyle = `rgba(${SLATE},0.78)`;
      c.font = "600 8px ui-monospace, monospace";
      c.textAlign = "left";
      c.fillText(k.label, P.x + 16, midY);
      // value (right-aligned mono), brightening on flash
      c.fillStyle = `rgba(255,255,255,${0.86 + k.flash * 0.14})`;
      c.font = `700 ${Math.min(15, rowH * 0.6)}px ui-monospace, monospace`;
      c.textAlign = "right";
      c.fillText(k.value.toLocaleString("en-US"), P.x + P.w - 16, midY);
      // thin baseline rule
      const bw = P.w - 32;
      c.strokeStyle = `rgba(${SLATE},0.12)`;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(P.x + 16, ry + rowH - 4);
      c.lineTo(P.x + 16 + bw, ry + rowH - 4);
      c.stroke();
      // breathing colored fill, nudged on flash
      const frac = Math.min(1, 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(now / 1400 + i)) + k.flash * 0.1);
      const grad = c.createLinearGradient(P.x, 0, P.x + P.w, 0);
      grad.addColorStop(0, `rgba(${k.color},0.9)`);
      grad.addColorStop(1, `rgba(${k.color},0.25)`);
      c.strokeStyle = grad;
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(P.x + 16, ry + rowH - 4);
      c.lineTo(P.x + 16 + bw * frac, ry + rowH - 4);
      c.stroke();
    }
  }

  function leftScrim() {
    const g = c.createLinearGradient(0, 0, w * 0.55, 0);
    g.addColorStop(0, "rgba(5,6,12,0.92)");
    g.addColorStop(0.6, "rgba(5,6,12,0.45)");
    g.addColorStop(1, "rgba(5,6,12,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w * 0.55, h);
  }

  function renderFrame(now: number) {
    drawAtmosphere();
    drawPanel(now); // first: establishes KPI anchors used by packets this frame
    drawConnectors(now);
    drawChips(now);
    drawPackets(now);
    drawCore(now);
    drawOperator(now);
    drawAgents(now);
    leftScrim();
  }

  resize();

  if (reduced) {
    // calm near-static frame, no rAF
    for (let i = 0; i < AGENTS.length; i++) agentLit[i] = 0.3 + i * 0.05;
    updateAgentPositions(1400);
    renderFrame(1400); // renderFrame() runs drawPanel() first, priming KPI anchors
    const ro = new ResizeObserver(() => {
      resize();
      updateAgentPositions(1400);
      renderFrame(1400);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }

  let raf = 0;
  let running = true;
  let prev = 0;
  const spawnEvery = mobile ? 1100 : 680;
  const beatEvery = mobile ? 2200 : 1800;

  const loop = (t: number) => {
    if (!running) return;
    const dt = prev === 0 ? 16 : Math.min(64, t - prev);
    prev = t;

    updateAgentPositions(t);

    if (t - lastSpawn >= spawnEvery) {
      lastSpawn = t;
      spawnChip(t);
    }
    if (t - lastBeat >= beatEvery) lastBeat = t;

    // ambient baseline tick so counters never look frozen between routed work
    if (t - lastTick >= 900) {
      lastTick = t;
      kpis[0].value += 1 + Math.floor(Math.random() * 2);
    }

    // agents relax back toward idle; catch ripple decays faster
    for (let i = 0; i < AGENTS.length; i++) {
      agentLit[i] = Math.max(0, agentLit[i] - dt / 1100);
      agentCatch[i] = Math.max(0, agentCatch[i] - dt / 600);
    }
    // KPI arrival flashes decay
    for (const k of kpis) k.flash = Math.max(0, k.flash - dt / 700);

    renderFrame(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting ?? true;
      if (visible && !running) {
        running = true;
        prev = 0;
        // re-base schedulers to "now" so a long offscreen pause does not fire a
        // burst of spawns/ticks on the first resumed frame
        const tNow = performance.now();
        lastSpawn = tNow;
        lastBeat = tNow;
        lastTick = tNow;
        raf = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
  };
}

export function AIWorkforce() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const cleanup = AIWorkforceImpl(canvas);
    return cleanup;
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 -z-20 h-full w-full bg-brand-ink"
    />
  );
}
