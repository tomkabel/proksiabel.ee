import { useRef, useEffect, useCallback } from 'react';
import { PerformanceMonitor } from './renderer';

interface ConstellationCanvas2DProps {
  width: number;
  height: number;
  onReady?: () => void;
}

export default function ConstellationCanvas2D({
  width,
  height,
  onReady,
}: ConstellationCanvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pmRef = useRef(new PerformanceMonitor());
  const animRef = useRef<number>(0);

  const init2D = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return false;

    ctxRef.current = ctx;
    return true;
  }, []);

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    // Node rendering will be wired in Phase 2

    pmRef.current.tick();
  }, [width, height]);

  useEffect(() => {
    const ok = init2D();
    if (ok) {
      onReady?.();

      let running = true;
      const loop = () => {
        if (!running) return;
        render();
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);

      return () => {
        running = false;
        cancelAnimationFrame(animRef.current);
      };
    }
  }, [init2D, render, onReady]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block w-full h-full"
      style={{ background: '#030407' }}
    />
  );
}
