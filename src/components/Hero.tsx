import React from 'react';
import { Shield, Target, Fingerprint } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-slate-900 pt-16">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Expert MITM Defense</span>
            <span className="block text-cyan-500">Securing Your Digital Infrastructure</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get personalized consultation from a security expert with hands-on experience in both offensive and defensive cybersecurity. We provide expertise to protect your business from MITM attacks.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#contact" className="rounded-md px-8 py-3 bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors">
              Book Consultation
            </a>
            <a href="#services" className="rounded-md px-8 py-3 border border-cyan-500 text-cyan-500 font-medium hover:bg-cyan-500/10 transition-colors">
              Learn More
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <Target className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Threat Assessment</h3>
            <p className="text-gray-300 text-center">In-depth analysis of your website from an attacker's perspective</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <Shield className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Custom Defense Strategy</h3>
            <p className="text-gray-300 text-center">Tailored security solutions based on your specific infrastructure and threats</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <Fingerprint className="h-12 w-12 text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ongoing Support</h3>
            <p className="text-gray-300 text-center">Direct access to expert advice as your security needs evolve</p>
          </div>
        </div>
      </div>
    </div>
  );
}