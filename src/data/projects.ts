export type VennZone =
  | 'security'
  | 'ai'
  | 'systems'
  | 'sec-ai'
  | 'sec-sys'
  | 'ai-sys'
  | 'center';

export type Domain = 'security' | 'ai' | 'systems';

export type NodeType = 'project' | 'domain' | 'meta' | 'center';

export type ProjectStatus = 'active' | 'stable' | 'published' | 'archived';

export interface Project {
  id: string;
  title: string;
  tagline: { en: string; et: string };
  description: { en: string; et: string };
  zones: VennZone[];
  domains: Domain[];
  tags: string[];
  links: { label: string; url: string }[];
  nodeType: NodeType;
  nodeWeight: number;
  status: ProjectStatus;
}

export interface ZoneContent {
  id: VennZone;
  title: { en: string; et: string };
  description: { en: string; et: string };
}

export const projects: Project[] = [
  {
    id: 'stop-slop-drop-top',
    title: 'stop-slop-drop-top',
    tagline: {
      en: 'LLM detection bypass + MCP integration for autonomous content rewriting',
      et: 'LLM tuvastuse möödaviik + MCP integratsioon autonoomseks sisu ümberkirjutamiseks',
    },
    description: {
      en: 'Reverse-engineered commercial AI detectors to build an evaluation pipeline for synthetic content. Integrated with MCP servers to enable Claude Code agents to autonomously evaluate and rewrite content. CLI and API aggregation backend with async batch processing for CI/CD pipelines.',
      et: 'Pöördprojekteeris kommerts AI detektoreid, et ehitada hindamistorustik sünteetilisele sisule. Integreeris MCP serveritega, võimaldades Claude Code agentidel autonoomselt sisu hinnata ja ümber kirjutada. CLI ja API agregatsiooni backend asünkroonse pakettöötlusega CI/CD torustike jaoks.',
    },
    zones: ['sec-ai'],
    domains: ['security', 'ai'],
    tags: ['Node.js', 'Python', 'MCP', 'CI/CD'],
    links: [{ label: 'GitHub', url: 'https://github.com/tkabel' }],
    nodeType: 'project',
    nodeWeight: 9,
    status: 'active',
  },
  {
    id: 'guardian-llm',
    title: 'Guardian LLM',
    tagline: {
      en: 'AI safety evaluation framework for red-teaming LLM guardrails',
      et: 'AI ohutuse hindamise raamistik LLM piirete punaseks testimiseks',
    },
    description: {
      en: 'Designed a comprehensive evaluation framework for testing AI safety guardrails. Built adversarial prompt generation pipelines, automated bypass detection, and scoring rubrics for LLM safety systems. Published findings on common failure modes in commercial guardrail implementations.',
      et: 'Kavandas põhjaliku hindamisraamistiku AI ohutuspiirete testimiseks. Ehitas vastand-promptide genereerimise torustikud, automaatse möödaviigutuvastuse ja hindamismaatriksid LLM ohutussüsteemidele.',
    },
    zones: ['sec-ai'],
    domains: ['security', 'ai'],
    tags: ['Python', 'LLM', 'Adversarial', 'Safety'],
    links: [],
    nodeType: 'project',
    nodeWeight: 7,
    status: 'active',
  },
  {
    id: 'echoguard',
    title: 'EchoGuard',
    tagline: {
      en: 'AI voice cloning red-teaming pipeline on GPU cloud infrastructure',
      et: 'AI hääleklonimise punase meeskonna torustik GPU pilvetaristul',
    },
    description: {
      en: 'End-to-end AI voice cloning red-teaming pipeline using RunPod Serverless GPU cloud compute. FastAPI backend with Redis caching and async job queues orchestrating Demucs, WhisperX, and RMVPE models for voice synthesis analysis and anti-spoofing evaluation.',
      et: 'Terviklik AI hääleklonimise punase meeskonna torustik, kasutades RunPod Serverless GPU pilvandmetöötlust. FastAPI backend Redis vahemäluga ja asünkroonsete tööjärjekordadega, orkestreerides Demucs, WhisperX ja RMVPE mudeleid häälesünteesi analüüsiks.',
    },
    zones: ['ai-sys'],
    domains: ['ai', 'systems'],
    tags: ['FastAPI', 'Python', 'GPU', 'RunPod', 'Redis'],
    links: [{ label: 'GitHub', url: 'https://github.com/tkabel' }],
    nodeType: 'project',
    nodeWeight: 8,
    status: 'active',
  },
  {
    id: 'matx',
    title: 'MatX.ee',
    tagline: {
      en: 'Adaptive math learning platform with BKT-based knowledge tracing',
      et: 'Adaptiivne matemaatika õppeplatvorm BKT-põhise teadmiste jälgimisega',
    },
    description: {
      en: 'Full-stack adaptive math learning platform for Estonian students. Bayesian Knowledge Tracing engine drives personalized exercise recommendations. React 18 frontend, Express API, PostgreSQL with Drizzle ORM. Designed the entire data model, recommendation algorithm, and bilingual UI.',
      et: 'Full-stack adaptiivne matemaatika õppeplatvorm Eesti õpilastele. Bayesi teadmiste jälgimise mootor juhib personaliseeritud ülesannete soovitusi. React 18 frontend, Express API, PostgreSQL Drizzle ORM-iga.',
    },
    zones: ['ai-sys'],
    domains: ['ai', 'systems'],
    tags: ['TypeScript', 'React', 'PostgreSQL', 'ML'],
    links: [],
    nodeType: 'project',
    nodeWeight: 7,
    status: 'active',
  },
  {
    id: 'vooglaadija',
    title: 'Vooglaadija',
    tagline: {
      en: 'High-performance EV charging network backend in Go',
      et: 'Suure jõudlusega elektriautode laadimisvõrgu backend Go keeles',
    },
    description: {
      en: 'Designed and built a production-grade backend for an EV charging network. Handles real-time station status, session management, and OCPP protocol communication. Custom Go HTTP server with WebSocket support for live charging data.',
      et: 'Kavandas ja ehitas tootmiskõlbliku backend-i elektriautode laadimisvõrgule. Haldab reaalajas jaama staatuseid, sessioone ja OCPP protokolli suhtlust.',
    },
    zones: ['systems'],
    domains: ['systems'],
    tags: ['Go', 'WebSocket', 'OCPP', 'PostgreSQL'],
    links: [],
    nodeType: 'project',
    nodeWeight: 6,
    status: 'stable',
  },
  {
    id: 'fingerprintproxy',
    title: 'fingerprintproxy',
    tagline: {
      en: 'Production-grade TLS fingerprinting forward proxy with 80+ browser profiles',
      et: 'Tootmiskõlblik TLS sõrmejälje puhverserver 80+ brauseriprofiiliga',
    },
    description: {
      en: 'Production-grade TLS fingerprinting forward proxy with 80+ browser profiles, MITM support, and per-request fingerprint selection. Custom http.RoundTripper for fine-grained TLS handshake control. Built for security testing at scale.',
      et: 'Tootmiskõlblik TLS sõrmejälje puhverserver 80+ brauseriprofiiliga, MITM toega ja päringupõhise sõrmejälje valikuga. Kohandatud http.RoundTripper peene TLS käepigistuse kontrolliks.',
    },
    zones: ['sec-sys'],
    domains: ['security', 'systems'],
    tags: ['Go', 'TLS', 'HTTP/2', 'JA3'],
    links: [{ label: 'GitHub', url: 'https://github.com/tkabel' }],
    nodeType: 'project',
    nodeWeight: 9,
    status: 'active',
  },
  {
    id: 'openclaw-hardening',
    title: 'OpenClaw Hardening',
    tagline: {
      en: 'Security hardening and architecture review for open-source cloud platform',
      et: 'Turvapaikamine ja arhitektuuri ülevaatus avatud lähtekoodiga pilveplatvormile',
    },
    description: {
      en: 'Conducted comprehensive security hardening of the OpenClaw cloud platform. Identified and remediated vulnerabilities in container isolation, network policies, and authentication flows. Designed zero-trust service mesh architecture for multi-tenant deployments.',
      et: 'Viis läbi põhjaliku OpenClaw pilveplatvormi turvapaikamise. Tuvastas ja kõrvaldas nõrkused konteinerite isolatsioonis, võrgupoliitikates ja autentimisvoogudes.',
    },
    zones: ['sec-sys'],
    domains: ['security', 'systems'],
    tags: ['Kubernetes', 'Zero-Trust', 'Container Security', 'Go'],
    links: [],
    nodeType: 'project',
    nodeWeight: 7,
    status: 'stable',
  },
  {
    id: 'botguard-research',
    title: 'BotGuard VM Research',
    tagline: {
      en: "Reverse-engineered Google's BotGuard VM — opcode architecture and anti-debug defenses",
      et: 'Google\'i BotGuard VM pöördprojekteerimine — opkoodi arhitektuur ja anti-debug kaitsed',
    },
    description: {
      en: "Comprehensive reverse engineering of Google's BotGuard virtual machine. Mapped the complete opcode architecture, analyzed chronometric anti-debug defenses, documented anti-logger mechanisms, and developed a Puppet bypass strategy using go-rod. Published original research advancing public understanding of obfuscated JavaScript VMs.",
      et: 'Google\'i BotGuard virtuaalmasina põhjalik pöördprojekteerimine. Kaardistas täieliku opkoodi arhitektuuri, analüüsis kronomeetrilisi anti-debug kaitsemehhanisme ja arendas Puppet möödaviigu strateegiat.',
    },
    zones: ['security'],
    domains: ['security'],
    tags: ['Reverse Engineering', 'VM', 'JavaScript', 'Security'],
    links: [],
    nodeType: 'project',
    nodeWeight: 10,
    status: 'published',
  },
  {
    id: 'raft-go',
    title: 'Raft Consensus (Go)',
    tagline: {
      en: 'Clean-room Raft consensus implementation in Go for distributed systems research',
      et: 'Raft konsensuse Go implementatsioon hajussüsteemide uurimiseks',
    },
    description: {
      en: 'Implemented the Raft consensus algorithm from the paper in idiomatic Go. Includes leader election, log replication, snapshotting, and cluster membership changes. Built as a teaching tool and foundation for distributed systems experimentation.',
      et: 'Implementeeris Raft konsensuse algoritmi akadeemilisest artiklist idiomaatilises Go keeles. Sisaldab liidrivalimisi, logi replikatsiooni, hetktõmmiseid ja klastri liikmelisuse muudatusi.',
    },
    zones: ['systems'],
    domains: ['systems'],
    tags: ['Go', 'Distributed Systems', 'Consensus', 'Raft'],
    links: [{ label: 'GitHub', url: 'https://github.com/tkabel' }],
    nodeType: 'project',
    nodeWeight: 6,
    status: 'stable',
  },
  {
    id: 'smart-id-fido2',
    title: 'Smart-ID+ / FIDO2',
    tagline: {
      en: 'Security analysis and advocacy for Estonian digital identity standards',
      et: 'Eesti digitaalse identiteedi standardite turvaanalüüs ja propageerimine',
    },
    description: {
      en: 'Deep technical analysis of Estonian Smart-ID authentication protocols. Compared cryptographic guarantees against FIDO2/WebAuthn standards. Published advocacy for upgrading national identity infrastructure to phishing-resistant authentication.',
      et: 'Eesti Smart-ID autentimisprotokollide põhjalik tehniline analüüs. Võrdles krüptograafilisi garantiisid FIDO2/WebAuthn standarditega.',
    },
    zones: ['security'],
    domains: ['security'],
    tags: ['Cryptography', 'FIDO2', 'Authentication', 'Security'],
    links: [],
    nodeType: 'project',
    nodeWeight: 5,
    status: 'published',
  },
  {
    id: 'bg-decompiler',
    title: 'bg-vm-decompiler',
    tagline: {
      en: 'Open-source decompiler and CFG analyzer for BotGuard VM bytecode',
      et: 'Avatud lähtekoodiga dekompilaator BotGuard VM baitkoodi jaoks',
    },
    description: {
      en: 'Open-source decompiler and static analyzer for BotGuard VM bytecode. Enables researchers to analyze opcode sequences without dynamic execution. Includes control-flow graph reconstruction and instruction-level static analysis.',
      et: 'Avatud lähtekoodiga dekompilaator ja staatiline analüsaator BotGuard VM baitkoodi jaoks. Võimaldab teadlastel analüüsida opkoodi järjestusi ilma dünaamilise täitmiseta.',
    },
    zones: ['security'],
    domains: ['security'],
    tags: ['Go', 'Compiler', 'Static Analysis', 'CLI'],
    links: [{ label: 'GitHub', url: 'https://github.com/tkabel' }],
    nodeType: 'project',
    nodeWeight: 7,
    status: 'active',
  },
  {
    id: 'k8s-security-operator',
    title: 'Kubernetes Security Operator',
    tagline: {
      en: 'Automated security policy enforcement for Kubernetes clusters',
      et: 'Automatiseeritud turvapoliitika jõustamine Kubernetes klastritele',
    },
    description: {
      en: 'Built a Kubernetes operator that continuously enforces security policies across multi-tenant clusters. Automated vulnerability scanning, network policy generation, and compliance reporting. Integrated with OPA/Gatekeeper for policy-as-code.',
      et: 'Ehitas Kubernetes operaatori, mis pidevalt jõustab turvapoliitikaid üle mitme rentniku klastrite. Automatiseeris nõrkuste skaneerimise ja vastavusaruandluse.',
    },
    zones: ['sec-sys'],
    domains: ['security', 'systems'],
    tags: ['Kubernetes', 'Go', 'OPA', 'Security'],
    links: [],
    nodeType: 'project',
    nodeWeight: 5,
    status: 'stable',
  },
  // Domain anchor nodes — hollow rings in the constellation
  {
    id: 'domain-security',
    title: 'Security',
    tagline: { en: 'Domain', et: 'Domeen' },
    description: {
      en: 'Offensive security research, reverse engineering, and adversarial testing. The domain of breaking things to understand how they defend.',
      et: 'Ründeturbe uuringud, pöördprojekteerimine ja vastandtestimine. Asjade lõhkumise domeen, et mõista, kuidas nad kaitsevad.',
    },
    zones: ['security'],
    domains: ['security'],
    tags: [],
    links: [],
    nodeType: 'domain',
    nodeWeight: 10,
    status: 'active',
  },
  {
    id: 'domain-ai',
    title: 'AI/ML',
    tagline: { en: 'Domain', et: 'Domeen' },
    description: {
      en: 'AI infrastructure, model deployment, GPU orchestration, and adversarial ML. The domain of making intelligence operational at scale.',
      et: 'AI taristu, mudelite juurutamine, GPU orkestreerimine ja vastand-ML. Intellekti operatiivseks muutmise domeen mastaabis.',
    },
    zones: ['ai'],
    domains: ['ai'],
    tags: [],
    links: [],
    nodeType: 'domain',
    nodeWeight: 10,
    status: 'active',
  },
  {
    id: 'domain-systems',
    title: 'Systems',
    tagline: { en: 'Domain', et: 'Domeen' },
    description: {
      en: 'Systems engineering, distributed architectures, and infrastructure automation. The domain of building foundations that hold under pressure.',
      et: 'Süsteemitehnika, hajusarhitektuurid ja taristu automatiseerimine. Vundamentide ehitamise domeen, mis surve all püsivad.',
    },
    zones: ['systems'],
    domains: ['systems'],
    tags: [],
    links: [],
    nodeType: 'domain',
    nodeWeight: 10,
    status: 'active',
  },
  // Meta nodes — diamond shapes
  {
    id: 'publications',
    title: 'Publications',
    tagline: {
      en: 'Research papers, technical analyses, and published findings',
      et: 'Teadusartiklid, tehnilised analüüsid ja avaldatud leiud',
    },
    description: {
      en: 'Published research on BotGuard VM internals, adversarial AI evaluation methodology, and distributed systems design patterns.',
      et: 'Avaldatud uurimistöö BotGuard VM sisearhitektuurist, vastand-AI hindamismetoodikast ja hajussüsteemide disainimustritest.',
    },
    zones: ['security'],
    domains: ['security'],
    tags: [],
    links: [],
    nodeType: 'meta',
    nodeWeight: 6,
    status: 'published',
  },
  // Center node — starburst shape, the core thesis
  {
    id: 'proksiabel',
    title: 'ProksiAbel',
    tagline: {
      en: 'Security × AI × Systems — the intersection where deep tech gets built',
      et: 'Turve × AI × Süsteemid — ristumiskoht, kus süvatehnoloogiat ehitatakse',
    },
    description: {
      en: 'Most AI consultants cannot red-team their own pipeline. Most security consultants cannot read a model card. Most systems engineers cannot build adversarial tooling. The intersection of all three is where ProksiAbel operates — designing, building, and breaking resilient intelligent systems.',
      et: 'Enamik AI konsultante ei suuda oma torustikku punaselt testida. Enamik turbekonsultante ei oska mudelikaarti lugeda. Enamik süsteemiinsenere ei suuda vastandtööriistu ehitada. Kõigi kolme ristumiskoht on see, kus ProksiAbel tegutseb — projekteerides, ehitades ja lõhkudes vastupidavaid intelligentseid süsteeme.',
    },
    zones: ['center'],
    domains: ['security', 'ai', 'systems'],
    tags: [],
    links: [],
    nodeType: 'center',
    nodeWeight: 10,
    status: 'active',
  },
];

