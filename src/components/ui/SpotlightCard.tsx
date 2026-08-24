import { type ReactNode, useEffect, useRef, useState } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Radius of the radial spotlight following the cursor, in px. */
  spotlightRadius?: number;
  /** When false (reduced motion / low-end), the cursor tracking is disabled. */
  interactive?: boolean;
}

/**
 * Elevated obsidian card with a cursor-tracking specular spotlight and a masked
 * cyan border stroke that fades in on hover. Pointer position is written to CSS
 * custom properties so the paint stays on the compositor (no per-move re-render
 * of children). Respects prefers-reduced-motion by rendering a static card.
 *
 * Pointer listeners are attached imperatively via the ref (not JSX handlers) —
 * the effect is purely decorative and the card exposes no interactive semantics.
 *
 * This is the corrected, shippable implementation of the design blueprint's
 * BentoSecurityCard sketch.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightRadius = 600,
  interactive = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !interactive) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    };
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive]);

  return (
    <div ref={ref} className={`obsidian-card group p-8 ${className}`}>
      {/* Radial spotlight fill */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300'
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${spotlightRadius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0, 229, 255, 0.15), transparent 40%)`,
        }}
      />
      {/* Masked cyan border stroke */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300'
        style={{
          opacity: active ? 1 : 0,
          border: '1px solid rgba(0, 229, 255, 0.4)',
          maskImage:
            'radial-gradient(250px circle at var(--spot-x, 50%) var(--spot-y, 50%), black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(250px circle at var(--spot-x, 50%) var(--spot-y, 50%), black 30%, transparent 80%)',
        }}
      />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}

export default SpotlightCard;
