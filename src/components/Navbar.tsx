import React from 'react';
import { Shield, Menu, X, Lock } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Lock className="h-8 w-8 text-cyan-500" />
              <span className="text-white font-bold text-xl">ProxyAbel</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
                <a href="#expertise" className="text-gray-300 hover:text-white transition-colors">Expertise</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
              Book Consultation
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/95 backdrop-blur-sm">
            <a href="#services" className="text-gray-300 hover:text-white block px-3 py-2">Services</a>
            <a href="#expertise" className="text-gray-300 hover:text-white block px-3 py-2">Expertise</a>
            <a href="#about" className="text-gray-300 hover:text-white block px-3 py-2">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white block px-3 py-2">Contact</a>
            <div className="px-3 py-2">
              <button className="w-full px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}