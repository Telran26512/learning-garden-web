"use client";

import { useEffect, useRef } from "react";

const MATH_GLYPHS = [
  "∇",
  "∂",
  "∑",
  "∫",
  "π",
  "θ",
  "λ",
  "μ",
  "σ",
  "ε",
  "ω",
  "α",
  "β",
  "γ",
  "Δ",
  "Ω",
  "⊗",
  "⊕",
  "∞",
  "√",
  "Q",
  "K",
  "V",
  "W",
  "x",
  "y",
  "ℒ",
];

const EQUATIONS = [
  "Q·Kᵀ / √dₖ",
  "softmax(QKᵀ)V",
  "∇θ L(θ)",
  "∂L / ∂θ",
  "‖x - μ‖²",
  "p(y | x; θ)",
  "argmax πθ",
  "log p(x)",
  "W·x + b",
  "h = σ(Wx)",
  "KL(p ‖ q)",
  "Σᵢ aᵢ vᵢ",
  "Eq.(7) ->",
];

type Glyph = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  size: number;
  alpha: number;
  glyph: string;
  color: string;
  phase: number;
  rx?: number;
  ry?: number;
};

type Equation = {
  text: string;
  x: number;
  y: number;
  vx: number;
  life: number;
  max: number;
  color: string;
  size: number;
};

type Pulse = {
  a: Glyph;
  b: Glyph;
  t: number;
  dur: number;
  color: string;
};

type ParticleState = {
  glyphs: Glyph[];
  equations: Equation[];
  pulses: Pulse[];
  mouse: { x: number; y: number };
  w: number;
  h: number;
  dpr: number;
  raf: number;
  last: number;
  pulseTimer: number;
  eqTimer: number;
};

