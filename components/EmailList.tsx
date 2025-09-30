import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface EmailListProps {
  emails: string[];
}

export const EmailList: React.FC<EmailListProps> = ({ emails }) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="mt-8 bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-lg shadow-lg" style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}>
      <h2 className="text-2xl font-semibold text-cyan-400 mb-4" style={{ textShadow: '0 0 5px #0ff' }}>
        Generated Variants ({emails.length})
      </h2>
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {emails.map((email, index) => (
          <div
            key={index}
            onClick={() => handleCopy(email)}
            className="group flex justify-between items-center bg-gray-800/50 p-3 my-1 rounded-md cursor-pointer hover:bg-cyan-900/50 transition-colors"
          >
            <span className="text-gray-300 group-hover:text-cyan-300 break-all">{email}</span>
            <div className="w-16 text-right shrink-0">
              {copiedEmail === email ? (
                <span className="text-green-400 text-sm animate-pulse">Copied!</span>
              ) : (
                <CopyIcon className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-opacity opacity-0 group-hover:opacity-100" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
