export interface WeatherData {
  city: string;
  state: string | null;
  country: string;
  temperature: number;
  description: string;
  iconCode: string;
  unitLabel: string;
  localTime: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  vibeColor: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  iconCode: string;
}

export interface WeatherForecast {
  city: string;
  country: string;
  forecast: ForecastDay[];
}

export interface SearchRecord {
  id: number;
  city: string;
  state: string | null;
  country: string;
  temperature: number;
  iconCode: string;
  unitLabel: string;
  localTime: string;
  searchTime: string;
}

export interface CityStats {
  city: string;
  count: number;
}

export interface FavoriteCity {
  id: number;
  city: string;
  country: string;
  addedAt: string;
}

export type Units = 'metric' | 'imperial';
