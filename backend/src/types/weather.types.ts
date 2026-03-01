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
  searchTime: Date;
}

export interface CityStats {
  city: string;
  count: number;
}

export interface GeoLocation {
  lat: number;
  lon: number;
  name: string;
  state?: string;
  country: string;
}

export interface FavoriteCity {
  id: number;
  city: string;
  country: string;
  addedAt: Date;
}
