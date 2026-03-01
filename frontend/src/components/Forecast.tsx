import type { WeatherForecast, Units } from '../types/weather';
import { getWeatherIconUrl } from '../services/api';

interface ForecastProps {
  forecast: WeatherForecast;
  units: Units;
  darkMode?: boolean;
}

export function Forecast({ forecast, units, darkMode = false }: ForecastProps) {
  const unitLabel = units === 'imperial' ? '°F' : '°C';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`rounded-3xl p-6 shadow-xl backdrop-blur-md border transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/60 border-white/20'
    }`}>
      <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        5-Day Forecast
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {forecast.forecast.map((day, index) => (
          <div
            key={day.date}
            className={`rounded-2xl p-4 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10' 
                : 'bg-gradient-to-b from-white/80 to-white/40 hover:from-white hover:to-white/60'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className={`text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {formatDate(day.date)}
            </p>
            <img
              src={getWeatherIconUrl(day.iconCode)}
              alt={day.description}
              className="w-14 h-14 mx-auto drop-shadow-md"
            />
            <div className="mt-2">
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {Math.round(day.tempMax)}{unitLabel}
              </span>
              <span className={`mx-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/</span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {Math.round(day.tempMin)}{unitLabel}
              </span>
            </div>
            <p className={`text-xs mt-1 capitalize truncate ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
