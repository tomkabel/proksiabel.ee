import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Expertise from './components/Expertise';
import About from './components/About';
import Contact from './components/Contact';
import Pgp from './components/Pgp';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Hero />
      <Services />
      <Expertise />
      <About />
      <Contact />
      <Pgp />
    </div>
  );
}

export default App;