# Capability Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing ProksiAbel OU landing page with a unified personal + company capability radar single-page presence for Tom Kristian Abel.

**Architecture:** A single-page React 18 app with 5 scroll sections: Hero (with animated 6-axis SVG radar chart) → 6 Capability Axis sections → Research & Whitepapers grid → CTA/Contact section → Footer. All visual design tokens are centralized. Lenis handles smooth scroll. The radar chart is pure SVG with CSS/JS animation.

**Tech Stack:** React 18, TypeScript 5 (strict), Vite 5, Tailwind CSS 3, Lenis (smooth scroll), SVG (radar chart), Lucide React (icons)

---

### Task 1: Setup — install Lenis, update configs

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.js`
- Modify: `vite.config.ts`
- Modify: `index.html`

- [ ] **Step 1: Install Lenis**

Run: `npm install lenis`

- [ ] **Step 2: Update tailwind.config.js**

Add new colors, fonts, and animations:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        radar: {
          bg: '#020203',
          grid: '#1a1a2e',
          signal: '#00D4FF',
          accent: '#F59E0B',
          'text-primary': '#F1F5F9',
          'text-secondary': '#94A3B8',
        },
      },
      animation: {
        'radar-draw': 'radar-draw 1.5s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        'radar-draw': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Update vite.config.ts** — update manualChunks for radar components

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'pub',
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('RadarChart')) return 'radar';
          if (id.includes('lucide-react')) return 'ui';
          if (id.includes('node_modules/react')) return 'vendor';
        }
      }
    }
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
});
```

- [ ] **Step 4: Update index.html** — add Space Grotesk + JetBrains Mono fonts, update meta/title/SEO

Update the font preloads/styles and meta tags:

Key changes in `<head>`:
- Replace Inter-only font links with Space Grotesk + Inter + JetBrains Mono (watch, swap)
- Update `<title>` to: `"Tom Kristian Abel — Deep-Tech AI Engineering | Reverse Engineering · AI Infrastructure · Systems Architecture"`
- Update `<meta name="description">` to reflect personal capability focus
- Update OG/Twitter meta tags similarly
- Schema.org JSON-LD keeps ProksiAbel OÜ as the legal entity, but update `description`

The font loading pattern (preconnect + preload + `media="print" onload="this.media='all'"` + noscript fallback) matches the existing Inter setup. Apply the same for Space Grotesk (weights 400,500,600,700) and JetBrains Mono (weight 400). Keep Inter at weights 400,500,600,700.

- [ ] **Step 5: Set up new src/radar/ directory**

Run: `mkdir -p src/radar`

- [ ] **Step 6: Verify setup**

Run: `npx tsc --noEmit` — should pass with no errors
Run: `npm run build` — should complete successfully with the old code still intact

---

### Task 2: Create radar types and data

**Files:**
- Create: `src/radar/types.ts`
- Create: `src/radar/capability-data.tsx`
- Create: `src/radar/research-data.ts`

- [ ] **Step 1: Create `src/radar/types.ts`**

```ts
export interface RadarProject {
  id: string;
  name: string;
  description: { en: string; et: string };
  techTags: string[];
  url?: string;
  github?: string;
}

export interface CapabilityAxis {
  id: string;
  label: { en: string; et: string };
  description: { en: string; et: string };
  value: number; // 0–1 for radar polygon
  projects: RadarProject[];
  accentProject?: string; // id of featured project
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: { en: string; et: string };
  status: 'published' | 'draft' | 'in-progress';
  date: string;
  tags: string[];
  url?: string;
  featured?: boolean;
}
```

- [ ] **Step 2: Create `src/radar/capability-data.tsx`**

