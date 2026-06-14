import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { getProjectsByZone, zoneContent } from '../../data/projects';
import type { VennZone } from '../../data/projects';
import { createVennCircles, computeVennZones } from './venn-geometry';
import ProjectCard from './ProjectCard';

const CIRCLE_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  security: {
    fill: 'rgba(239, 68, 68, 0.08)',
    stroke: 'rgba(239, 68, 68, 0.6)',
    label: '#ef4444',
  },
  ai: {
    fill: 'rgba(139, 92, 246, 0.08)',
    stroke: 'rgba(139, 92, 246, 0.6)',
    label: '#8b5cf6',
  },
  systems: {
    fill: 'rgba(6, 182, 212, 0.08)',
    stroke: 'rgba(6, 182, 212, 0.6)',
    label: '#06b6d4',
  },
};

const CIRCLE_IDS = ['security', 'ai', 'systems'] as const;

export default function VennDiagram() {
  const { language } = useTranslation();
  const [activeZones, setActiveZones] = useState<Set<string>>(new Set(['center']));
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const scale = 0.7;
  const circles = useMemo(() => createVennCircles(scale), [scale]);
  const zones = useMemo(() => computeVennZones(circles), [circles]);

  const handleZoneClick = useCallback(
    (zoneId: string, e: React.MouseEvent) => {
      if (e.shiftKey) {
        setActiveZones((prev) => {
          const next = new Set(prev);
          if (next.has(zoneId)) {
            next.delete(zoneId);
            if (next.size === 0) next.add('center');
          } else {
            next.add(zoneId);
          }
          return next;
        });
      } else {
        if (activeZones.has(zoneId) && activeZones.size === 1) {
          setActiveZones(new Set(['center']));
        } else {
          setActiveZones(new Set([zoneId]));
        }
      }
      setActiveTag(null);
    },
    [activeZones],
  );

  const activeProjects = useMemo(() => {
    const allZones = Array.from(activeZones) as VennZone[];
    let projs = allZones.flatMap((z) => getProjectsByZone(z));
    // Deduplicate
    const seen = new Set<string>();
    projs = projs.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    if (activeTag) {
      projs = projs.filter((p) => p.tags.includes(activeTag));
    }
    return projs;
  }, [activeZones, activeTag]);

  const activeZoneContent = useMemo(() => {
    const zoneId = activeZones.size === 1 ? Array.from(activeZones)[0] : 'center';
    return zoneContent.find((z) => z.id === zoneId) || zoneContent.find((z) => z.id === 'center')!;
  }, [activeZones]);

  const mainZoneAccent = activeZones.size === 1 ? Array.from(activeZones)[0] : 'center';

  const viewBoxWidth = 500 * scale;
  const viewBoxHeight = 420 * scale;

  return (
    <div className="w-full">
      {/* SVG Venn */}
      <div className="relative w-full max-w-[500px] mx-auto mb-12">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto"
          aria-label="Venn diagram showing Security, AI/ML, and Systems domains"
          role="img"
        >
          {/* Overlapping circles */}
          {CIRCLE_IDS.map((id, i) => {
            const c = circles[i];
            const colors = CIRCLE_COLORS[id];
            const isActive = activeZones.has(id);
            return (
              <g key={id}>
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill={isActive ? colors.fill : 'rgba(255,255,255,0.02)'}
                  stroke={isActive ? colors.stroke : 'rgba(255,255,255,0.08)'}
                  strokeWidth={isActive ? 2 : 1}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={(e) => {
                    const svg = (e.target as SVGElement).closest('svg');
                    if (!svg) return;
                    const pt = svg.createSVGPoint();
                    pt.x = e.clientX;
                    pt.y = e.clientY;
                    const ctm = svg.getScreenCTM();
                    if (!ctm) return;
                    const svgPt = pt.matrixTransform(ctm.inverse());
                    // Check if click is within this circle
                    const dx = svgPt.x - c.cx;
                    const dy = svgPt.y - c.cy;
                    if (dx * dx + dy * dy <= c.r * c.r) {
                      handleZoneClick(id, e as unknown as React.MouseEvent);
                    }
                  }}
                />
              </g>
            );
          })}

          {/* Clickable zone overlays */}
          {zones.map((zone) => {
            const isActive = activeZones.has(zone.id);
            return (
              <g key={zone.id}>
                {/* Invisible clickable area */}
                <ellipse
                  cx={zone.cx}
                  cy={zone.cy}
                  rx={zone.rx}
                  ry={zone.ry}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => handleZoneClick(zone.id, e as unknown as React.MouseEvent)}
                />
                {/* Zone label */}
                <text
                  x={zone.cx}
                  y={zone.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-xs font-mono pointer-events-none transition-colors duration-300 ${
                    isActive ? 'fill-[--text-primary]' : 'fill-[--text-muted]'
                  }`}
                  fontSize={10 * scale * 1.5}
                >
                  {zone.label}
                </text>
              </g>
            );
          })}

          {/* Circle labels */}
          {CIRCLE_IDS.map((id, i) => {
            const c = circles[i];
            const colors = CIRCLE_COLORS[id];
            const y = id === 'security' ? c.cy - c.r - 12 * scale : c.cy + c.r + 24 * scale;
            return (
              <text
                key={`label-${id}`}
                x={c.cx}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-display font-bold pointer-events-none"
                fill={colors.label}
                fontSize={14 * scale * 1.5}
                opacity={0.9}
              >
                {id === 'security' ? 'Security' : id === 'ai' ? 'AI/ML' : 'Systems'}
              </text>
            );
          })}
        </svg>

        {/* Multi-select hint */}
        <p className="text-center text-xs text-[--text-muted] mt-2">
          Click a zone to explore. Shift+click to select multiple.
        </p>
      </div>

      {/* Content panel */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-[--text-primary] mb-4">
            {activeZoneContent.title[language as 'en' | 'et'] || activeZoneContent.title.en}
          </h2>
          <p className="text-[--text-secondary] text-base leading-relaxed max-w-3xl">
            {activeZoneContent.description[language as 'en' | 'et'] || activeZoneContent.description.en}
          </p>

          {activeTag && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[--text-muted]">Filtered by:</span>
              <button
                onClick={() => setActiveTag(null)}
                className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-[--accent-intersection]/20 text-[--accent-intersection] hover:bg-[--accent-intersection]/30 transition-colors"
              >
                {activeTag} ×
              </button>
            </div>
          )}
        </div>

        {/* Project cards */}
        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                language={language as 'en' | 'et'}
                zoneAccent={mainZoneAccent}
                onTagClick={(tag) => setActiveTag(tag === activeTag ? null : tag)}
                activeTag={activeTag ?? undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[--text-muted] text-sm py-12">
            {activeTag
              ? 'No projects with this tag in the selected zone.'
              : 'No projects in this zone yet.'}
          </p>
        )}
      </div>
    </div>
  );
}
