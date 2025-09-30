import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6">
      <h1 
        className="text-3xl md:text-4xl font-bold text-center text-cyan-400"
        style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }}
      >
        Email Security Test Vector Generator
      </h1>
      <p className="text-center text-gray-500 mt-2">Generate RFC-compliant and exploit-oriented email addresses for security testing.</p>
    </header>
  );
};