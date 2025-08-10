import React from 'react';

import { Key } from 'lucide-react';

const Pgp = () => {
  return (
    <div id="pgp" className="py-10 bg-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-md mx-auto bg-slate-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full object-cover md:w-48 flex items-center justify-center bg-sky-500">
                <Key className="h-24 w-24 text-white" />
              </div>
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-sky-400 font-semibold">
                PGP Public Key
              </div>
              <p className="mt-2 text-slate-300">
                Use this key to send me encrypted messages or to verify my
                digital signatures.
              </p>
              <div className="mt-4">
                <a
                  href="/public-key.asc"
                  download="public-key.asc"
                  className="inline-block bg-sky-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-sky-600 transition-colors duration-300"
                >
                  Download Key
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pgp;