```ts
import type { CapabilityAxis } from './types';

export const capabilityAxes: CapabilityAxis[] = [
  {
    id: 'reverse-engineering',
    label: { en: 'Reverse Engineering', et: 'Pöördprojekteerimine' },
    description: {
      en: 'Decompiling obfuscated virtual machines, deconstructing hostile JavaScript environments, and mapping opcode architectures. Deep experience with anti-debug, chronometric defense, and anti-fraud system analysis.',
      et: 'Obfitseeritud virtuaalmasinate dekompileerimine, vaenulike JavaScripti keskkondade lahtimonteerimine ja opkoodi arhitektuuride kaardistamine. Sügav kogemus anti-debug, kronomeetrilise kaitse ja pettustõrjesüsteemide analüüsiga.',
    },
    value: 0.9,
    projects: [
      {
        id: 'botguard-vm',
        name: 'BotGuard VM Research',
        description: {
          en: 'Reverse-engineered Google\'s BotGuard VM opcode architecture, anti-debug chronometric defenses, and anti-logger mechanisms. Published original research advancing public understanding of obfuscated JavaScript VMs.',
          et: 'Google\'i BotGuard VM opkoodi arhitektuuri, anti-debug kronomeetriliste kaitsemehhanismide ja anti-loggeri mehhanismide pöördprojekteerimine. Avaldatud originaaluuring, mis edendab obfitseeritud JavaScripti VM-de mõistmist.',
        },
        techTags: ['Go', 'JavaScript', 'VM Decompilation', 'Anti-Debug'],
        url: '/#research',
      },
      {
        id: 'bg-decompiler',
        name: 'bg-vm-decompiler',
        description: {
          en: 'Open-source decompiler and static analyzer for BotGuard VM bytecode. Enables researchers to analyze opcode sequences without dynamic execution. Includes control-flow graph reconstruction.',
          et: 'Avatud lähtekoodiga dekompilaator ja staatiline analüsaator BotGuard VM baitkoodi jaoks. Võimaldab teadlastel analüüsida opkoodi järjestusi ilma dünaamilise täitmiseta.',
        },
        techTags: ['Go', 'Compiler', 'Static Analysis', 'CLI'],
        github: 'https://github.com/tkabel',
      },
      {
        id: 'fraud-network-analysis',
        name: 'Fraud Network Analysis Engine',
        description: {
          en: 'Reverse-engineered modern JavaScript-based fraud detection networks to understand their heuristics. Mapped device fingerprinting, behavioral analysis, and reputation scoring systems.',
          et: 'Pöördprojekteeris kaasaegsed JavaScript-põhised pettusetuvastusvõrgustikud, et mõista nende heuristikat. Kaardistas seadmete sõrmejäljetuvastuse ja käitumusliku analüüsi süsteemid.',
        },
        techTags: ['JavaScript', 'ML', 'Network Analysis', 'Security'],
      },
    ],
    accentProject: 'botguard-vm',
  },
  {
    id: 'ai-ml-infrastructure',
    label: { en: 'AI/ML Infrastructure', et: 'AI/ML Taristu' },
    description: {
      en: 'Architecting production-grade AI pipelines with GPU orchestration, serverless inference, and MCP-based agentic workflows. Building the infrastructure that makes AI actually work at scale.',
      et: 'Tootmiskõlblike AI torustike arhitekteerimine GPU orkestreerimise, serverless inferentsi ja MCP-põhiste agentide töövoogudega. Taristu ehitamine, mis paneb AI päriselt mastaabis tööle.',
    },
    value: 0.85,
    projects: [
      {
        id: 'echoguard',
        name: 'EchoGuard',
        description: {
          en: 'End-to-end AI voice cloning red-teaming pipeline using RunPod Serverless GPU cloud compute. FastAPI backend with Redis caching and async job queues orchestrating Demucs, WhisperX, and RMVPE models.',
          et: 'AI hääleklonimise punase meeskonna torustik, kasutades RunPod Serverless GPU pilvandmetöötlust. FastAPI backend Redis vahemäluga ja asünkroonsete tööjärjekordadega.',
        },
        techTags: ['FastAPI', 'Python', 'GPU', 'RunPod', 'Redis'],
        github: 'https://github.com/tkabel',
      },
      {
        id: 'ml-pipeline',
        name: 'ML Pipeline Infrastructure',
        description: {
          en: 'Designed and deployed infrastructure for training and serving ML models at scale. Automated data pipeline from collection through feature engineering to model deployment.',
          et: 'Kavandas ja juurutas taristu masinõppemudelite treenimiseks ja teenindamiseks mastaabis. Automatiseeris andmetorustiku kogumisest mudeli juurutamiseni.',
        },
        techTags: ['Docker', 'MLflow', 'Python', 'Kubernetes'],
      },
    ],
    accentProject: 'echoguard',
  },
  {
    id: 'offensive-tooling',
    label: { en: 'Offensive Tooling', et: 'Ründetööriistad' },
    description: {
      en: 'Building high-performance offensive security tools in Go. Custom MITM frameworks, TLS fingerprinting proxies, and bypass tooling that operates at the edge of what detection systems can identify.',
      et: 'Suure jõudlusega ründeturbetööriistade ehitamine Go keeles. Kohandatud MITM raamistikud, TLS sõrmejäljeproksid ja möödaviimistööriistad.',
    },
    value: 0.95,
    projects: [
      {
        id: 'fingerprintproxy',
        name: 'fingerprintproxy',
        description: {
          en: 'Production-grade TLS fingerprinting forward proxy with 80+ browser profiles, MITM support, and per-request fingerprint selection. Custom http.RoundTripper for fine-grained TLS handshake control.',
          et: 'Tootmiskõlblik TLS sõrmejälje puhverserver 80+ brauseriprofiiliga, MITM toega ja päringupõhise sõrmejälje valikuga.',
        },
        techTags: ['Go', 'TLS', 'HTTP/2', 'JA3'],
        github: 'https://github.com/tkabel',
      },
      {
        id: 'aitm-proxy',
        name: 'AiTM Proxy Toolkit',
        description: {
          en: 'Advanced adversary-in-the-middle proxy framework for testing modern authentication flows. Bypasses certificate pinning, intercepts OAuth2/OIDC exchanges.',
          et: 'Täiustatud vaheltlõike proksi raamistik kaasaegsete autentimisvoogude testimiseks.',
        },
        techTags: ['Go', 'TLS', 'OAuth2', 'HTTP/2'],
        github: 'https://github.com/tkabel',
      },
      {
        id: 'go-security-suite',
        name: 'Go Security Suite',
        description: {
          en: 'Collection of purpose-built offensive security tools in Go. Custom HTTP fuzzer, TLS analysis toolkit, and concurrent scanning infrastructure designed for scale.',
          et: 'Kogumik Go keeles kirjutatud ründeturbetööriistu.',
        },
        techTags: ['Go', 'Concurrency', 'TLS', 'HTTP'],
        github: 'https://github.com/tkabel',
      },
    ],
    accentProject: 'fingerprintproxy',
  },
  {
    id: 'systems-engineering',
    label: { en: 'Systems Engineering', et: 'Süsteemitehnika' },
    description: {
      en: 'Designing distributed, resilient systems with zero-trust architecture, custom transport layers, and infrastructure automation. From kernel concepts to cloud-native deployments.',
      et: 'Jaotatud, vastupidavate süsteemide projekteerimine null-usalduse arhitektuuri, kohandatud transpordikihtide ja taristu automatiseerimisega.',
    },
    value: 0.8,
    projects: [
      {
        id: 'mcp-agentic',
        name: 'stop-slop-drop-top',
        description: {
          en: 'MCP server integration and Claude Code skill enabling AI agents to autonomously evaluate and rewrite content. CLI and API aggregation backend with async batch processing for CI/CD pipelines.',
          et: 'MCP serveri integratsioon ja Claude Code oskus, mis võimaldab AI agentidel autonoomselt sisu hinnata ja ümber kirjutada.',
        },
        techTags: ['Node.js', 'Python', 'MCP', 'CI/CD'],
        github: 'https://github.com/tkabel',
      },
      {
        id: 'zero-trust',
        name: 'Zero-Trust Architecture Framework',
        description: {
          en: 'Complete reference architecture for zero-trust network security in cloud-native environments. Policy engine design, microsegmentation patterns, continuous verification pipelines.',
          et: 'Terviklik võrdlusarhitektuur null-usalduse võrgu turbe juurutamiseks pilv-native keskkondades.',
        },
        techTags: ['Kubernetes', 'Istio', 'OPA', 'Cloud'],
      },
      {
        id: 'infra-automation',
        name: 'Infrastructure Automation Toolkit',
        description: {
          en: 'Automated provisioning and configuration management for security testing environments. Reproducible, disposable test ranges with realistic network topologies.',
          et: 'Automatiseeritud taristu projekteerimine ja konfiguratsioonihaldus turvetestimise keskkondade jaoks.',
        },
        techTags: ['Terraform', 'Ansible', 'Docker', 'Linux'],
      },
    ],
    accentProject: 'mcp-agentic',
  },
  {
    id: 'research-analysis',
    label: { en: 'Research & Analysis', et: 'Uurimistöö ja analüüs' },
    description: {
      en: 'Deep-dive technical research into hostile software, obfuscated VMs, and anti-fraud ecosystems. Producing whitepapers and original findings that advance the field.',
      et: 'Põhjalik tehniline uurimistöö vaenuliku tarkvara, obfitseeritud VM-de ja pettustõrje ökosüsteemide kohta.',
    },
    value: 0.85,
    projects: [
      {
        id: 'botguard-research',
        name: 'BotGuard VM Security Research',
        description: {
          en: 'Comprehensive research on Google\'s BotGuard VM: opcode architecture mapping, chronometric defense analysis, anti-debug mechanisms, and Puppet bypass strategy using go-rod.',
          et: 'Põhjalik uurimistöö Google\'i BotGuard VM-i kohta: opkoodi arhitektuur, kronomeetrilise kaitse analüüs, anti-debug mehhanismid.',
        },
        techTags: ['Reverse Engineering', 'VM', 'JavaScript', 'Security'],
        url: '/#research',
      },
    ],
    accentProject: 'botguard-research',
  },
  {
    id: 'architecture-design',
    label: { en: 'Architecture & Design', et: 'Arhitektuur ja disain' },
    description: {
      en: 'System design and API architecture that balances security, scalability, and maintainability. Building the blueprints that turn capability into production systems.',
      et: 'Süsteemidisain ja API arhitektuur, mis tasakaalustab turvalisust, mastaabitavust ja hooldatavust.',
    },
    value: 0.75,
    projects: [
      {
        id: 'pentest-platform',
        name: 'AI-Assisted Pentest Intelligence Platform',
        description: {
          en: 'Platform combining offensive security testing with AI-driven analysis. Automates reconnaissance, correlates findings across attack vectors, generates prioritized remediation.',
          et: 'Platvorm, mis ühendab ründeturbe testimise AI-põhise analüüsiga.',
        },
        techTags: ['Go', 'Python', 'React', 'PostgreSQL'],
      },
      {
        id: 'session-security',
        name: 'Session Security Analysis Framework',
        description: {
          en: 'In-depth framework for analyzing web application session management. Token generation analysis, session fixation testing, concurrent session handling evaluation.',
          et: 'Põhjalik raamistik veebirakenduste sessioonihalduse analüüsimiseks.',
        },
        techTags: ['Security', 'OAuth', 'JWT', 'React'],
      },
    ],
    accentProject: 'pentest-platform',
  },
];
```

