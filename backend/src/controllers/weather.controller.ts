import { Request, Response } from 'express';
import { weatherService } from '../services/weather.service';

export class WeatherController {
  async getWeather(req: Request, res: Response): Promise<void> {
    try {
      const { city, units = 'metric' } = req.query;

      if (!city || typeof city !== 'string') {
        res.status(400).json({ error: 'City parameter is required' });
        return;
      }

      const weather = await weatherService.fetchWeather(city, units as string);
      const vibeColor = weatherService.getVibeColor(weather.temperature, weather.unitLabel);

      res.json({ ...weather, vibeColor });
    } catch (error: any) {
      console.error('Weather fetch error:', error.message);
      res.status(404).json({ error: error.message || 'Could not find weather for the specified city' });
    }
  }

  async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const { city, units = 'metric' } = req.query;

      if (!city || typeof city !== 'string') {
        res.status(400).json({ error: 'City parameter is required' });
        return;
      }

      const forecast = await weatherService.fetchForecast(city, units as string);
      res.json(forecast);
    } catch (error: any) {
      console.error('Forecast fetch error:', error.message);
      res.status(404).json({ error: error.message || 'Could not fetch forecast' });
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await weatherService.getAllHistory();
      res.json(history);
    } catch (error: any) {
      console.error('History fetch error:', error.message);
      res.status(500).json({ error: 'Could not fetch search history' });
    }
  }

  async getTopCities(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topCities = await weatherService.getTopCities(limit);
      res.json(topCities);
    } catch (error: any) {
      console.error('Top cities fetch error:', error.message);
      res.status(500).json({ error: 'Could not fetch top cities' });
    }
  }

  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const favorites = await weatherService.getFavorites();
      res.json(favorites);
    } catch (error: any) {
      console.error('Favorites fetch error:', error.message);
      res.status(500).json({ error: 'Could not fetch favorites' });
    }
  }

  async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { city, country } = req.body;

      if (!city || !country) {
        res.status(400).json({ error: 'City and country are required' });
        return;
      }

      const favorite = await weatherService.addFavorite(city, country);
      res.status(201).json(favorite);
    } catch (error: any) {
      console.error('Add favorite error:', error.message);
      res.status(500).json({ error: 'Could not add favorite' });
    }
  }

  async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      const id = parseInt(typeof idParam === 'string' ? idParam : idParam[0]);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Valid ID is required' });
        return;
      }

      await weatherService.removeFavorite(id);
      res.status(204).send();
    } catch (error: any) {
      console.error('Remove favorite error:', error.message);
      res.status(500).json({ error: 'Could not remove favorite' });
    }
  }

  async reverseGeocode(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Invalid latitude or longitude' });
        return;
      }

      const location = await weatherService.reverseGeocode(latitude, longitude);
      
      if (!location) {
        res.status(404).json({ error: 'Could not determine location' });
        return;
      }

      res.json(location);
    } catch (error: any) {
      console.error('Reverse geocode error:', error.message);
      res.status(500).json({ error: 'Could not determine location' });
    }
  }
}
