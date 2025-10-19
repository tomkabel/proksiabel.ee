import React from 'react';
import { servicesData } from './data';

export default function Services() {
  return (
    <section id="services" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Specializing in digital security consulting, we offer web application penetration testing, vulnerability management, and secure development practices.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {servicesData.map((service, index) => (
            <div key={index} className="bg-slate-700 rounded-xl p-8 shadow-lg hover:shadow-cyan-500/10 transition-all">
              <service.icon className="h-12 w-12 text-cyan-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 text-center">{service.title}</h3>
              <p className="text-gray-300 text-center">{service.description}</p>
              <ul className="mt-6 space-y-2 text-gray-300">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}