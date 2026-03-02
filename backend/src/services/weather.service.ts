import axios from 'axios';
import prisma from '../prisma';
import { WeatherData, WeatherForecast, ForecastDay, GeoLocation, CityStats, SearchRecord, FavoriteCity } from '../types/weather.types';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';

function capitalizeWords(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatLocalTime(timezoneOffsetSeconds: number): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + timezoneOffsetSeconds * 1000);
  return localTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getVibeColor(temperature: number, unitLabel: string): string {
  const isHot = unitLabel === '°F' ? temperature > 80 : temperature > 27;
  const isCold = unitLabel === '°F' ? temperature < 45 : temperature < 7;

  if (isHot) return 'linear-gradient(135deg, #ff9966, #ff5e62)';
  if (isCold) return 'linear-gradient(135deg, #7f7fd5, #86a8e7)';
  return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
}

export class WeatherService {
  private get apiKey(): string {
    const key = process.env.WEATHER_API_KEY || '';
    if (!key) {
      console.warn('WEATHER_API_KEY not set in environment variables');
    }
    return key;
  }

  async getGeoLocation(city: string): Promise<GeoLocation | null> {
    const normalizedCity = capitalizeWords(city);
    const encodedCity = encodeURIComponent(normalizedCity);
    
    const geoUrl = `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${this.apiKey}`;
    
    // #region agent log
    console.log('[DEBUG] Geocoding request:', JSON.stringify({inputCity:city,normalizedCity,encodedCity}));
    // #endregion
    
    try {
      const response = await axios.get(geoUrl);
      // #region agent log
      console.log('[DEBUG] Geocoding response:', JSON.stringify(response.data));
      // #endregion
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: result.lat,
          lon: result.lon,
          name: result.name,
          state: result.state || undefined,
          country: result.country
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async fetchWeather(city: string, units: string = 'metric'): Promise<WeatherData> {
    const normalizedCity = capitalizeWords(city);
    
    console.log(`>>> NEW REQUEST: User is looking for weather in: ${normalizedCity}`);

    const geoLocation = await this.getGeoLocation(city);
    
    if (!geoLocation) {
      throw new Error('City not found');
    }
    
    const state = geoLocation.state || null;

    // #region agent log
    console.log('[DEBUG] fetchWeather - GeoLocation result:', JSON.stringify({inputCity:city,normalizedCity,geoLocation,stateUsed:state}));
    // #endregion

    // Use lat/lon from geocoding to ensure correct city (fixes ambiguous city names like "Allen")
    const weatherUrl = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${geoLocation.lat}&lon=${geoLocation.lon}&units=${units}&appid=${this.apiKey}`;
    
    // #region agent log
    console.log('[DEBUG] Weather API URL:', weatherUrl.replace(this.apiKey,'[REDACTED]'));
    // #endregion

    try {
      const response = await axios.get(weatherUrl);
      const data = response.data;

      const cityNameFromApi = data.name;
      const country = data.sys.country;
      const temperature = data.main.temp;
      
      // #region agent log
      console.log('[DEBUG] Weather API response:', JSON.stringify({cityNameFromApi,country,temperature,coord:data.coord,timezone:data.timezone}));
      // #endregion
      const description = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const unitLabel = units === 'imperial' ? '°F' : '°C';
      const localTime = formatLocalTime(data.timezone);
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const feelsLike = data.main.feels_like;

      console.log(`>>> SUCCESS: Found weather for ${normalizedCity} via API`);

      await prisma.searchRecord.create({
        data: {
          city: cityNameFromApi,
          state,
          country,
          temperature,
          iconCode,
          unitLabel,
          localTime
        }
      });

      return {
        city: cityNameFromApi,
        state,
        country,
        temperature,
        description,
        iconCode,
        unitLabel,
        localTime,
        humidity,
        windSpeed,
        feelsLike
      };
    } catch (error: any) {
      console.warn(`>>> API ISSUE: Weather for ${normalizedCity} not found. Status: ${error.response?.status}`);
      throw new Error('City not found');
    }
  }

  async fetchForecast(city: string, units: string = 'metric'): Promise<WeatherForecast> {
    const normalizedCity = capitalizeWords(city);

    const geoLocation = await this.getGeoLocation(city);
    
    if (!geoLocation) {
      throw new Error('City not found');
    }

    // Use lat/lon from geocoding to ensure correct city (fixes ambiguous city names like "Allen")
    const forecastUrl = `${OPENWEATHER_BASE_URL}/data/2.5/forecast?lat=${geoLocation.lat}&lon=${geoLocation.lon}&units=${units}&appid=${this.apiKey}`;

    // #region agent log
    console.log('[DEBUG] Forecast API URL:', forecastUrl.replace(this.apiKey,'[REDACTED]'));
    // #endregion

    try {
      const response = await axios.get(forecastUrl);
      // #region agent log
      console.log('[DEBUG] Forecast API response:', JSON.stringify({cityFromApi:response.data.city?.name,countryFromApi:response.data.city?.country,coord:response.data.city?.coord}));
      // #endregion
      const data = response.data;

      const dailyForecasts = new Map<string, ForecastDay>();

      for (const item of data.list) {
        const date = item.dt_txt.split(' ')[0];
        
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, {
            date,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            description: item.weather[0].description,
            iconCode: item.weather[0].icon
          });
        } else {
          const existing = dailyForecasts.get(date)!;
          existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
          existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
        }
      }

      const forecast = Array.from(dailyForecasts.values()).slice(0, 5);

      return {
        city: data.city.name,
        country: data.city.country,
        forecast
      };
    } catch (error: any) {
      console.error('Forecast error:', error.response?.data || error.message);
      throw new Error('Could not fetch forecast');
    }
  }

  async getAllHistory(): Promise<SearchRecord[]> {
    const records = await prisma.searchRecord.findMany({
      orderBy: { searchTime: 'desc' }
    });
    return records as SearchRecord[];
  }

  async getTopCities(limit: number = 5): Promise<CityStats[]> {
    const result = await prisma.searchRecord.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: limit
    });

    return result.map((r: { city: string; _count: { city: number } }) => ({
      city: r.city,
      count: r._count.city
    }));
  }

  async getFavorites(): Promise<FavoriteCity[]> {
    const favorites = await prisma.favoriteCity.findMany({
      orderBy: { addedAt: 'desc' }
    });
    return favorites as FavoriteCity[];
  }

  async addFavorite(city: string, country: string): Promise<FavoriteCity> {
    const favorite = await prisma.favoriteCity.upsert({
      where: { city_country: { city, country } },
      update: {},
      create: { city, country }
    });
    return favorite as FavoriteCity;
  }

  async removeFavorite(id: number): Promise<void> {
    await prisma.favoriteCity.delete({
      where: { id }
    });
  }

  getVibeColor(temperature: number, unitLabel: string): string {
    return getVibeColor(temperature, unitLabel);
  }
}

export const weatherService = new WeatherService();
