import React from 'react';
import { servicesData } from './data';

export default function Hero() {
  return (
    <div className="relative bg-slate-900 pt-16">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Are Your Web Applications Vulnerable?</span>
            <span className="block text-cyan-500">Take Control of Your Digital Security</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            ProksiAbel OÜ offers specialized threat assessments and custom defense strategies built on deep, hands-on experience in offensive security. We don't just defend; we understand the attack.
          </p>
          <blockquote className="mt-6 max-w-2xl mx-auto text-lg text-slate-400 italic">
            "Standing on the defensive indicates insufficient strength; attacking, a superabundance of strength"
          </blockquote>
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
          {servicesData.map((service, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <service.icon className="h-12 w-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 text-center">{service.title}</h3>
              <p className="text-gray-300 text-center">{service.heroDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}