import type { WeatherData, WeatherForecast, SearchRecord, CityStats, FavoriteCity, Units } from '../types/weather';

const API_BASE = '/api';

export async function fetchWeather(city: string, units: Units = 'metric'): Promise<WeatherData> {
  const response = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}&units=${units}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch weather');
  }
  return response.json();
}

export async function fetchForecast(city: string, units: Units = 'metric'): Promise<WeatherForecast> {
  const response = await fetch(`${API_BASE}/weather/forecast?city=${encodeURIComponent(city)}&units=${units}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch forecast');
  }
  return response.json();
}

export async function fetchHistory(): Promise<SearchRecord[]> {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}

export async function fetchTopCities(limit: number = 5): Promise<CityStats[]> {
  const response = await fetch(`${API_BASE}/stats/top-cities?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch top cities');
  }
  return response.json();
}

export async function fetchFavorites(): Promise<FavoriteCity[]> {
  const response = await fetch(`${API_BASE}/favorites`);
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  return response.json();
}

export async function addFavorite(city: string, country: string): Promise<FavoriteCity> {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, country })
  });
  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }
  return response.json();
}

export async function removeFavorite(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
