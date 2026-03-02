import { useState } from 'react';
import { changelog, currentVersion } from '../data/changelog';

interface AboutPanelProps {
  darkMode: boolean;
}

export function AboutPanel({ darkMode }: AboutPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [changelogExpanded, setChangelogExpanded] = useState(false);
  
  const apiDocsUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : window.location.origin.replace(':5173', ':3001');

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
          darkMode
            ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
            : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:text-indigo-600 border border-white/30'
        } backdrop-blur-md`}
        title="About & API Documentation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">About & API</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className={`mx-auto max-w-2xl rounded-t-3xl shadow-2xl border-t border-x ${
            darkMode
              ? 'bg-slate-900/95 border-white/10'
              : 'bg-white/95 border-gray-200'
          } backdrop-blur-xl`}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="px-6 pb-8 pt-2">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Weather Tool
              </h2>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
              }`}>
                v{currentVersion}
              </span>
            </div>

            {/* Description */}
            <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A modern weather application built with React and Express, featuring real-time weather data, 
              5-day forecasts, and search history tracking.
            </p>

            {/* For Developers Section */}
            <div className={`rounded-2xl p-5 mb-6 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                }`}>
                  <svg className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  For Developers
                </h3>
              </div>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This app is powered by a public REST API. Access weather data, forecasts, search history, 
                and more programmatically.
              </p>
              <a
                href={apiDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  darkMode
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                } shadow-lg hover:shadow-xl`}
              >
                View API Documentation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* What's New Section */}
            <div className={`rounded-2xl p-5 mb-6 ${
              darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
            }`}>
              <button
                onClick={() => setChangelogExpanded(!changelogExpanded)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <svg className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      What's New
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      v{changelog[0].version} - {changelog[0].date}
                    </p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    changelogExpanded ? 'rotate-180' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {changelogExpanded && (
                <div className={`mt-4 space-y-4 max-h-48 overflow-y-auto ${
                  darkMode ? 'scrollbar-dark' : 'scrollbar-light'
                }`}>
                  {changelog.map((entry, index) => (
                    <div key={entry.version} className={index > 0 ? `pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}` : ''}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                          v{entry.version}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {entry.date}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {entry.changes.map((change, i) => (
                          <li key={i} className={`text-xs flex items-start gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${
                              change.startsWith('Fixed:') 
                                ? darkMode ? 'bg-red-400' : 'bg-red-500'
                                : change.startsWith('Added:')
                                ? darkMode ? 'bg-green-400' : 'bg-green-500'
                                : darkMode ? 'bg-blue-400' : 'bg-blue-500'
                            }`} />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links / Resources */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="text-sm font-medium">OpenWeatherMap</span>
              </a>
              <a
                href="https://github.com/Nykolas7864/WeatherTool"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">GitHub Repo</span>
              </a>
            </div>

            {/* Footer */}
            <p className={`text-center text-xs mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Built with React, Express, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
