
import React from 'react';

const SvgIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                <div className="flex items-center gap-4 mb-2">
                    <SvgIcon />
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Mirth Connect Script Generator
                    </h1>
                </div>
                <p className="text-cyan-400 font-medium">
                    AI-Powered FHIR Transformation
                </p>
            </div>
        </header>
    );
};