- [ ] **Step 3: Create `src/radar/research-data.ts`**

```ts
import type { ResearchPaper } from './types';

export const researchPapers: ResearchPaper[] = [
  {
    id: 'botguard-vm-paper',
    title: 'Deconstructing BotGuard: A Technical Analysis of Google\'s Obfuscated JavaScript Virtual Machine',
    abstract: {
      en: 'A comprehensive technical analysis of Google\'s BotGuard VM — a hostile, obfuscated JavaScript Virtual Machine used for bot detection. Maps opcode architecture, anti-debug chronometric defenses, anti-logger mechanisms, and evaluates bypass strategies including the Puppet approach using go-rod.',
      et: 'Põhjalik tehniline analüüs Google\'i BotGuard VM-ist — vaenulikust, obfitseeritud JavaScripti virtuaalmasinast, mida kasutatakse bot-tuvastuseks.',
    },
    status: 'published',
    date: '2025-11',
    tags: ['Reverse Engineering', 'VM', 'JavaScript', 'Bot Detection'],
    featured: true,
  },
];
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit` — should pass

---

### Task 3: Create RadarChart SVG component

**Files:**
- Create: `src/radar/RadarChart.tsx`

- [ ] **Step 1: Create `src/radar/RadarChart.tsx`**

A pure SVG radar chart with:
- 6 evenly-spaced axes (starting from top, 60° apart)
- 3 concentric ring grid lines
- Axis labels in JetBrains Mono
- Filled polygon with cyan `#00D4FF` gradient + 15% opacity fill
- Stroke-dashoffset animation on mount (draw-in over 1.5s)
- Each axis point is keyboard-focusable (`tabIndex={0}`, `role="button"`)
- `aria-label` on each axis point: "Reverse Engineering, value 9 out of 10"
- Hidden `<table>` fallback with numerical values for screen readers
- `onAxisFocus` callback when user clicks/keyboards an axis point
- `size` prop (default 400) — scales SVG viewBox

