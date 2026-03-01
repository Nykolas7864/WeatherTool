import { useState, type FormEvent } from 'react';
import type { Units } from '../types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  units: Units;
  onUnitsChange: (units: Units) => void;
  isLoading: boolean;
  darkMode?: boolean;
}

export function SearchBar({ onSearch, units, onUnitsChange, isLoading, darkMode = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all duration-300 text-lg ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-white/15'
                : 'bg-white/80 border-white/50 text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:bg-white'
            } backdrop-blur-md shadow-lg focus:shadow-xl focus:scale-[1.02] transform`}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className={`w-6 h-6 border-3 rounded-full animate-spin ${
                darkMode ? 'border-purple-400 border-t-transparent' : 'border-indigo-500 border-t-transparent'
              }`} />
            </div>
          )}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none ${
            darkMode ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'shadow-[0_0_30px_rgba(99,102,241,0.3)]'
          }`} />
        </div>
        
        <div className="flex gap-2">
          <div className={`flex rounded-2xl overflow-hidden border-2 backdrop-blur-md shadow-lg ${
            darkMode ? 'border-white/20 bg-white/10' : 'border-white/50 bg-white/80'
          }`}>
            <button
              type="button"
              onClick={() => onUnitsChange('metric')}
              className={`px-5 py-4 font-semibold transition-all duration-300 ${
                units === 'metric'
                  ? darkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-white/10'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onUnitsChange('imperial')}
              className={`px-5 py-4 font-semibold transition-all duration-300 ${
                units === 'imperial'
                  ? darkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-white/10'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              °F
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !city.trim()}
            className={`px-8 py-4 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg ${
              darkMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white disabled:from-gray-600 disabled:to-gray-700'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white disabled:from-gray-300 disabled:to-gray-400'
            }`}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
