
import React, { useState, useEffect } from 'react';

interface CodeBlockProps {
  code: string;
  error: string | null;
  isLoading: boolean;
  language?: string;
}

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) => {
    if (copied) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
};


export const CodeBlock: React.FC<CodeBlockProps> = ({ code, error, isLoading, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
    }
  };

  return (
    <div className="relative h-full flex-grow bg-gray-800 border border-gray-700 rounded-lg shadow-inner min-h-[300px] lg:min-h-[500px] flex flex-col">
      {code && !isLoading && (
         <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition"
            aria-label="Copy code to clipboard"
        >
           <CopyIcon copied={copied} />
        </button>
      )}
      <pre className="p-4 h-full overflow-auto text-sm text-gray-200 whitespace-pre-wrap flex-grow">
        <code className={`language-${language}`}>
            {isLoading && <span className="text-gray-400">Generating script... Please wait.</span>}
            {error && <span className="text-red-400">{`Error: ${error}`}</span>}
            {!isLoading && !error && !code && <span className="text-gray-500">Your generated script will appear here.</span>}
            {code}
        </code>
      </pre>
    </div>
  );
};
