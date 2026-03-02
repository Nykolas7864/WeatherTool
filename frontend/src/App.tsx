import { useState, useEffect, useCallback } from 'react';
import {
  SearchBar,
  WeatherCard,
  Forecast,
  History,
  TopCities,
  Favorites,
  ErrorMessage,
  AboutPanel
} from './components';
import {
  fetchWeather,
  fetchForecast,
  fetchHistory,
  fetchTopCities,
  fetchFavorites,
  addFavorite,
  removeFavorite
} from './services/api';
import type { WeatherData, WeatherForecast, SearchRecord, CityStats, FavoriteCity, Units } from './types/weather';

// Temperature conversion utilities
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

function convertTemperature(temp: number, fromUnit: Units, toUnit: Units): number {
  if (fromUnit === toUnit) return temp;
  if (fromUnit === 'metric' && toUnit === 'imperial') {
    return celsiusToFahrenheit(temp);
  }
  return fahrenheitToCelsius(temp);
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [topCities, setTopCities] = useState<CityStats[]>([]);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [units, setUnits] = useState<Units>('metric');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadInitialData = useCallback(async () => {
    try {
      const [historyData, topCitiesData, favoritesData] = await Promise.all([
        fetchHistory().catch(() => []),
        fetchTopCities().catch(() => []),
        fetchFavorites().catch(() => [])
      ]);
      setHistory(historyData);
      setTopCities(topCitiesData);
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(city, units),
        fetchForecast(city, units)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      
      const [historyData, topCitiesData] = await Promise.all([
        fetchHistory(),
        fetchTopCities()
      ]);
      setHistory(historyData);
      setTopCities(topCitiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert temperatures locally - NO API call needed
  const handleUnitsChange = (newUnits: Units) => {
    const currentUnits = units;
    if (newUnits === currentUnits) return;
    
    const newUnitLabel = newUnits === 'imperial' ? '°F' : '°C';
    
    if (weather && forecast) {
      const newWeather = {
        ...weather,
        temperature: Math.round(convertTemperature(weather.temperature, currentUnits, newUnits) * 10) / 10,
        feelsLike: Math.round(convertTemperature(weather.feelsLike, currentUnits, newUnits) * 10) / 10,
        unitLabel: newUnitLabel
      };
      
      const newForecast = {
        ...forecast,
        forecast: forecast.forecast.map(day => ({
          ...day,
          tempMin: Math.round(convertTemperature(day.tempMin, currentUnits, newUnits) * 10) / 10,
          tempMax: Math.round(convertTemperature(day.tempMax, currentUnits, newUnits) * 10) / 10
        }))
      };
      
      setUnits(newUnits);
      setWeather(newWeather);
      setForecast(newForecast);
    } else if (weather) {
      const newWeather = {
        ...weather,
        temperature: Math.round(convertTemperature(weather.temperature, currentUnits, newUnits) * 10) / 10,
        feelsLike: Math.round(convertTemperature(weather.feelsLike, currentUnits, newUnits) * 10) / 10,
        unitLabel: newUnitLabel
      };
      setUnits(newUnits);
      setWeather(newWeather);
    } else {
      setUnits(newUnits);
    }
  };

  const handleAddFavorite = async (city: string, country: string) => {
    try {
      await addFavorite(city, country);
      const favoritesData = await fetchFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  const handleRemoveFavorite = async (id: number) => {
    try {
      await removeFavorite(id);
      const favoritesData = await fetchFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setIsLoading(true);
          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY || ''}`
            );
            const data = await response.json();
            if (data && data[0]) {
              handleSearch(data[0].name);
            }
          } catch (err) {
            setError('Could not determine your location');
            setIsLoading(false);
          }
        },
        () => {
          setError('Location access denied');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-purple-500/20' : 'bg-purple-300/40'
        }`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-blue-500/20' : 'bg-blue-300/40'
        }`} />
        <div className={`absolute -bottom-40 right-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse delay-500 ${
          darkMode ? 'bg-pink-500/20' : 'bg-pink-300/40'
        }`} />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with dark mode toggle */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                darkMode 
                  ? 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30' 
                  : 'bg-slate-800/10 text-slate-700 hover:bg-slate-800/20'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          <h1 className={`text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${
            darkMode 
              ? 'from-blue-400 via-purple-400 to-pink-400' 
              : 'from-indigo-600 via-purple-600 to-pink-600'
          } animate-gradient`}>
            Weather Tool
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get real-time weather information for any city
          </p>
        </header>

        <div className="mb-8 animate-slide-up">
          <SearchBar
            onSearch={handleSearch}
            units={units}
            onUnitsChange={handleUnitsChange}
            isLoading={isLoading}
            darkMode={darkMode}
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={handleGeolocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white' 
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:text-indigo-600'
              } backdrop-blur-sm`}
            >
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use my location
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 animate-shake">
            <ErrorMessage message={error} onDismiss={() => setError(null)} darkMode={darkMode} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {weather && (
              <div className="animate-scale-in">
                <WeatherCard
                  weather={weather}
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                  darkMode={darkMode}
                />
              </div>
            )}

            {forecast && (
              <div className="animate-slide-up delay-200">
                <Forecast forecast={forecast} units={units} darkMode={darkMode} />
              </div>
            )}

            {!weather && !isLoading && (
              <div className={`rounded-3xl p-12 text-center backdrop-blur-md border transition-all duration-300 ${
                darkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/60 border-white/20'
              } shadow-2xl animate-float`}>
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-indigo-100 to-purple-100'
                }`}>
                  <svg className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-indigo-400'} animate-pulse`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Search for a city
                </h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter a city name above to see the current weather and forecast
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="animate-slide-left delay-100">
              <Favorites
                favorites={favorites}
                onCityClick={handleSearch}
                onRemove={handleRemoveFavorite}
                darkMode={darkMode}
              />
            </div>
            <div className="animate-slide-left delay-200">
              <TopCities cities={topCities} onCityClick={handleSearch} darkMode={darkMode} />
            </div>
            <div className="animate-slide-left delay-300">
              <History history={history} onCityClick={handleSearch} darkMode={darkMode} />
            </div>
          </div>
        </div>

        <footer className={`mt-12 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="flex items-center justify-center gap-2">
            Powered by 
            <span className={`font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>
              OpenWeatherMap
            </span>
            API
          </p>
          <p className="mt-2">
            Built by{' '}
            <a 
              href="https://kishxi.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-semibold transition-colors duration-200 ${
                darkMode 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              Kishxi
            </a>
          </p>
        </footer>
      </div>

      {/* About Panel */}
      <AboutPanel darkMode={darkMode} />
    </div>
  );
}

export default App;