export function SynapseParticles({
  nodeCount = 280,
  colors = ["#4DD0FF", "#60A5FA", "#E07856"],
}: {
  nodeCount?: number;
  colors?: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<ParticleState>({
    glyphs: [],
    equations: [],
    pulses: [],
    mouse: { x: -9999, y: -9999 },
    w: 0,
    h: 0,
    dpr: 1,
    raf: 0,
    last: 0,
    pulseTimer: 0,
    eqTimer: 600,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = stateRef.current;

    const seed = () => {
      const count = Math.max(20, Math.min(220, Math.floor(nodeCount * 0.35)));
      state.glyphs = Array.from({ length: count }, (_, index) => {
        const z = Math.random();
        return {
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08 - 0.02,
          z,
          size: 11 + z * 22,
          alpha: 0.18 + z * 0.55,
          glyph: MATH_GLYPHS[(Math.random() * MATH_GLYPHS.length) | 0],
          color: colors[index % colors.length],
          phase: Math.random() * Math.PI * 2,
        };
      });
      state.equations = [];
      state.pulses = [];
      state.eqTimer = 600;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * state.dpr;
      canvas.height = rect.height * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      seed();
    };

    const drawLattice = () => {
      const cell = 56;
      const offset = (state.last / 90) % cell;
      ctx.fillStyle = "rgba(150,170,210,0.07)";
      for (let x = -offset; x < state.w + cell; x += cell) {
        for (let y = -offset * 0.6; y < state.h + cell; y += cell) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    };

    const drawPerspectiveFloor = () => {
      const vpx = state.w * 0.5;
      const vpy = state.h * 0.38;
      const baseY = state.h + 40;
      const lineCount = 18;
      ctx.strokeStyle = "rgba(120,160,255,0.06)";
      ctx.lineWidth = 0.6;

      for (let index = 0; index <= lineCount; index += 1) {
        const t = index / lineCount;
        const x = (t - 0.5) * state.w * 3 + vpx;
        ctx.beginPath();
        ctx.moveTo(vpx, vpy);
        ctx.lineTo(x, baseY);
        ctx.stroke();
      }

      for (let index = 1; index <= 9; index += 1) {
        const t = index / 9;
        const y = vpy + (baseY - vpy) * (t * t);
        ctx.strokeStyle = `rgba(120,160,255,${0.04 + t * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(state.w, y);
        ctx.stroke();
      }
    };

    const maybeSpawnEquation = () => {
      state.eqTimer -= 16;
      if (state.eqTimer > 0) return;

      state.eqTimer = 2400 + Math.random() * 2600;
      const fromLeft = Math.random() > 0.5;
      state.equations.push({
        text: EQUATIONS[(Math.random() * EQUATIONS.length) | 0],
        y: 60 + Math.random() * Math.max(1, state.h - 120),
        color: colors[(Math.random() * colors.length) | 0],
        x: fromLeft ? -260 : state.w + 260,
        vx: fromLeft
          ? 0.18 + Math.random() * 0.12
          : -(0.18 + Math.random() * 0.12),
        life: 0,
        max: 12000,
        size: 13 + Math.random() * 6,
      });
    };

    const drawEquations = () => {
      for (let index = state.equations.length - 1; index >= 0; index -= 1) {
        const equation = state.equations[index];
        equation.life += 16;
        equation.x += equation.vx * 16;
        const t = equation.life / equation.max;
        if (t > 1 || equation.x < -320 || equation.x > state.w + 320) {
          state.equations.splice(index, 1);
          continue;
        }

        const fade = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
        ctx.font = `500 ${equation.size}px "Geist Mono", ui-monospace, monospace`;
        ctx.fillStyle = hexToRgba(equation.color, 0.08 * fade);
        ctx.fillText(equation.text, equation.x + 1, equation.y + 1);
        ctx.fillStyle = hexToRgba(equation.color, 0.65 * fade);
        ctx.fillText(equation.text, equation.x, equation.y);
      }
    };

    const drawGlyphs = () => {
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      state.glyphs.sort((a, b) => a.z - b.z);
      const parallaxX = state.mouse.x > -1000 ? state.mouse.x - state.w / 2 : 0;
      const parallaxY = state.mouse.y > -1000 ? state.mouse.y - state.h / 2 : 0;

      for (const glyph of state.glyphs) {
        glyph.x += glyph.vx;
        glyph.y += glyph.vy;
        glyph.phase += 0.01;

        if (glyph.x < -40) glyph.x = state.w + 40;
        if (glyph.x > state.w + 40) glyph.x = -40;
        if (glyph.y < -40) glyph.y = state.h + 40;
        if (glyph.y > state.h + 40) glyph.y = -40;

        const x =
          glyph.x - parallaxX * 0.04 * glyph.z + Math.sin(glyph.phase) * 1.5;
        const y = glyph.y - parallaxY * 0.04 * glyph.z;
        const alpha = glyph.alpha * (0.85 + 0.15 * Math.sin(glyph.phase * 0.7));

        ctx.font = `${glyph.z > 0.6 ? 500 : 400} ${glyph.size}px "Fraunces", "Geist Mono", serif`;
        if (glyph.z > 0.55) {
          ctx.fillStyle = hexToRgba(glyph.color, 0.12 * alpha);
          ctx.fillText(glyph.glyph, x, y);
          ctx.fillStyle = hexToRgba(glyph.color, 0.18 * alpha);
          ctx.fillText(glyph.glyph, x + 0.5, y + 0.5);
        }

        ctx.fillStyle = hexToRgba(glyph.color, alpha);
        ctx.fillText(glyph.glyph, x, y);
        glyph.rx = x;
        glyph.ry = y;
      }
    };

    const maybeSpawnPulse = () => {
      state.pulseTimer -= 16;
      if (state.pulseTimer > 0) return;

      state.pulseTimer = 1400 + Math.random() * 1800;
      const candidates = state.glyphs.filter((glyph) => glyph.z > 0.4);
      if (candidates.length < 2) return;

      const a = candidates[(Math.random() * candidates.length) | 0];
      let b: Glyph | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < 14; index += 1) {
        const candidate = candidates[(Math.random() * candidates.length) | 0];
        if (candidate === a) continue;
        const distance = Math.hypot(
          (a.rx ?? a.x) - (candidate.rx ?? candidate.x),
          (a.ry ?? a.y) - (candidate.ry ?? candidate.y),
        );
        if (distance > 60 && distance < 380 && distance < bestDistance) {
          b = candidate;
          bestDistance = distance;
        }
      }

      if (b) {
        state.pulses.push({
          a,
          b,
          t: 0,
          dur: 1400 + Math.random() * 700,
          color: a.color,
        });
      }
    };

    const drawPulses = () => {
      ctx.globalCompositeOperation = "lighter";
      for (let index = state.pulses.length - 1; index >= 0; index -= 1) {
        const pulse = state.pulses[index];
        pulse.t += 16;
        const u = pulse.t / pulse.dur;
        if (u >= 1) {
          state.pulses.splice(index, 1);
          continue;
        }

        const ax = pulse.a.rx ?? pulse.a.x;
        const ay = pulse.a.ry ?? pulse.a.y;
        const bx = pulse.b.rx ?? pulse.b.x;
        const by = pulse.b.ry ?? pulse.b.y;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const arc = Math.min(70, len * 0.25);
        const cx = mx + nx * arc;
        const cy = my + ny * arc;
        const oneMinusU = 1 - u;
        const x =
          oneMinusU * oneMinusU * ax + 2 * oneMinusU * u * cx + u * u * bx;
        const y =
          oneMinusU * oneMinusU * ay + 2 * oneMinusU * u * cy + u * u * by;

        ctx.strokeStyle = hexToRgba(pulse.color, 0.18 * (1 - u));
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx, cy, bx, by);
        ctx.stroke();

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 16);
        glow.addColorStop(0, hexToRgba(pulse.color, 0.95));
        glow.addColorStop(0.4, hexToRgba(pulse.color, 0.5));
        glow.addColorStop(1, hexToRgba(pulse.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawCornerMatrix = () => {
      const size = 8;
      const cell = 14;
      const padding = 28;
      const x0 = state.w - (size * cell + padding);
      const y0 = state.h - (size * cell + padding);
      const seedT = state.last / 800;

      ctx.save();
      ctx.strokeStyle = "rgba(150,170,210,0.18)";
      ctx.strokeRect(x0 - 6, y0 - 18, size * cell + 12, size * cell + 26);
      ctx.font = '500 9px "Geist Mono", ui-monospace, monospace';
      ctx.fillStyle = "rgba(150,170,210,0.6)";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("attn(Q,K)  8x8", x0 - 4, y0 - 14);

      for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column += 1) {
          const value =
            (Math.sin(row * 0.7 + seedT) *
              Math.cos(column * 0.5 - seedT * 0.7) +
              1) /
            2;
          const diagonal = 1 - Math.abs(row - column) / size;
          const intensity = Math.pow(value * 0.45 + diagonal * 0.55, 1.3);
          ctx.fillStyle = hexToRgba(colors[1], intensity * 0.55);
          ctx.fillRect(x0 + column * cell, y0 + row * cell, cell - 1, cell - 1);
        }
      }
      ctx.restore();
    };

    const tick = (time: number) => {
      state.last = time;
      ctx.clearRect(0, 0, state.w, state.h);

      const glow = ctx.createRadialGradient(
        state.w * 0.5,
        state.h * 0.42,
        0,
        state.w * 0.5,
        state.h * 0.42,
        Math.max(state.w, state.h) * 0.75,
      );
      glow.addColorStop(0, hexToRgba(colors[1], 0.06));
      glow.addColorStop(0.5, hexToRgba(colors[0], 0.03));
      glow.addColorStop(1, "rgba(7,7,11,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, state.w, state.h);

      drawLattice();
      drawPerspectiveFloor();
      maybeSpawnEquation();
      drawEquations();
      drawGlyphs();
      maybeSpawnPulse();
      drawPulses();
      drawCornerMatrix();

      state.raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = event.clientX - rect.left;
      state.mouse.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [colors, nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export function hexToRgba(hex: string, alpha: number) {
  if (hex.startsWith("rgb"))
    return hex.replace("rgb(", "rgba(").replace(")", `,${alpha})`);
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
