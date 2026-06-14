import type { Project } from '../../data/projects';
import type { Language } from '../../i18n';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  language: Language;
  zoneAccent: string;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
}

const ZONE_ACCENT_MAP: Record<string, string> = {
  security: '#ef4444',
  ai: '#8b5cf6',
  systems: '#06b6d4',
  'sec-ai': '#f59e0b',
  'sec-sys': '#f59e0b',
  'ai-sys': '#f59e0b',
  center: '#f59e0b',
};

export default function ProjectCard({
  project,
  language,
  zoneAccent,
  onTagClick,
  activeTag,
}: ProjectCardProps) {
  const desc = project.description[language] || project.description.en;
  const tagline = project.tagline[language] || project.tagline.en;
  const accent = ZONE_ACCENT_MAP[zoneAccent] || zoneAccent;

  return (
    <article
      className="group p-[--space-card-padding] rounded-card border border-white/5 bg-[--bg-surface] transition-all duration-[--duration-normal] hover:-translate-y-1 hover:shadow-lg"
      style={{ '--hover-accent': accent } as React.CSSProperties}
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.slice(0, 3).map((tag) => (
          <button
            key={tag}
            onClick={(e) => {
              e.stopPropagation();
              onTagClick?.(tag);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
              activeTag === tag
                ? 'bg-[--accent-intersection]/20 text-[--accent-intersection]'
                : 'bg-[--bg-elevated] text-[--text-muted] hover:text-[--text-secondary]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <h3 className="font-display font-bold text-[--text-primary] text-lg mb-1.5 group-hover:text-white transition-colors">
        {project.title}
      </h3>

      <p className="text-[--text-secondary] text-sm mb-3">{tagline}</p>

      <p className="text-[--text-muted] text-sm leading-relaxed line-clamp-3 mb-4">
        {desc}
      </p>

      {project.links.length > 0 && (
        <div className="space-y-2">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[--accent-intersection] hover:text-[--accent-intersection]/80 transition-colors"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
