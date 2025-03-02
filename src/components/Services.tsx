import React from 'react';
import { Shield, Target, Fingerprint } from 'lucide-react';

export default function Services() {
  return (
    <section id="services" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive protection against Man-in-the-Middle attacks through expert consultation and tailored solutions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-cyan-500/10 transition-all">
            <Target className="h-12 w-12 text-cyan-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Threat Assessment</h3>
            <p className="text-gray-300">
              I conduct thorough evaluations of your digital infrastructure to identify vulnerabilities that could be exploited through MITM proxying and session hijacking techniques. Using the same methodologies as attackers, I can pinpoint exactly where your defenses need strengthening.
            </p>
            <ul className="mt-6 space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Website traffic analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Authentication flow review</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Session management evaluation</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-cyan-500/10 transition-all">
            <Shield className="h-12 w-12 text-cyan-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Custom Defense Strategy</h3>
            <p className="text-gray-300">
              I develop tailored security solutions to protect against known MITM tools including evilginx2, modlishka, and mureana. My strategies are built on real-world experience with these tools and understanding their capabilities and limitations.
            </p>
            <ul className="mt-6 space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Tool-specific countermeasures</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Implementation of advanced security headers</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>TLS fingerprinting and behavioral analysis</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-cyan-500/10 transition-all">
            <Fingerprint className="h-12 w-12 text-cyan-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Ongoing Support</h3>
            <p className="text-gray-300">
              I provide continuous technical assistance to help you stay ahead of evolving MITM threats. The cybersecurity landscape is constantly changing, and I keep you informed about new attack vectors and defense mechanisms in the MITM scene.
            </p>
            <ul className="mt-6 space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Regular security briefings</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Emergency response for new threats</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>Implementation assistance for security updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}