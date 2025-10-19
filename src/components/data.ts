import { Shield, Target, Fingerprint } from 'lucide-react';

export const servicesData = [
  {
    icon: Target,
    title: 'Penetration Testing & Vulnerability Management',
    description: 'We conduct in-depth web application penetration testing to uncover critical vulnerabilities and manage them effectively. Our goal is to significantly enhance your security posture by identifying and mitigating threats before they can be exploited.',
    features: [
      'Web Application Penetration Testing',
      'Authentication Flow Threat Model',
      'Session Hijacking and AiTM Simulations',
    ],
    heroDescription: 'In-depth analysis of your website from an attacker\'s perspective',
  },
  {
    icon: Shield,
    title: 'Secure Development Practices',
    description: 'We implement secure development practices tailored to your needs, ensuring robust protection against a wide array of threats. Our approach is proactive, building security into your development lifecycle from the ground up.',
    features: [
      'Standard MITM Countemeasures Tailored to Specific Tools',
      'Securing the Authentication Flow Against MITM attacks',
      'TLS Client Fingerprinting and Behavioral Heuristics',
    ],
    heroDescription: 'Tailored security solutions based on your specific infrastructure and threats',
  },
  {
    icon: Fingerprint,
    title: 'Security Research & Tool Development',
    description: 'We engage in advanced security research to innovate and develop custom tools. This allows us to improve testing processes, combat social engineering, and stay ahead of the latest threats in the digital landscape.',
    features: [
      'Responding to Next-Gen Emerging Cyber Threats',
      'Proactive Defense Against Emerging Risks',
      'Analysis of Javascript Bot & Fraud Detection Systems',
    ],
    heroDescription: 'Direct access to expert advice as your security needs evolve',
  },
];