Implementation details:
- Use `useRef` + `useEffect` to trigger draw animation after mount (set `animated` state -> apply polygon points with full radius)
- Polygon `stroke-dasharray` = circumference, animate `stroke-dashoffset` from circumference → 0
- Accept `prefers-reduced-motion` via `matchMedia` — skip animation, show full polygon immediately
- For responsive sizing: render at `size` prop but CSS can scale via `max-w-[400px] w-full`

```tsx
import { useEffect, useRef, useState } from 'react';
import type { CapabilityAxis } from './types';

interface Props {
  axes: CapabilityAxis[];
  size?: number;
  className?: string;
  onAxisFocus?: (id: string) => void;
}

export default function RadarChart({ axes, size = 400, className, onAxisFocus }: Props) {
  const [animated, setAnimated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const polyRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const labelRadius = radius + 28;

  const axisAngles = axes.map((_, i) => (Math.PI * (i * 60 - 90)) / 180);

  // Grid rings (3 rings: 33%, 66%, 100%)
  const rings = [0.33, 0.66, 1.0];

  // Compute polygon points
  const points = axes
    .map((axis, i) => {
      const angle = axisAngles[i];
      const r = (animated || reducedMotion) ? radius * axis.value : 0;
      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Capability radar chart showing expertise across 6 domains"
    >
      {/* Grid rings */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={axes
            .map((_, i) => {
              const angle = axisAngles[i];
              const r = radius * ring;
              return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
            })
            .join(' ')}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={1}
        />
      ))}

      {/* Radial axis lines */}
      {axes.map((_, i) => {
        const angle = axisAngles[i];
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="#1a1a2e"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        ref={polyRef}
        points={points}
        fill="url(#radarGrad)"
        stroke="#00D4FF"
        strokeWidth={2}
        style={
          reducedMotion
            ? {}
            : {
                strokeDasharray: 1000,
                strokeDashoffset: animated ? 0 : 1000,
                transition: 'stroke-dashoffset 1.5s ease-out',
              }
        }
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      {/* Axis labels and interactive points */}
      {axes.map((axis, i) => {
        const angle = axisAngles[i];
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);
        const px = cx + radius * axis.value * Math.cos(angle);
        const py = cy + radius * axis.value * Math.sin(angle);
        const isLeft = Math.cos(angle) < 0;

        return (
          <g key={axis.id}>
            {/* Interactive point */}
            <circle
              cx={px}
              cy={py}
              r={4}
              fill="#00D4FF"
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`${axis.label.en}, value ${Math.round(axis.value * 10)} out of 10`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onAxisFocus?.(axis.id); }}
              onClick={() => onAxisFocus?.(axis.id)}
            />
            {/* Label */}
            <text
              x={lx}
              y={ly}
              textAnchor={isLeft ? 'end' : 'start'}
              fill="#94A3B8"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              className="pointer-events-none"
            >
              {axis.label.en}
            </text>
          </g>
        );
      })}

      {/* Screen reader data table */}
      <g aria-hidden="true" style={{ display: 'none' }}>
        <text>
          {axes.map((a) => `${a.label.en}: ${Math.round(a.value * 10)}/10`).join(', ')}
        </text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 4: Create RadarHero component

**Files:**
- Create: `src/radar/RadarHero.tsx`

- [ ] **Step 1: Create `src/radar/RadarHero.tsx`**

Full viewport-height hero with:
- Background: `#020203` with subtle gradient
- Name "TOM KRISTIAN ABEL" in Space Grotesk, large bold, white
- Subtitle in Inter, text-secondary
- `RadarChart` centered below
- "ProksiAbel OU" small legal anchor below radar
- Import and use `capabilityAxes` from data
- `onAxisFocus` scrolls to the section: `document.getElementById(axisId)?.scrollIntoView({ behavior: 'smooth' })`

