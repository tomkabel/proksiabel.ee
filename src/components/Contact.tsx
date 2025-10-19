import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to enhance your security posture? Contact us for a specialized threat assessment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 rounded-xl p-8 text-center hover:shadow-cyan-500/10 transition-all">
            <Mail className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
            <a href="mailto:info@proksiabel.ee" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              info@proksiabel.ee
            </a>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-8 text-center hover:shadow-cyan-500/10 transition-all">
            <Phone className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
            <a href="tel:+37256666981" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              +372 56666981
            </a>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-8 text-center hover:shadow-cyan-500/10 transition-all">
            <MessageSquare className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Business Address</h3>
            <p className="text-gray-300">
              Pargi tn 2 Sindi, Tori vald<br />
              Pärnumaa 86705<br />
              Estonia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}