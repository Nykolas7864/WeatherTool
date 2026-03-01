import type { SearchRecord } from '../types/weather';
import { getWeatherIconUrl } from '../services/api';

interface HistoryProps {
  history: SearchRecord[];
  onCityClick: (city: string) => void;
  darkMode?: boolean;
}

export function History({ history, onCityClick, darkMode = false }: HistoryProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (history.length === 0) {
    return (
      <div className={`rounded-3xl p-6 shadow-xl backdrop-blur-md border transition-all duration-300 ${
        darkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/60 border-white/20'
      }`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Search History
        </h3>
        <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No searches yet. Try searching for a city!
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-6 shadow-xl backdrop-blur-md border transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/60 border-white/20'
    }`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Search History
      </h3>
      
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
        {history.slice(0, 10).map((record, index) => (
          <button
            key={record.id}
            onClick={() => onCityClick(record.city)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left transform hover:scale-[1.02] ${
              darkMode 
                ? 'hover:bg-white/10' 
                : 'hover:bg-white/80 hover:shadow-md'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img
              src={getWeatherIconUrl(record.iconCode)}
              alt="weather"
              className="w-12 h-12 drop-shadow-md"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {record.state
                  ? `${record.city}, ${record.state}`
                  : record.city}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(record.searchTime)}
              </p>
            </div>
            <div className={`text-right font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {Math.round(record.temperature)}{record.unitLabel}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
