import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { getProjectsByZone, zoneContent } from '../../data/projects';
import type { VennZone } from '../../data/projects';
import ProjectCard from './ProjectCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DomainRow {
  id: string;
  label: string;
  accent: string;
  intersections: { id: VennZone; label: string }[];
}

const DOMAINS: DomainRow[] = [
  {
    id: 'security',
    label: 'Security',
    accent: '#ef4444',
    intersections: [
      { id: 'sec-ai', label: 'AI × Security' },
      { id: 'sec-sys', label: 'Security × Systems' },
    ],
  },
  {
    id: 'ai',
    label: 'AI/ML',
    accent: '#8b5cf6',
    intersections: [
      { id: 'sec-ai', label: 'AI × Security' },
      { id: 'ai-sys', label: 'AI × Systems' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    accent: '#06b6d4',
    intersections: [
      { id: 'sec-sys', label: 'Security × Systems' },
      { id: 'ai-sys', label: 'AI × Systems' },
    ],
  },
];

export default function MobileVenn() {
  const { language } = useTranslation();
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<VennZone>('center');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleDomainToggle = useCallback(
    (domainId: string) => {
      setExpandedDomain((prev) => (prev === domainId ? null : domainId));
    },
    [],
  );

  const handlePillClick = useCallback((zoneId: VennZone) => {
    setActiveZone(zoneId);
    setActiveTag(null);
  }, []);

  const allZones: { id: VennZone; label: string }[] = [
    { id: 'security', label: 'Security' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'systems', label: 'Systems' },
    { id: 'sec-ai', label: 'AI × Security' },
    { id: 'sec-sys', label: 'Security × Systems' },
    { id: 'ai-sys', label: 'AI × Systems' },
    { id: 'center', label: 'Center' },
  ];

  const activeProjects = useMemo(() => {
    let projs = getProjectsByZone(activeZone);
    if (activeTag) {
      projs = projs.filter((p) => p.tags.includes(activeTag));
    }
    return projs;
  }, [activeZone, activeTag]);

  const activeZoneContent = useMemo(() => {
    return zoneContent.find((z) => z.id === activeZone) || zoneContent.find((z) => z.id === 'center')!;
  }, [activeZone]);

  return (
    <div className="w-full">
      {/* Domain rows */}
      <div className="space-y-3 mb-10">
        {/* All zones pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handlePillClick(zone.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeZone === zone.id
                  ? 'bg-[--accent-intersection]/20 text-[--accent-intersection] border border-[--accent-intersection]/40'
                  : 'bg-[--bg-surface] text-[--text-secondary] border border-white/5'
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>

        {DOMAINS.map((domain) => (
          <div key={domain.id} className="border border-white/5 rounded-xl overflow-hidden">
            <button
              onClick={() => handleDomainToggle(domain.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-[--bg-surface] hover:bg-[--bg-elevated] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: domain.accent }}
                />
                <span className="font-display font-bold text-[--text-primary] text-sm">
                  {domain.label}
                </span>
              </div>
              {expandedDomain === domain.id ? (
                <ChevronDown className="h-4 w-4 text-[--text-muted]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[--text-muted]" />
              )}
            </button>

            {expandedDomain === domain.id && (
              <div className="px-5 pb-4 pt-2 space-y-2">
                {/* Pure domain */}
                <button
                  onClick={() => handlePillClick(domain.id as VennZone)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeZone === domain.id
                      ? 'bg-[--accent-intersection]/10 text-[--accent-intersection]'
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  }`}
                >
                  {domain.label} (pure)
                </button>
                {/* Intersections */}
                {domain.intersections.map((ix) => (
                  <button
                    key={ix.id}
                    onClick={() => handlePillClick(ix.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeZone === ix.id
                        ? 'bg-[--accent-intersection]/10 text-[--accent-intersection]'
                        : 'text-[--text-secondary] hover:text-[--text-primary]'
                    }`}
                  >
                    {ix.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Center */}
        <button
          onClick={() => handlePillClick('center')}
          className={`w-full px-5 py-4 rounded-xl border transition-all text-center ${
            activeZone === 'center'
              ? 'bg-[--accent-intersection]/10 border-[--accent-intersection]/30 text-[--accent-intersection]'
              : 'bg-[--bg-surface] border-white/5 text-[--text-secondary]'
          }`}
        >
          <span className="font-display font-bold text-sm">Center (All Three)</span>
        </button>
      </div>

      {/* Content panel */}
      <div className="px-4">
        <h2 className="font-display text-xl font-bold text-[--text-primary] mb-3">
          {activeZoneContent.title[language as 'en' | 'et'] || activeZoneContent.title.en}
        </h2>
        <p className="text-[--text-secondary] text-sm leading-relaxed mb-8">
          {activeZoneContent.description[language as 'en' | 'et'] || activeZoneContent.description.en}
        </p>

        {activeTag && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[--text-muted]">Filtered by:</span>
            <button
              onClick={() => setActiveTag(null)}
              className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-[--accent-intersection]/20 text-[--accent-intersection]"
            >
              {activeTag} ×
            </button>
          </div>
        )}

        {activeProjects.length > 0 ? (
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                language={language as 'en' | 'et'}
                zoneAccent={activeZone}
                onTagClick={(tag) => setActiveTag(tag === activeTag ? null : tag)}
                activeTag={activeTag ?? undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[--text-muted] text-sm py-8">
            No projects in this zone yet.
          </p>
        )}
      </div>
    </div>
  );
}
