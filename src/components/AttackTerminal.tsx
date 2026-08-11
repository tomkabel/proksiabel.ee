import { Terminal } from 'lucide-react';
import React from 'react';
import { useTranslation } from '../i18n';

interface AttackTerminalProps {
  onSelectService: () => void;
}

// Index into `lines` for each finding row → its service chip.
const FINDING_TO_SERVICE = [4, 5, 7];

const CHAR_MS = 26;
const LINE_MS = 240;
const FINDING_MS = 700;

export default function AttackTerminal({ onSelectService }: AttackTerminalProps) {
  const { t } = useTranslation();
  const lines = t.hero.terminal.lines;
  const command = t.hero.terminal.cmd;
  const serviceLabels = [t.hero.terminal.svc1, t.hero.terminal.svc2, t.hero.terminal.svc3];

  const [started, setStarted] = React.useState(false);
  const [typed, setTyped] = React.useState(0);
  const [revealed, setRevealed] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const reduced = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  React.useEffect(() => {
    if (reduced) {
      setTyped(command.length);
      setRevealed(lines.length);
      setDone(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, lines, command]);

  React.useEffect(() => {
    if (!started || reduced) return;
    let cancelled = false;
    const timers: number[] = [];
    for (let i = 1; i <= command.length; i++) {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setTyped(i);
        }, i * CHAR_MS),
      );
    }
    let t = command.length * CHAR_MS + 300;
    for (let i = 1; i <= lines.length; i++) {
      const delay = FINDING_TO_SERVICE.includes(i - 1) ? FINDING_MS : LINE_MS;
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setRevealed(i);
        }, t),
      );
      t += delay;
    }
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setDone(true);
      }, t + 400),
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [started, reduced, lines, command]);

  const progress = done ? 100 : Math.round((revealed / lines.length) * 100);

  return (
    <div ref={rootRef} className='relative'>
      <div className='relative rounded-xl border border-white/10 bg-slate-950 shadow-2xl shadow-sky-950/40 overflow-hidden'>
        {/* Title bar */}
        <div className='flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/80'>
          <span className='w-3 h-3 rounded-full bg-rose-400/80' aria-hidden='true' />
          <span className='w-3 h-3 rounded-full bg-amber-400/80' aria-hidden='true' />
          <span className='w-3 h-3 rounded-full bg-teal-400/80' aria-hidden='true' />
          <span className='ml-3 text-xs text-slate-400 font-mono flex items-center gap-1.5'>
            <Terminal className='h-3.5 w-3.5 text-sky-400' />
            proksiabel — {t.hero.terminal.title}
          </span>
          <span className='ml-auto text-[10px] font-semibold uppercase tracking-wider text-sky-400 border border-sky-500/40 rounded px-1.5 py-0.5'>
            {t.hero.terminal.demo}
          </span>
        </div>

        {/* Scan output */}
        <div
          className='px-4 py-4 font-mono text-[13px] leading-6'
          role='log'
          aria-label={t.hero.terminal.title}
        >
          <div className='text-slate-300'>
            <span className='text-teal-400'>$</span> {command.slice(0, typed)}
            {!done && typed < command.length && (
              <span
                className='inline-block w-2 h-4 align-middle bg-teal-400 animate-caret ml-0.5'
                aria-hidden='true'
              />
            )}
          </div>
          {lines.slice(0, revealed).map((line, i) => {
            const finding = FINDING_TO_SERVICE.indexOf(i);
            const marker = line.slice(0, 3);
            const markerColor =
              marker === '[+]'
                ? 'text-teal-400'
                : marker === '[!]'
                  ? 'text-rose-400'
                  : 'text-slate-500';
            return (
              <div key={i} className='flex items-center gap-3'>
                <span className={`${markerColor} shrink-0`}>{marker}</span>
                <span className='text-slate-300 flex-1'>{line.slice(4)}</span>
                {finding >= 0 && (
                  <button
                    type='button'
                    onClick={onSelectService}
                    className='shrink-0 text-[10px] font-semibold uppercase tracking-wide text-sky-400 border border-sky-500/40 rounded-full px-2 py-0.5 hover:bg-sky-500/10 hover:text-sky-300 transition-colors'
                  >
                    {serviceLabels[finding]}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className='h-0.5 bg-slate-800'>
          <div
            className='h-full bg-sky-400 transition-[width] duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer */}
        <div className='px-4 py-2.5 border-t border-white/10 bg-slate-900/60'>
          <p className='text-xs text-slate-400'>{t.hero.terminal.footer}</p>
        </div>
      </div>
    </div>
  );
}
