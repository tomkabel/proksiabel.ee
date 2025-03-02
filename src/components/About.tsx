import React from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            About ProksiAbel OÜ
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Professional cybersecurity consultation services specializing in MITM attack prevention
          </p>
        </div>
        
        <div className="bg-slate-700 rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Company Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-6 w-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Business Name</p>
                    <p className="text-gray-300">ProksiAbel OÜ</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 text-cyan-500 mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                    <span className="text-cyan-500 font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Registration Code</p>
                    <p className="text-gray-300">17017826</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Business Address</p>
                    <p className="text-gray-300">Pargi tn 2 Sindi, Tori vald Pärnumaa 86705</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a href="mailto:info@proksiabel.ee" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      info@proksiabel.ee
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <a href="tel:+37256666981" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      +372 56666981
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-gray-300 mb-4">
                At ProksiAbel OÜ, we're committed to protecting businesses from sophisticated cyber threats, with a special focus on man-in-the-middle attacks that can compromise sensitive data and user credentials.
              </p>
              <p className="text-gray-300 mb-4">
                Our approach combines technical expertise with practical experience to deliver security solutions that work in real-world scenarios, not just in theory.
              </p>
              <p className="text-gray-300">
                We believe that understanding the attacker's mindset is essential to building effective defenses, which is why our consultation services are built on first-hand knowledge of offensive security techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}