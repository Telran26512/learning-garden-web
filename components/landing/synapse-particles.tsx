"use client";

import { useEffect, useRef } from "react";
import {
  clearParticleMouse,
  createParticleState,
  resizeParticleCanvas,
  setParticleMouse,
  type ParticleState,
} from "./synapse-particles-model";
import { drawParticleFrame } from "./synapse-particles-renderer";

export function SynapseParticles({
  nodeCount = 280,
  colors = ["#6B7280", "#A8A8B3", "#F4F4F7"],
}: {
  nodeCount?: number;
  colors?: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<ParticleState>(createParticleState());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = stateRef.current;
    const config = { colors, nodeCount };
    const resize = () => resizeParticleCanvas(canvas, ctx, state, config);
    const tick = (time: number) => {
      drawParticleFrame(ctx, state, config, time);
      state.raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      setParticleMouse(canvas, state, event);
    };
    const onLeave = () => {
      clearParticleMouse(state);
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
      className="absolute inset-0 block h-full w-full"
    />
  );
}
