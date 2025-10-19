import React from 'react';
import { Code, Shield, Eye } from 'lucide-react';

export default function Expertise() {
  return (
    <section id="expertise" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-16">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden">
                <img
                  src="/suit001.png"
                  alt="Cybersecurity expert working"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-cyan-500 rounded-lg p-6 shadow-xl">
                <p className="text-white font-bold text-xl">6+ Years Experience</p>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Meet Your Security Expert
            </h2>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-cyan-500 mb-2">Tom Kristian Abel</h3>
              <p className="text-xl text-gray-300">Former Hacker Turned Cybersecurity Specialist</p>
            </div>
            <p className="text-gray-300 mb-6">
             My expertise lies in advanced security research, where I leverage innovative analysis techniques and develop custom tools to tackle complex security challenges. My background in offensive security provides a unique advantage in creating resilient defensive strategies.
            </p>
            <p className="text-gray-300 mb-8">
              I have a proven track record of identifying critical vulnerabilities in modern web applications and have even authored a proof-of-concept for bypassing a major platform's client-side bot detection system.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-slate-800 p-3 rounded-lg">
                  <Code className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Technical Expertise</h4>
                  <p className="text-gray-300">In-depth security analysis of modern complex web applications and custom tool development in Golang.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-slate-800 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Offensive Security Mindset</h4>
                  <p className="text-gray-300">Authored proof-of-concept of bypassing a modern, commonly encountered client-side bot detection system.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-slate-800 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Defensive Strategy</h4>
                  <p className="text-gray-300">Proven approaches to securing web applications against sophisticated MITM attacks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}