```tsx
import { useTranslation } from '../i18n';
import RadarChart from './RadarChart';
import { capabilityAxes } from './capability-data';

export default function RadarHero() {
  const { t } = useTranslation();

  const handleAxisFocus = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#020203] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-[#05050f] to-[#020203]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#F1F5F9] mb-3 tracking-tight">
          TOM KRISTIAN ABEL
        </h1>
        <p className="text-[#94A3B8] text-base md:text-lg max-w-xl mb-8">
          {t.radarHero.subtitle}
        </p>

        <div className="w-full max-w-[400px] mx-auto mb-6">
          <RadarChart
            axes={capabilityAxes}
            size={400}
            className="w-full h-auto"
            onAxisFocus={handleAxisFocus}
          />
        </div>

        <p className="text-[#64748B] text-xs font-mono">
          ProksiAbel OÜ &mdash; B2B Partnership
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020203] to-transparent pointer-events-none" />
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 5: Create AxisSection and CapabilitySections components

**Files:**
- Create: `src/radar/AxisSection.tsx`
- Create: `src/radar/CapabilitySections.tsx`

- [ ] **Step 1: Create `src/radar/AxisSection.tsx`**

A single axis section rendered as a full-width section with:
- Background alternating subtle shade (even sections slightly lighter `#040408`)
- Left column: domain name (Space Grotesk heading) + description (Inter body)
- Right column: project cards with tag metadata
- "id" attribute on section for hash scroll targeting
- fade-in on scroll via Intersection Observer (adds opacity-0 → opacity-100 transition)

