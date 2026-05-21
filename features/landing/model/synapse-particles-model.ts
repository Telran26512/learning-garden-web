export const MATH_GLYPHS = [
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

export const EQUATIONS = [
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

export type Glyph = {
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

export type Equation = {
  text: string;
  x: number;
  y: number;
  vx: number;
  life: number;
  max: number;
  color: string;
  size: number;
};

export type Pulse = {
  a: Glyph;
  b: Glyph;
  t: number;
  dur: number;
  color: string;
};

export type ParticleState = {
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

export type ParticleConfig = {
  nodeCount: number;
  colors: readonly string[];
};

export function createParticleState(): ParticleState {
  return {
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
  };
}

export function resizeParticleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: ParticleState,
  config: ParticleConfig,
) {
  const rect = canvas.getBoundingClientRect();
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.w = rect.width;
  state.h = rect.height;
  canvas.width = rect.width * state.dpr;
  canvas.height = rect.height * state.dpr;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  seedParticles(state, config);
}

export function seedParticles(state: ParticleState, config: ParticleConfig) {
  const count = Math.max(
    20,
    Math.min(220, Math.floor(config.nodeCount * 0.35)),
  );
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
      color: config.colors[index % config.colors.length],
      phase: Math.random() * Math.PI * 2,
    };
  });
  state.equations = [];
  state.pulses = [];
  state.eqTimer = 600;
}

export function setParticleMouse(
  canvas: HTMLCanvasElement,
  state: ParticleState,
  event: PointerEvent,
) {
  const rect = canvas.getBoundingClientRect();
  state.mouse.x = event.clientX - rect.left;
  state.mouse.y = event.clientY - rect.top;
}

export function clearParticleMouse(state: ParticleState) {
  state.mouse.x = -9999;
  state.mouse.y = -9999;
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
