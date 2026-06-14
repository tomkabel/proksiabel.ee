import { useRef, useEffect, useState, useCallback } from 'react';
import { projects } from '../../data/projects';
import { detectRenderer, getMobileCapabilities, PerformanceMonitor, type RendererCapabilities } from './renderer';
import {
  initConstellation,
  updateConstellation,
  findClosestNode,
  type ConstellationNode,
  type ConstellationEdge,
} from './constellation';
import ConstellationPanel from './ConstellationPanel';

export default function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<ConstellationNode[]>([]);
  const edgesRef = useRef<ConstellationEdge[]>([]);
  const capsRef = useRef<RendererCapabilities>(detectRenderer());
  const pmRef = useRef(new PerformanceMonitor());
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    let caps = detectRenderer();
    if (isMobile) {
      caps = getMobileCapabilities(caps);
    }
    capsRef.current = caps;
  }, [isMobile]);

  // Initialize dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: Math.max(rect.height, window.innerHeight * 0.7),
      });
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Set up constellation data
  useEffect(() => {
    if (dimensions.width === 0) return;
    try {
      const { nodes, edges } = initConstellation(projects, {
        width: dimensions.width,
        height: dimensions.height,
        centerX: dimensions.width / 2,
        centerY: dimensions.height / 2,
        maxNodes: capsRef.current.maxNodes,
      });
      nodesRef.current = nodes;
      edgesRef.current = edges;
    } catch {
      setHasError(true);
    }
  }, [dimensions]);

  // Canvas 2D draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    ctx.clearRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const eds = edgesRef.current;
    const hov = hoveredNode;

    // Draw edges
    ctx.lineWidth = 0.5;
    for (const edge of eds) {
      const s = nodes[edge.source];
      const t = nodes[edge.target];
      if (!s || !t) continue;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hov?.id === node.id;
      const [r, g, b] = node.color;
      const alpha = isHovered ? 1 : node.alpha;

      ctx.save();
      ctx.globalAlpha = alpha;

      switch (node.project.nodeType) {
        case 'center': {
          const cx = node.x;
          const cy = node.y;
          const outerR = node.radius;
          const innerR = node.radius * 0.4;
          const spikes = 8;

          if (isHovered) {
            ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
            ctx.shadowBlur = 20;
          }

          ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, 1)`;
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const sx = cx + Math.cos(angle) * radius;
            const sy = cy + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }

        case 'domain': {
          ctx.strokeStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'meta': {
          ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y - node.radius);
          ctx.lineTo(node.x + node.radius, node.y);
          ctx.lineTo(node.x, node.y + node.radius);
          ctx.lineTo(node.x - node.radius, node.y);
          ctx.closePath();
          ctx.fill();
          break;
        }

        default: {
          if (isHovered) {
            ctx.shadowColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.5)`;
            ctx.shadowBlur = 12;
          }

          ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }
      }

      ctx.restore();
    }
  }, [dimensions, hoveredNode]);

  // Animation loop
  useEffect(() => {
    if (dimensions.width === 0) return;

    let running = true;
    let firstFrame = true;

    const loop = () => {
      if (!running) return;

      updateConstellation(
        nodesRef.current,
        edgesRef.current,
        {
          width: dimensions.width,
          height: dimensions.height,
          centerX: dimensions.width / 2,
          centerY: dimensions.height / 2,
          maxNodes: capsRef.current.maxNodes,
        },
        mouseRef.current.x,
        mouseRef.current.y,
        timeRef.current,
      );

      draw();
      timeRef.current += 0.016;
      pmRef.current.tick();

      if (firstFrame) {
        firstFrame = false;
        setIsLoading(false);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [dimensions, draw]);

  // Mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    const closest = findClosestNode(nodesRef.current, mx, my, 50);
    setHoveredNode(closest);
    if (closest) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const closest = findClosestNode(nodesRef.current, mx, my, 50);
    if (closest && closest.project.nodeType !== 'domain') {
      setSelectedNode(closest);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: '70vh', background: '#030407' }}
      >
        <p className="text-[--text-muted] text-sm">
          Interactive constellation unavailable.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '70vh', background: '#030407' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-[--text-muted] text-sm animate-pulse">
            Loading constellation...
          </p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full cursor-crosshair"
        style={{ background: '#030407' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {/* Tooltip */}
      {hoveredNode && !selectedNode && (
        <div
          className="fixed z-20 pointer-events-none px-3 py-2 rounded-lg bg-[--bg-elevated] border border-white/10 text-sm"
          style={{
            left: tooltipPos.x + 16,
            top: tooltipPos.y - 40,
          }}
        >
          <div className="font-display font-bold text-[--text-primary] text-xs">
            {hoveredNode.project.title}
          </div>
          <div className="text-[--text-muted] text-xs mt-0.5 max-w-[200px] truncate">
            {hoveredNode.project.tagline.en}
          </div>
        </div>
      )}

      {/* Detail panel */}
      <ConstellationPanel node={selectedNode} onClose={handleClose} />
    </div>
  );
}
