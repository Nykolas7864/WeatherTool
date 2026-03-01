import type { CityStats } from '../types/weather';

interface TopCitiesProps {
  cities: CityStats[];
  onCityClick: (city: string) => void;
  darkMode?: boolean;
}

export function TopCities({ cities, onCityClick, darkMode = false }: TopCitiesProps) {
  if (cities.length === 0) {
    return null;
  }

  const gradients = [
    'from-yellow-400 to-orange-500',
    'from-gray-300 to-gray-400',
    'from-amber-600 to-amber-700',
    'from-blue-400 to-blue-500',
    'from-purple-400 to-purple-500',
  ];

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Popular Searches
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {cities.map((city, index) => (
          <button
            key={city.city}
            onClick={() => onCityClick(city.city)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-white/80 hover:bg-white hover:shadow-md'
            }`}
          >
            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-sm font-bold bg-gradient-to-r ${gradients[index] || gradients[4]}`}>
              {index + 1}
            </span>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {city.city}
            </span>
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'
            }`}>
              {city.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
