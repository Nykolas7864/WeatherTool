import type { WeatherData, FavoriteCity } from '../types/weather';
import { getWeatherIconUrl } from '../services/api';

interface WeatherCardProps {
  weather: WeatherData;
  favorites: FavoriteCity[];
  onAddFavorite: (city: string, country: string) => void;
  onRemoveFavorite: (id: number) => void;
  darkMode?: boolean;
}

export function WeatherCard({ weather, favorites, onAddFavorite, onRemoveFavorite, darkMode: _darkMode = false }: WeatherCardProps) {
  void _darkMode;
  const isFavorite = favorites.some(
    f => f.city === weather.city && f.country === weather.country
  );
  const favoriteId = favorites.find(
    f => f.city === weather.city && f.country === weather.country
  )?.id;

  const locationDisplay = weather.state
    ? `${weather.city}, ${weather.state}, ${weather.country}`
    : `${weather.city}, ${weather.country}`;

  return (
    <div
      className="rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
      style={{ background: weather.vibeColor }}
    >
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-500" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-float" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">{locationDisplay}</h2>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {weather.localTime}
            </p>
          </div>
          <button
            onClick={() => 
              isFavorite && favoriteId
                ? onRemoveFavorite(favoriteId)
                : onAddFavorite(weather.city, weather.country)
            }
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-7 h-7 transition-all duration-300 ${isFavorite ? 'text-red-300 scale-110' : ''}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center">
            <img
              src={getWeatherIconUrl(weather.iconCode)}
              alt={weather.description}
              className="w-32 h-32 -ml-4 drop-shadow-2xl animate-float"
            />
            <div>
              <div className="text-7xl font-light drop-shadow-lg">
                {Math.round(weather.temperature)}<span className="text-4xl">{weather.unitLabel}</span>
              </div>
              <p className="text-2xl capitalize text-white/90 mt-1">{weather.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-right">
            <div className="flex items-center justify-end gap-3 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-white/70">Feels like</span>
              <span className="font-bold text-xl">{Math.round(weather.feelsLike)}{weather.unitLabel}</span>
            </div>
            <div className="flex items-center justify-end gap-3 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-white/70">Humidity</span>
              <span className="font-bold text-xl">{weather.humidity}%</span>
            </div>
            <div className="flex items-center justify-end gap-3 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-white/70">Wind</span>
              <span className="font-bold text-xl">{weather.windSpeed} {weather.unitLabel === '°F' ? 'mph' : 'm/s'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
