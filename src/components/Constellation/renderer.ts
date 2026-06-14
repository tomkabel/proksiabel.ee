export type RendererType = 'webgl2' | 'canvas2d' | 'svg';

export interface RendererCapabilities {
  type: RendererType;
  maxNodes: number;
  supportsGlow: boolean;
  supportsInteraction: boolean;
}

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

function detectJSEnabled(): boolean {
  return typeof window !== 'undefined';
}

export function detectRenderer(): RendererCapabilities {
  if (!detectJSEnabled()) {
    return { type: 'svg', maxNodes: 15, supportsGlow: false, supportsInteraction: false };
  }

  if (detectWebGL2()) {
    return { type: 'webgl2', maxNodes: 20, supportsGlow: true, supportsInteraction: true };
  }

  return { type: 'canvas2d', maxNodes: 15, supportsGlow: false, supportsInteraction: true };
}

export function getMobileCapabilities(caps: RendererCapabilities): RendererCapabilities {
  return {
    ...caps,
    maxNodes: Math.min(caps.maxNodes, 10),
    supportsGlow: false,
  };
}

export class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private fps = 60;
  private belowThresholdCount = 0;

  tick(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frames.push(delta);
    if (this.frames.length > 60) this.frames.shift();

    if (this.frames.length >= 5) {
      const avg = this.frames.slice(-5).reduce((a, b) => a + b, 0) / 5;
      this.fps = 1000 / avg;

      if (this.fps < 30) {
        this.belowThresholdCount++;
      } else {
        this.belowThresholdCount = 0;
      }
    }

    return this.fps;
  }

  shouldDowngrade(): boolean {
    return this.belowThresholdCount >= 5;
  }

  getFPS(): number {
    return this.fps;
  }
}
