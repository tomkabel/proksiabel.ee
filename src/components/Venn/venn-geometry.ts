// Venn diagram geometry — 3 overlapping circles with 7 interactive zones

export interface Circle {
  cx: number;
  cy: number;
  r: number;
}

export interface VennZone {
  id: string;
  zones: string[];
  label: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export function createVennCircles(scale: number): Circle[] {
  const side = 120 * scale;
  const h = (side * Math.sqrt(3)) / 2;
  const centerX = 250 * scale;
  const centerY = 210 * scale;

  return [
    { cx: centerX, cy: centerY - h / 3, r: 100 * scale },
    { cx: centerX - side / 2, cy: centerY + h / 6, r: 100 * scale },
    { cx: centerX + side / 2, cy: centerY + h / 6, r: 100 * scale },
  ];
}

export function computeVennZones(circles: Circle[]): VennZone[] {
  const [sec, ai, sys] = circles;
  const sc = sec.r / 100; // scale factor derived from circle radius

  const mid = (a: number, b: number) => (a + b) / 2;

  const secTop = sec.cy - sec.r * 0.65;

  const aiOuter = { x: ai.cx - ai.r * 0.45, y: ai.cy + ai.r * 0.3 };

  const sysOuter = { x: sys.cx + sys.r * 0.45, y: sys.cy + sys.r * 0.3 };

  const centerX = mid(mid(sec.cx, ai.cx), sys.cx);
  const centerY = mid(mid(sec.cy, ai.cy), sys.cy);

  const secAi = { x: mid(sec.cx, ai.cx) - 25 * sc, y: mid(sec.cy, ai.cy) + 5 * sc };

  const secSys = { x: mid(sec.cx, sys.cx) + 25 * sc, y: mid(sec.cy, sys.cy) + 5 * sc };

  const aiSys = { x: mid(ai.cx, sys.cx), y: mid(ai.cy, sys.cy) + 35 * sc };

  const sz = 40 * sc;

  return [
    { id: 'security', zones: ['security'], label: 'Security', cx: sec.cx, cy: secTop, rx: sz, ry: sz },
    { id: 'ai', zones: ['ai'], label: 'AI/ML', cx: aiOuter.x, cy: aiOuter.y, rx: sz, ry: sz },
    { id: 'systems', zones: ['systems'], label: 'Systems', cx: sysOuter.x, cy: sysOuter.y, rx: sz, ry: sz },
    { id: 'sec-ai', zones: ['sec-ai'], label: 'Sec × AI', cx: secAi.x, cy: secAi.y, rx: sz * 0.9, ry: sz * 0.9 },
    { id: 'sec-sys', zones: ['sec-sys'], label: 'Sec × Sys', cx: secSys.x, cy: secSys.y, rx: sz * 0.9, ry: sz * 0.9 },
    { id: 'ai-sys', zones: ['ai-sys'], label: 'AI × Sys', cx: aiSys.x, cy: aiSys.y, rx: sz * 0.9, ry: sz * 0.9 },
    { id: 'center', zones: ['center'], label: 'Center', cx: centerX, cy: centerY, rx: sz * 0.8, ry: sz * 0.8 },
  ];
}