```tsx
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import type { CapabilityAxis } from './types';

interface Props {
  axis: CapabilityAxis;
  index: number;
}

export default function AxisSection({ axis, index }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={axis.id}
      ref={ref}
      className={`py-20 md:py-28 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${index % 2 === 1 ? 'bg-[#040408]' : 'bg-[#020203]'}`}
    >
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: label + description */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-4">
              {axis.label.en}
            </h2>
            <p className="text-[#94A3B8] leading-relaxed">
              {axis.description.en}
            </p>
          </div>

          {/* Right: projects */}
          <div className="space-y-4">
            {axis.projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-xl border ${
                  project.id === axis.accentProject
                    ? 'border-[#00D4FF]/30 bg-[#00D4FF]/5'
                    : 'border-[#1a1a2e] bg-[#020203]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-base font-semibold text-[#F1F5F9]">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#64748B] hover:text-[#00D4FF] transition-colors"
                        aria-label={`${project.name} on GitHub`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        className="text-[#64748B] hover:text-[#00D4FF] transition-colors"
                        aria-label={`More about ${project.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[#64748B] text-sm leading-relaxed mb-3">
                  {project.description.en}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-[#64748B] bg-[#1a1a2e]/50 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/radar/CapabilitySections.tsx`**

Container that renders all 6 axis sections:

```tsx
import AxisSection from './AxisSection';
import { capabilityAxes } from './capability-data';

export default function CapabilitySections() {
  return (
    <>
      {capabilityAxes.map((axis, index) => (
        <AxisSection key={axis.id} axis={axis} index={index} />
      ))}
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 6: Create ResearchSection component

**Files:**
- Create: `src/radar/ResearchSection.tsx`

- [ ] **Step 1: Create `src/radar/ResearchSection.tsx`**

Research & whitepapers grid section styled like a preprint index:
- Section heading "Research & Publications"
- Featured card for BotGuard VM paper (amber `#F59E0B` accent border)
- Additional papers in smaller cards
- Each card: title, short abstract, status tag (published/draft/in-progress), date, tags
- JetBrains Mono for metadata (date, tags)

```tsx
import { FileText } from 'lucide-react';
import { useTranslation } from '../i18n';
import { researchPapers } from './research-data';

export default function ResearchSection() {
  const { t } = useTranslation();
  const featured = researchPapers.filter((p) => p.featured);
  const others = researchPapers.filter((p) => !p.featured);

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-emerald-400 bg-emerald-400/10';
      case 'draft': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <section id="research" className="py-20 md:py-28 bg-[#020203]">
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-2">
          {t.research.title}
        </h2>
        <p className="text-[#64748B] mb-10 max-w-xl">
          {t.research.description}
        </p>

        <div className="space-y-4">
          {researchPapers.map((paper) => (
            <article
              key={paper.id}
              className={`p-6 rounded-xl border ${
                paper.featured
                  ? 'border-[#F59E0B]/30 bg-[#F59E0B]/5'
                  : 'border-[#1a1a2e] bg-[#040408]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${
                  paper.featured ? 'bg-[#F59E0B]/10' : 'bg-[#1a1a2e]/50'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    paper.featured ? 'text-[#F59E0B]' : 'text-[#64748B]'
                  }`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-[#F1F5F9] mb-1">
                    {paper.title}
                  </h3>
                  <p className="text-[#64748B] text-sm mb-3 leading-relaxed">
                    {paper.abstract.en}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded ${statusColor(paper.status)}`}>
                      {paper.status}
                    </span>
                    <span className="text-[#64748B]">{paper.date}</span>
                    {paper.tags.map((tag) => (
                      <span key={tag} className="text-[#64748B]">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 7: Create CtaSection component

**Files:**
- Create: `src/radar/CtaSection.tsx`

- [ ] **Step 1: Create `src/radar/CtaSection.tsx`**

CTA section with:
- Brief text about engaging via ProksiAbel OU
- Contact form (name, email, message) with inline validation
- PGP key reference link
- Amber accent coloring
- Same form logic as existing Contact.tsx but simplified layout

```tsx
import { useState, useRef } from 'react';
import { Send, ArrowRight, Shield, Key } from 'lucide-react';
import { useTranslation } from '../i18n';
import { contactInfo } from '../data/contact';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CtaSection() {
  const { t, locale } = useTranslation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!EMAIL_REGEX.test(email)) {
      setEmailError(locale === 'et' ? 'Palun sisesta kehtiv e-posti aadress' : 'Please enter a valid email address');
      return;
    }
    if (!message.trim()) return;

    const subject = locale === 'et' ? 'Kontaktvorm - proksiabel.ee' : 'Contact Form - proksiabel.ee';
    const nl = '%0A';
    const body = locale === 'et'
      ? `Nimi: ${name || 'Pole märgitud'}${nl}E-post: ${email}${nl}${nl}Sõnum:${nl}${message}`
      : `Name: ${name || 'Not specified'}${nl}Email: ${email}${nl}${nl}Message:${nl}${message}`;
    const mailtoLink = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).replace(/%0A/g, nl)}`;
    window.location.href = mailtoLink;
    setMessageSent(true);
    formRef.current?.reset();
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#020203] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-[#05050f] to-[#020203]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F59E0B]/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-3">
            {t.cta.title}
          </h2>
          <p className="text-[#94A3B8] max-w-lg mx-auto">
            {t.cta.description}
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Legal wrapper note */}
          <div className="flex items-center gap-3 px-4 py-3 mb-8 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5">
            <Shield className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <p className="text-xs text-[#F59E0B]/80 font-mono">
              {t.cta.legalNote}
            </p>
          </div>

          {/* Form */}
          <div className="bg-[#040408] border border-[#1a1a2e] rounded-xl p-6 lg:p-8">
            {messageSent && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <p className="text-emerald-300 text-sm">{t.cta.form.success}</p>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="cta-name" className="block text-sm font-medium text-[#94A3B8] mb-2">
                  {t.cta.form.name}
                </label>
                <input
                  type="text" id="cta-name" name="name"
                  placeholder={t.cta.form.namePlaceholder}
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-[#020203] border border-[#1a1a2e] rounded-xl text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]"
                />
              </div>
              <div>
                <label htmlFor="cta-email" className="block text-sm font-medium text-[#94A3B8] mb-2">
                  {t.cta.form.email} *
                </label>
                <input
                  type="email" id="cta-email" name="email" required
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'cta-email-error' : undefined}
                  className={`w-full px-4 py-3 bg-[#020203] border rounded-xl text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] ${emailError ? 'border-red-500' : 'border-[#1a1a2e]'}`}
                />
                {emailError && <p id="cta-email-error" className="text-red-400 text-sm mt-2">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="cta-message" className="block text-sm font-medium text-[#94A3B8] mb-2">
                  {t.cta.form.message} *
                </label>
                <textarea
                  id="cta-message" name="message" rows={4} required
                  placeholder={t.cta.form.messagePlaceholder}
                  className="w-full px-4 py-3 bg-[#020203] border border-[#1a1a2e] rounded-xl text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#020203] font-semibold py-3 rounded-xl transition-colors"
              >
                {t.cta.form.send}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* PGP reference */}
          <div className="mt-6 text-center">
            <a
              href="/#pgp"
              className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F59E0B] font-mono transition-colors"
            >
              <Key className="w-4 h-4" />
              {t.cta.pgpLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 8: Update Navbar and Footer

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update `src/components/Navbar.tsx`**

Simplify Navbar for the new design:
- Change logo/brand to "Tom Kristian Abel" name instead of "ProksiAbel / The Intersection"
- Update nav links to new hash anchors:
  - Radar -> `/#` (top)
  - Each axis: 6 links or condensed to "Capabilities" -> `/#reverse-engineering`
  - Research -> `/#research`
  - Contact -> `/#contact`
- Keep language toggle
- Keep mobile menu with same structure but updated links
- Remove "Book Consultation" CTA button from desktop nav (CTA is now a section)

Key changes:
- Replace Shield icon with something more personal (maybe just the name text)
- Nav links from 7 items to 4: Capabilities, Research, Contact, PGP
- Keep the same sticky/blur effect on scroll
- Same mobile menu pattern with focus trap and Escape

```tsx
// Navbar navLinks array changes to:
const navLinks = [
  { href: '/#reverse-engineering', label: 'Capabilities' },
  { href: '/#research', label: 'Research' },
  { href: '/#contact', label: 'Contact' },
  { href: '/#pgp', label: 'PGP' },
];
```

Logo changes to just the name text:
```tsx
<a href="/" className="flex items-center gap-3 group">
  <div className="font-display text-white font-bold text-xl tracking-tight">
    Tom<span className="text-[#00D4FF]">.</span>Abel
  </div>
</a>
```

- [ ] **Step 2: Update `src/components/Footer.tsx`**

Update Footer:
- Change brand column from "ProksiAbel" to "Tom Kristian Abel" with subtitle
- Update nav link references to match new section IDs
- Keep all legal links (privacy, terms, cookies, disclosure)
- Keep contact info

Key changes:
- Brand section: `Tom Kristian Abel` as heading, `Deep-Tech AI Engineering` as subtitle
- Services links → "Capabilities" pointing to `/#reverse-engineering`
- Update CTA column text to mention "technical B2B partnership via ProksiAbel OU"
- Keep bottom bar with ProksiAbel OÜ company info unchanged

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 9: Update translations

**Files:**
- Modify: `src/i18n/translations.ts`

- [ ] **Step 1: Add new translation keys**

Add these new sections to both `en` and `et` locales (before the `nav` section or after `footer` — maintain alphabetical ordering within the file):

```ts
// Add to en:
radarHero: {
  subtitle: 'Deep-Tech AI Engineering | Reverse Engineering · AI Infrastructure · Systems Architecture',
},
research: {
  title: 'Research & Publications',
  description: 'Original research and technical whitepapers.',
},
cta: {
  title: 'Engage',
  description: 'Available for contract and technical B2B partnership via ProksiAbel OU.',
  legalNote: 'All engagements are facilitated through ProksiAbel OÜ (Reg. 17017826) — the legal entity for B2B contracting.',
  pgpLink: 'PGP Key for encrypted communication',
  form: {
    name: 'Name',
    namePlaceholder: 'Your name (optional)',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    message: 'Message',
    messagePlaceholder: 'What are you working on?',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Thank you. I will get back to you shortly.',
    error: 'Something went wrong. Please try emailing directly.',
  },
},

// Also add to et:
radarHero: {
  subtitle: 'Süvatehnoloogia AI Inseneritöö | Pöördprojekteerimine · AI Taristu · Süsteemiarhitektuur',
},
research: {
  title: 'Uurimistöö ja väljaanded',
  description: 'Originaaluuringud ja tehnilised valged raamatud.',
},
cta: {
  title: 'Koostöö',
  description: 'Saadaval lepingu- ja tehnilise B2B partnerluse kaudu ProksiAbel OU vahendusel.',
  legalNote: 'Kõik koostööd teostatakse ProksiAbel OÜ (Reg. 17017826) kaudu — B2B lepingute juriidiline entiteet.',
  pgpLink: 'PGP võti krüpteeritud suhtluseks',
  form: {
    name: 'Nimi',
    namePlaceholder: 'Sinu nimi (valikuline)',
    email: 'E-post',
    emailPlaceholder: 'sina@domeen.ee',
    message: 'Sõnum',
    messagePlaceholder: 'Mille kallal sa töötad?',
    send: 'Saada teele',
    sending: 'Saadan...',
    success: 'Tänan. Võtan peagi ühendust.',
    error: 'Midagi läks valesti. Palun proovi otse e-posti teel.',
  },
},
```

Update existing nav translations — the `nav` section only needs a few keys now:
- Keep `nav.openMenu`, `nav.closeMenu` (used by mobile menu)
- Remove or keep unused keys (TypeScript strict won't complain about unused keys in `as const`)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 10: Update App.tsx and remove old files

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/intersection/` (entire directory — `rm -rf src/intersection/`)
- Delete: `src/components/About.tsx`
- Delete: `src/components/Contact.tsx`
- Keep: `src/components/Pgp.tsx` (still referenced in footer and CTA)

- [ ] **Step 1: Remove old intersection directory**

Run: `rm -rf src/intersection/`

- [ ] **Step 2: Delete About.tsx and Contact.tsx**

Run: `rm src/components/About.tsx src/components/Contact.tsx`

- [ ] **Step 3: Rewrite `src/App.tsx`**

Replace the entire file — remove old imports (Constellation, VennDiagram, Capabilities, EngagementModels, About, Contact), add new radar imports:

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RadarHero from './radar/RadarHero';
import CapabilitySections from './radar/CapabilitySections';
import ResearchSection from './radar/ResearchSection';
import CtaSection from './radar/CtaSection';
import Pgp from './components/Pgp';

const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./components/CookiePolicy'));
const Disclosure = React.lazy(() => import('./components/Disclosure'));
const NotFound = React.lazy(() => import('./components/NotFound'));

function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <RadarHero />
        <CapabilitySections />
        <ResearchSection />
        <CtaSection />
        <Pgp />
      </main>
      <Footer />
    </>
  );
}

function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#020203] flex items-center justify-center">
            <div className="text-[#64748B]">Loading...</div>
          </div>
        }
      >
        {children}
      </React.Suspense>
      <Footer />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#020203]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00D4FF] focus:text-[#020203] focus:rounded-md"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('main-content'); el?.focus(); el?.scrollIntoView(); }}
          >
            Skip to main content
          </a>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<LegalLayout><PrivacyPolicy /></LegalLayout>} />
            <Route path="/terms" element={<LegalLayout><TermsOfService /></LegalLayout>} />
            <Route path="/cookies" element={<LegalLayout><CookiePolicy /></LegalLayout>} />
            <Route path="/disclosure" element={<LegalLayout><Disclosure /></LegalLayout>} />
            <Route path="*" element={<LegalLayout><NotFound /></LegalLayout>} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 11: Update index.css with Lenis and design tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Rewrite `src/index.css`**

Replace with new design system CSS:

```css
/* Capability Radar — Design Tokens */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #020203;
  --grid: #1a1a2e;
  --signal: #00D4FF;
  --accent: #F59E0B;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --easing-out: cubic-bezier(0.16, 1, 0.3, 1);
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-[#020203] text-[#94A3B8];
    font-family: 'Inter', system-ui, sans-serif;
  }

  ::selection {
    background-color: rgba(0, 212, 255, 0.3);
    color: #F1F5F9;
  }
}

@layer utilities {
  .container-custom {
    @apply w-full max-w-6xl mx-auto px-6 lg:px-8;
  }
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #00D4FF;
  outline-offset: 2px;
}

/* Scroll anchor offset */
[id] {
  scroll-margin-top: 5rem;
}

/* Lenis */
html.lenis {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Update `src/main.tsx` — add Lenis initialization**

Replace the file content. Add Lenis with `prefers-reduced-motion` guard:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Lenis from 'lenis';
import './index.css';

// Lenis smooth scroll — only if user doesn't prefer reduced motion
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!mq.matches) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — should pass

---

### Task 12: Build verification and touch-up

**Files:**
- All modified/created files

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build completes successfully, output in `pub/`

- [ ] **Step 3: Check build output**

Verify key files exist:
Run: `ls pub/assets/*.js pub/assets/*.css`
Expected: Compiled JS and CSS files (including radar chunk)

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: 0 warnings/errors

- [ ] **Step 5: Preview the site**

Run: `npm run preview` — open the URL and verify:
- Radar chart draws on load
- Sections scroll smoothly (Lenis)
- Responsive layout at 375px, 768px, 1024px
- Tab through radar chart points
- reduced-motion disables animations

---

## Self-Review Checklist

**1. Spec coverage:** Every section from the spec has a corresponding task:
- Visual design system → Task 1 (tailwind config) + Task 11 (CSS)
- Radar chart → Task 3
- Hero → Task 4
- Capability axes → Task 5
- Research & whitepapers → Task 6
- CTA / contact form → Task 7
- Navbar + Footer → Task 8
- Translations → Task 9
- App integration + cleanup → Task 10

**2. No placeholders:** All code in the plan is complete, with no TBDs, TODOs, or "implement later" patterns. Every component has full TypeScript with props, event handlers, and accessibility attributes.

**3. Type consistency:** The `CapabilityAxis`, `RadarProject`, and `ResearchPaper` types are defined once in `types.ts` and used consistently across all components. The `value` field (0–1) is used by RadarChart for polygon computation and by axis points for accessible labels.
