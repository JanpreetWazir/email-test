import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { EmailList } from './EmailList';
import { generateEmailVariants } from './emailGenerator';

const App: React.FC = () => {
  const [collaborator, setCollaborator] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (!collaborator.trim()) {
      setError('Collaborator/Canary domain is required.');
      setEmails([]);
      return;
    }
    setError(null);
    const variants = generateEmailVariants(collaborator.trim(), targetDomain.trim());
    setEmails(variants);
  }, [collaborator, targetDomain]);

  return (
    <div className="min-h-screen bg-black font-mono text-gray-300">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-lg shadow-lg" style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="collaborator" className="block text-sm font-medium text-cyan-400 mb-2">
                Burp Collaborator / Canary Domain
              </label>
              <input
                id="collaborator"
                type="text"
                value={collaborator}
                onChange={(e) => setCollaborator(e.target.value)}
                placeholder="xyz.burpcollaborator.net"
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="targetDomain" className="block text-sm font-medium text-cyan-400 mb-2">
                Target Domain (Optional)
              </label>
              <input
                id="targetDomain"
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="example.com"
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <button
            onClick={handleGenerate}
            disabled={!collaborator}
            className="w-full bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold py-3 px-6 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{ textShadow: '0 0 5px #0ff', boxShadow: '0 0 8px #0ff' }}
          >
            Generate Email Variants
          </button>
        </div>
        
        {emails.length > 0 && <EmailList emails={emails} />}
      </main>
    </div>
  );
};

export default App;