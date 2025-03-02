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
                  src="https://www.upload.ee/image/17805348/alinabirjuk-8501.jpg"
                  alt="Cybersecurity expert working"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-cyan-500 rounded-lg p-6 shadow-xl">
                <p className="text-white font-bold text-xl">3+ Years Experience</p>
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
              At 23, I bring a unique perspective to cybersecurity, having transitioned from exploring offensive techniques to building robust defensive solutions. My hands-on experience with MITM attack tools gives me insight that traditional security professionals often lack.
            </p>
            <p className="text-gray-300 mb-8">
              I specialize in identifying and mitigating the exact techniques that hackers use to compromise web applications and steal sensitive data through man-in-the-middle attacks.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-slate-800 p-3 rounded-lg">
                  <Code className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Technical Expertise</h4>
                  <p className="text-gray-300">Deep understanding of web protocols, authentication systems, and proxy technologies</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-slate-800 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">Attacker's Perspective</h4>
                  <p className="text-gray-300">First-hand knowledge of tools like evilginx2, modlishka, and mureana</p>
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