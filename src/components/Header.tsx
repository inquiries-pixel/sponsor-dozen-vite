import React from 'react';

export default function Header() {
  return (
    <header className="bg-white/90 border-b sticky top-0 z-10 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Replace /logo.png with your logo if needed */}
        <img
          src="/logo.png"
          alt="Operation Cookies"
          className="h-12 w-12 rounded shadow-md border border-gray-300"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-red-700 tracking-tight">
            Operation Cookies
          </h1>
          <p className="text-sm text-gray-600 italic">
            Sponsor a Dozen • Send a Smile Overseas
          </p>
        </div>
      </div>
    </header>
  );
}