export const zoneContent: ZoneContent[] = [
  {
    id: 'security',
    title: { en: 'Offensive Security', et: 'Ründeturve' },
    description: {
      en: 'Security at the edge of what detection systems can identify. This is not compliance checkbox testing — it is reverse-engineering hostile VMs, building custom TLS fingerprinting proxies, and understanding how fraud detection networks think. The BotGuard VM research exemplifies this zone: months of decompilation, opcode mapping, and anti-debug analysis that produced original findings about how Google protects its reCAPTCHA infrastructure. Smart-ID+ protocol analysis pushes for national infrastructure that resists phishing by design. The security work here is not about running tools — it is about understanding systems so deeply that you can break them, then explain exactly how they should be rebuilt.',
      et: 'Turve selle piiril, mida tuvastussüsteemid suudavad tuvastada. See ei ole vastavuskontrolli testimine — see on vaenulike VM-de pöördprojekteerimine, kohandatud TLS sõrmejäljeprokside ehitamine ja pettusetuvastusvõrgustike mõttemudeli mõistmine. BotGuard VM uuring näitlikustab seda tsooni: kuudepikkune dekompileerimine, opkoodide kaardistamine ja anti-debug analüüs, mis andis originaalseid leide selle kohta, kuidas Google oma reCAPTCHA taristut kaitseb. Smart-ID+ protokolli analüüs survestab riiklikku taristut, mis oleks disainilt õngitsuskindel.',
    },
  },
  {
    id: 'ai',
    title: { en: 'AI/ML Infrastructure', et: 'AI/ML Taristu' },
    description: {
      en: 'Making AI actually work at scale. The gap between a Jupyter notebook and a production system is vast — GPU orchestration, serverless inference, async job queues, model versioning, and monitoring pipelines. This zone covers the infrastructure that turns research artifacts into operational systems. From deploying voice analysis pipelines on RunPod to designing MCP-based agentic workflows, the focus is on building AI systems that are reliable, observable, and maintainable — not just impressive in a demo.',
      et: 'AI tööle panemine mastaabis. Vahe Jupyter märkmiku ja tootmissüsteemi vahel on hiiglaslik — GPU orkestreerimine, serverita inferents, asünkroonsed tööjärjekorrad, mudelite versioonihaldus ja monitooringu torustikud. See tsoon katab taristu, mis muudab teaduslikud artefaktid operatiivseteks süsteemideks.',
    },
  },
  {
    id: 'systems',
    title: { en: 'Systems Engineering', et: 'Süsteemitehnika' },
    description: {
      en: 'Building foundations that hold under pressure. Distributed consensus, EV charging network backends, and infrastructure automation — these are the systems that need to work correctly at 3 AM with no one watching. The Raft consensus implementation demonstrates understanding of distributed systems from first principles. Vooglaadija shows production-grade Go engineering for real-time infrastructure. This zone is about designing systems that fail gracefully, recover automatically, and scale without heroics.',
      et: 'Vundamentide ehitamine, mis surve all püsivad. Hajuskonsensus, elektriautode laadimisvõrgu backendid ja taristu automatiseerimine — need on süsteemid, mis peavad kell 3 öösel korrektselt töötama, kui keegi ei vaata. Raft konsensuse implementatsioon demonstreerib hajussüsteemide mõistmist esimestest põhimõtetest alates.',
    },
  },
  {
    id: 'sec-ai',
    title: { en: 'AI × Security', et: 'AI × Turve' },
    description: {
      en: 'Adversarial AI is a different beast. Traditional pen-testing assumes a human attacker. Here, you are defending against models that adapt. I have built guardrails, bypassed commercial detectors, and designed evaluation pipelines that surface failure modes most teams miss. Stop-slop-drop-top reverse-engineered AI content detectors to understand their blind spots, then built tooling that exploits them — because you cannot defend what you do not understand. Guardian LLM developed systematic evaluation frameworks for AI safety, finding common bypass patterns across commercial implementations. This intersection is where security thinking meets machine learning — and where most organizations have the biggest blind spots.',
      et: 'Vastand-AI on teistsugune loom. Traditsiooniline läbistustestimine eeldab inimründajat. Siin kaitsed mudelite vastu, mis adapteeruvad. Olen ehitanud piirdeid, mööda läinud kommertsdetektoritest ja kavandanud hindamistorustikke, mis toovad esile vearežiime, mida enamik meeskondi ei märka. Stop-slop-drop-top pöördprojekteeris AI sisudetektoreid, et mõista nende pimealasid, seejärel ehitas tööriistad, mis neid ära kasutavad — sest sa ei saa kaitsta seda, mida sa ei mõista.',
    },
  },
  {
    id: 'sec-sys',
    title: { en: 'Security × Systems', et: 'Turve × Süsteemid' },
    description: {
      en: 'Security tooling that operates at production scale. Building TLS fingerprinting proxies with 80+ browser profiles, hardening Kubernetes clusters with zero-trust policies, and designing security operators that enforce compliance automatically. Fingerprintproxy demonstrates deep TLS internals knowledge applied to a practical security testing tool. The OpenClaw hardening engagement applied zero-trust architecture patterns to real cloud infrastructure. This is not theoretical security — it is security engineering: writing Go that manipulates TLS handshakes, operators that enforce network policies, and infrastructure that resists compromise by design.',
      et: 'Turvatööriistad, mis töötavad tootmismastaabis. TLS sõrmejäljeprokside ehitamine 80+ brauseriprofiiliga, Kubernetes klastrite turvapaikamine null-usalduse poliitikatega ja turvaoperaatorite disainimine, mis automaatselt vastavust jõustavad. Fingerprintproxy demonstreerib sügavat TLS sisemiste teadmiste rakendamist praktilisele turvatestimise tööriistale.',
    },
  },
  {
    id: 'ai-sys',
    title: { en: 'AI × Systems', et: 'AI × Süsteemid' },
    description: {
      en: 'Production AI infrastructure that actually works. EchoGuard orchestrates GPU workloads across RunPod serverless instances — coordinating Demucs, WhisperX, and RMVPE models through async job queues with Redis caching. MatX.ee embeds a Bayesian Knowledge Tracing engine inside a production React/Express/PostgreSQL stack, serving personalized math recommendations to Estonian students. This intersection demands both ML engineering pragmatism and systems reliability thinking — you are not just training a model, you are deploying a service that people depend on.',
      et: 'Tootmis-AI taristu, mis päriselt töötab. EchoGuard orkestreerib GPU töökoormust üle RunPod serverita instantside — koordineerides Demucs, WhisperX ja RMVPE mudeleid läbi asünkroonsete tööjärjekordade Redis vahemäluga. MatX.ee manustab Bayesi teadmiste jälgimise mootori tootmis-React/Express/PostgreSQL pinusse, serveerides personaliseeritud matemaatika soovitusi Eesti õpilastele.',
    },
  },
  {
    id: 'center',
    title: { en: 'The Intersection', et: 'Ristumiskoht' },
    description: {
      en: 'Most AI consultants cannot red-team their own pipeline. Most security consultants cannot read a model card. Most systems engineers cannot build adversarial tooling. I do all three — because the most interesting problems live at the intersection. This is not about being a generalist. It is about depth in three domains that most people treat as separate careers. When you are designing an AI system that needs to resist adversarial input at scale, you need someone who understands model architectures, attack surfaces, and distributed systems — not three separate consultants writing reports that contradict each other. The center zone is the thesis: deep tech is built at intersections. Everything else on this site is evidence.',
      et: 'Enamik AI konsultante ei suuda oma torustikku punaselt testida. Enamik turbekonsultante ei oska mudelikaarti lugeda. Enamik süsteemiinsenere ei suuda vastandtööriistu ehitada. Mina teen kõike kolme — sest kõige huvitavamad probleemid asuvad ristumiskohas. See ei ole generalistiks olemine. See on sügavus kolmes domeenis, mida enamik inimesi kohtleb eraldi karjääridena. Kui sa disainid AI süsteemi, mis peab vastu pidama vastandsisenditele mastaabis, vajad kedagi, kes mõistab mudelite arhitektuure, ründevektoreid ja hajussüsteeme — mitte kolme eraldi konsultanti, kes kirjutavad aruandeid, mis üksteisele vastu räägivad.',
    },
  },
];

export function getProjectsByZone(zone: VennZone): Project[] {
  return projects.filter(
    (p) => p.zones.includes(zone) && p.nodeType === 'project',
  );
}

export function getProjectsByDomains(domains: Domain[]): Project[] {
  return projects.filter(
    (p) => p.nodeType === 'project' && domains.every((d) => p.domains.includes(d)),
  );
}

export function getAnchorNodes(): Project[] {
  return projects.filter((p) => p.nodeType !== 'project');
}
