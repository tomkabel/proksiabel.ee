import { useRef, useEffect, useCallback } from 'react';
import { PerformanceMonitor } from './renderer';

interface ConstellationCanvasProps {
  width: number;
  height: number;
  onReady?: () => void;
  onError?: () => void;
}

export default function ConstellationCanvas({
  width,
  height,
  onReady,
  onError,
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const pmRef = useRef(new PerformanceMonitor());
  const animRef = useRef<number>(0);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) return false;

    gl.clearColor(0.012, 0.016, 0.027, 1.0); // #030407
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, width, height);

    glRef.current = gl;
    return true;
  }, [width, height]);

  const render = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;

    gl.clear(gl.COLOR_BUFFER_BIT);
    // Node rendering will be wired in Phase 2

    pmRef.current.tick();
  }, []);

  useEffect(() => {
    const ok = initWebGL();
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
    } else {
      onError?.();
    }
  }, [initWebGL, render, onReady, onError]);

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
