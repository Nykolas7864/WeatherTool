import type { FavoriteCity } from '../types/weather';

interface FavoritesProps {
  favorites: FavoriteCity[];
  onCityClick: (city: string) => void;
  onRemove: (id: number) => void;
  darkMode?: boolean;
}

export function Favorites({ favorites, onCityClick, onRemove, darkMode = false }: FavoritesProps) {
  if (favorites.length === 0) {
    return null;
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
        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Favorite Cities
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className={`flex items-center gap-1 pl-4 pr-1 py-1.5 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30' 
                : 'bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200'
            }`}
          >
            <button
              onClick={() => onCityClick(favorite.city)}
              className={`font-medium transition-all hover:scale-105 ${
                darkMode ? 'text-pink-300 hover:text-pink-200' : 'text-pink-700 hover:text-pink-900'
              }`}
            >
              {favorite.city}, {favorite.country}
            </button>
            <button
              onClick={() => onRemove(favorite.id)}
              className={`p-1.5 rounded-full transition-all hover:scale-110 ${
                darkMode ? 'hover:bg-white/10' : 'hover:bg-pink-200'
              }`}
              title="Remove from favorites"
            >
              <svg className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
