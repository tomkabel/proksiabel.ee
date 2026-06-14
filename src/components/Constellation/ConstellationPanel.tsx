import { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { ConstellationNode } from './constellation';
import { useTranslation } from '../../i18n';

interface ConstellationPanelProps {
  node: ConstellationNode | null;
  onClose: () => void;
}

export default function ConstellationPanel({ node, onClose }: ConstellationPanelProps) {
  const { language } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node && panelRef.current) {
      panelRef.current.focus();
    }
  }, [node]);

  if (!node) return null;

  const { project } = node;
  const desc = project.description[language as 'en' | 'et'] || project.description.en;
  const tagline = project.tagline[language as 'en' | 'et'] || project.tagline.en;

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      className="fixed right-0 top-0 bottom-0 z-30 w-full sm:w-[420px] bg-[--bg-surface] border-l border-white/5 shadow-2xl animate-slide-in-right overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[--text-primary]">
              {project.title}
            </h2>
            <p className="text-[--text-secondary] text-sm mt-1">{tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[--text-muted] hover:text-[--text-primary] hover:bg-[--bg-elevated] transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tech tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider bg-[--bg-elevated] text-[--text-secondary]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-[--text-secondary] text-sm leading-relaxed mb-8">
          {desc}
        </p>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="space-y-3">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[--accent-intersection] hover:text-[--accent-intersection]/80 transition-colors"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
