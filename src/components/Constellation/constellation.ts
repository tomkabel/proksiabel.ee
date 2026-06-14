import type { Project, Domain } from '../../data/projects';

export interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: [number, number, number];
  alpha: number;
  project: Project;
}

export interface ConstellationEdge {
  source: number;
  target: number;
}

interface ConstellationConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  maxNodes: number;
}

const DOMAIN_COLORS: Record<Domain, [number, number, number]> = {
  security: [0.937, 0.267, 0.267],
  ai: [0.545, 0.361, 0.965],
  systems: [0.024, 0.714, 0.831],
};

const CENTER_COLOR: [number, number, number] = [0.961, 0.620, 0.043];

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function projectColor(project: Project): [number, number, number] {
  if (project.nodeType === 'center') return CENTER_COLOR;
  if (project.nodeType === 'meta') return [0.647, 0.667, 0.722];
  if (project.nodeType === 'domain') return DOMAIN_COLORS[project.domains[0]];
  if (project.domains.length === 1) return DOMAIN_COLORS[project.domains[0]];
  if (project.domains.length === 2) {
    return lerpColor(DOMAIN_COLORS[project.domains[0]], DOMAIN_COLORS[project.domains[1]], 0.5);
  }
  return CENTER_COLOR;
}

function nodeRadius(project: Project): number {
  switch (project.nodeType) {
    case 'center':
      return 14;
    case 'domain':
      return 12;
    case 'meta':
      return 7;
    default:
      return 4 + (project.nodeWeight / 10) * 8;
  }
}

// Simple Perlin-like noise using sin/cos hash
function noise2D(x: number, y: number, t: number): [number, number] {
  const nx = Math.sin(x * 0.01 + t * 0.3) * Math.cos(y * 0.013 + t * 0.2);
  const ny = Math.cos(x * 0.012 + t * 0.25) * Math.sin(y * 0.011 + t * 0.35);
  return [nx * 0.5, ny * 0.5];
}

export function initConstellation(
  projects: Project[],
  config: ConstellationConfig,
): { nodes: ConstellationNode[]; edges: ConstellationEdge[] } {
  const items = projects.filter(
    (p) => p.nodeType === 'project' || p.nodeType === 'domain' || p.nodeType === 'center' || p.nodeType === 'meta',
  );
  const selected = items.slice(0, config.maxNodes);

  const nodes: ConstellationNode[] = selected.map((project, i) => {
    const angle = (i / selected.length) * Math.PI * 2;
    const radius = config.width * 0.25 + Math.random() * config.width * 0.1;
    const x = config.centerX + Math.cos(angle) * radius;
    const y = config.centerY + Math.sin(angle) * radius * 0.7;

    return {
      id: project.id,
      x,
      y,
      vx: 0,
      vy: 0,
      baseX: config.centerX,
      baseY: config.centerY,
      radius: nodeRadius(project),
      color: projectColor(project),
      alpha: 0.6,
      project,
    };
  });

  const edges: ConstellationEdge[] = [];

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];
      if (a.nodeType === 'meta' || b.nodeType === 'meta') continue;

      const sharedDomains = a.domains.filter((d) => b.domains.includes(d));
      const sharedZones = a.zones.filter((z) => b.zones.includes(z));

      if (sharedDomains.length > 0 || sharedZones.length > 0) {
        if (a.nodeType === 'center' || b.nodeType === 'center') {
          edges.push({ source: i, target: j });
        } else if (sharedDomains.length >= 1) {
          edges.push({ source: i, target: j });
        }
      }
    }
  }

  // Limit edges per node to 2
  const edgeCount = new Map<number, number>();
  const filtered: ConstellationEdge[] = [];
  for (const edge of edges) {
    const sc = edgeCount.get(edge.source) ?? 0;
    const tc = edgeCount.get(edge.target) ?? 0;
    if (sc < 2 && tc < 2) {
      filtered.push(edge);
      edgeCount.set(edge.source, sc + 1);
      edgeCount.set(edge.target, tc + 1);
    }
  }

  return { nodes, edges: filtered };
}

export function updateConstellation(
  nodes: ConstellationNode[],
  edges: ConstellationEdge[],
  config: ConstellationConfig,
  mouseX: number,
  mouseY: number,
  time: number,
) {
  const { centerX, centerY, width } = config;
  const REPULSION = 5000;
  const ATTRACTION = 0.003;
  const EDGE_SPRING = 0.001;
  const DAMPING = 0.92;
  const MOUSE_RADIUS = 120;
  const MOUSE_FORCE = 0.5;

  // Forces
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];

    // Attraction to center
    n.vx += (centerX - n.x) * ATTRACTION;
    n.vy += (centerY - n.y) * ATTRACTION;

    // Attraction to base position
    n.vx += (n.baseX - n.x) * ATTRACTION * 0.5;
    n.vy += (n.baseY - n.y) * ATTRACTION * 0.5;

    // Perlin noise drift
    const [ndx, ndy] = noise2D(n.baseX, n.baseY, time);
    n.vx += ndx * 0.1;
    n.vy += ndy * 0.1;

    // Mouse repulsion
    const dx = n.x - mouseX;
    const dy = n.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
      n.vx += (dx / dist) * force * 2;
      n.vy += (dy / dist) * force * 2;
    }

    // Repulsion between nodes
    for (let j = i + 1; j < nodes.length; j++) {
      const m = nodes[j];
      const dx2 = n.x - m.x;
      const dy2 = n.y - m.y;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      const minDist = n.radius + m.radius + 30;
      if (dist2 < minDist && dist2 > 0) {
        const force = REPULSION / (dist2 * dist2);
        n.vx += (dx2 / dist2) * force;
        n.vy += (dy2 / dist2) * force;
        m.vx -= (dx2 / dist2) * force;
        m.vy -= (dy2 / dist2) * force;
      }
    }
  }

  // Edge spring forces
  for (const edge of edges) {
    const s = nodes[edge.source];
    const t = nodes[edge.target];
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const restLength = width * 0.12;
    if (dist > 0) {
      const force = (dist - restLength) * EDGE_SPRING;
      s.vx += (dx / dist) * force;
      s.vy += (dy / dist) * force;
      t.vx -= (dx / dist) * force;
      t.vy -= (dy / dist) * force;
    }
  }

  // Apply velocity with damping, clamp position
  for (const n of nodes) {
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx;
    n.y += n.vy;
    n.x = Math.max(n.radius, Math.min(config.width - n.radius, n.x));
    n.y = Math.max(n.radius, Math.min(config.height - n.radius, n.y));
  }
}

export function findClosestNode(
  nodes: ConstellationNode[],
  mx: number,
  my: number,
  threshold = 50,
): ConstellationNode | null {
  let closest: ConstellationNode | null = null;
  let minDist = threshold;

  for (const n of nodes) {
    const dx = n.x - mx;
    const dy = n.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy) - n.radius;
    if (dist < minDist) {
      minDist = dist;
      closest = n;
    }
  }

  return closest;
}

export { projectColor, nodeRadius };
