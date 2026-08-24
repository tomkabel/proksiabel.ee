import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n';

interface AttackVectorGraphProps {
  /** Fires when a vector is activated — used to jump to the Services section. */
  onSelectVector?: () => void;
}

// Decoded artifacts the AiTM proxy captures for each attack vector. These are
// illustrative header/cookie fragments, not real secrets.
const DECODED = [
  'Set-Cookie: sid=a3f…9c1; HttpOnly',
  'Authorization: Bearer eyJhbGci…',
  'mfa=passed; step_up=skip',
];

/**
 * Interactive Adversary-in-the-Middle (AiTM) attack-vector graph. Replaces the
 * old fake CLI. Three primary nodes (client → proxy → target); selecting a
 * vector highlights the flow and reveals the artifact the proxy intercepts.
 *
 * Packet motion is SVG SMIL, rendered only when the user has not requested
 * reduced motion; otherwise the graph is fully legible as a static diagram.
 */
export default function AttackVectorGraph({ onSelectVector }: AttackVectorGraphProps) {
  const { t } = useTranslation();
  const g = t.hero.graph;
  const [selected, setSelected] = useState(0);

  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const vectors = [
    { key: 0, label: g.session },
    { key: 1, label: g.tokenHijack },
    { key: 2, label: g.bypass },
  ];

  // Two flow segments: client → proxy, proxy → target.
  const pathLeft = 'M 70 70 H 165';
  const pathRight = 'M 235 70 H 330';

  return (
    <div className='obsidian-card p-5 sm:p-6'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <span className='mono-badge'>{g.tag}</span>
        <span
          className='font-mono text-[10px] uppercase tracking-wider'
          style={{ color: 'var(--color-signal-critical)' }}
        >
          ● live
        </span>
      </div>

      {/* Diagram */}
      <svg
        viewBox='0 0 400 140'
        className='w-full'
        role='img'
        aria-label={`${g.client} → ${g.proxy} → ${g.target}`}
      >
        <title>{`${g.client} → ${g.proxy} → ${g.target}`}</title>

        {/* Connection lines */}
        <path d={pathLeft} stroke='rgba(255,255,255,0.15)' strokeWidth='1.5' fill='none' />
        <path d={pathRight} stroke='rgba(255,255,255,0.15)' strokeWidth='1.5' fill='none' />

        {/* Animated packets (motion only when not reduced) */}
        {!reduced && (
          <>
            <circle r='3' fill='var(--color-cyan-core)'>
              <animateMotion dur='1.6s' repeatCount='indefinite' path={pathLeft} />
            </circle>
            <circle r='3' fill='var(--color-signal-critical)'>
              <animateMotion dur='1.6s' begin='0.8s' repeatCount='indefinite' path={pathRight} />
            </circle>
          </>
        )}

        {/* Client node */}
        <g>
          <rect
            x='20'
            y='52'
            width='50'
            height='36'
            rx='8'
            fill='var(--color-surface-2)'
            stroke='var(--border-active-glow)'
            strokeWidth='1'
          />
          <text x='45' y='74' textAnchor='middle' className='fill-white' fontSize='9'>
            {g.client}
          </text>
        </g>

        {/* Proxy node (adversary — critical) */}
        <g>
          <rect
            x='165'
            y='48'
            width='70'
            height='44'
            rx='8'
            fill='color-mix(in oklab, var(--color-signal-critical) 14%, var(--color-surface-2))'
            stroke='var(--color-signal-critical)'
            strokeWidth='1.5'
          />
          <text
            x='200'
            y='66'
            textAnchor='middle'
            fontSize='9'
            style={{ fill: 'var(--color-signal-critical)' }}
          >
            {g.proxy}
          </text>
          <text x='200' y='80' textAnchor='middle' className='fill-slate-300' fontSize='7'>
            {vectors[selected].label}
          </text>
        </g>

        {/* Target node */}
        <g>
          <rect
            x='330'
            y='52'
            width='50'
            height='36'
            rx='8'
            fill='var(--color-surface-2)'
            stroke='var(--border-active-glow)'
            strokeWidth='1'
          />
          <text x='355' y='74' textAnchor='middle' className='fill-white' fontSize='9'>
            {g.target}
          </text>
        </g>
      </svg>

      {/* Vector selector */}
      <div className='mt-4 flex flex-wrap gap-2'>
        {vectors.map((v) => {
          const active = v.key === selected;
          return (
            <button
              key={v.key}
              type='button'
              onClick={() => {
                setSelected(v.key);
                onSelectVector?.();
              }}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                active
                  ? 'border-[var(--color-cyan-core)] text-[var(--color-cyan-core)]'
                  : 'border-[var(--border-subtle)] text-[var(--color-text-muted)] hover:text-white'
              }`}
              style={
                active
                  ? {
                      backgroundColor:
                        'color-mix(in oklab, var(--color-cyan-core) 8%, transparent)',
                    }
                  : undefined
              }
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Decoded artifact chip */}
      <div
        className='mt-3 rounded-lg border px-3 py-2'
        style={{
          borderColor: 'color-mix(in oklab, var(--color-signal-critical) 30%, transparent)',
          backgroundColor: 'color-mix(in oklab, var(--color-signal-critical) 6%, transparent)',
        }}
      >
        <div className='flex items-center gap-2'>
          <span
            className='font-mono text-[10px] uppercase tracking-wider'
            style={{ color: 'var(--color-signal-critical)' }}
          >
            {g.intercepted}
          </span>
          <span className='font-mono text-[10px] text-[var(--color-text-muted)]'>
            {g.tokenLabel}
          </span>
        </div>
        <code className='mt-1 block truncate font-mono text-xs text-[var(--color-text-body)]'>
          {DECODED[selected]}
        </code>
      </div>

      <p className='mt-3 text-center text-xs text-[var(--color-text-muted)]'>{g.caption}</p>
    </div>
  );
}
