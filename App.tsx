
import React, { useState, useCallback } from 'react';
import { generateMirthScript } from './services/geminiService';
import { CodeBlock } from './components/CodeBlock';
import { Header } from './components/Header';
import { SAMPLE_PRESCRIPTION } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_PRESCRIPTION);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedScript('');
    try {
      const script = await generateMirthScript(inputText);
      setGeneratedScript(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
          Paste the raw prescription text below to generate a Mirth Connect JavaScript Transformer script. The script will parse the data and map it into a FHIR-inspired JSON structure.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label htmlFor="prescription-input" className="text-lg font-semibold mb-2 text-gray-300">
              Prescription Data
            </label>
            <textarea
              id="prescription-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste prescription data here..."
              className="flex-grow p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 text-gray-200 min-h-[300px] lg:min-h-[500px] font-mono text-sm"
            />
            <button
              onClick={handleGenerateScript}
              disabled={isLoading}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Mirth Script'
              )}
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2 text-gray-300">
              Generated Mirth Transformer Script
            </label>
            <CodeBlock 
              code={generatedScript} 
              error={error} 
              isLoading={isLoading} 
              language="javascript" 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
