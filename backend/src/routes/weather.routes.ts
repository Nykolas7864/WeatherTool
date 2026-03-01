import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const router = Router();
const weatherController = new WeatherController();

router.get('/weather', weatherController.getWeather);
router.get('/weather/forecast', weatherController.getForecast);
router.get('/history', weatherController.getHistory);
router.get('/stats/top-cities', weatherController.getTopCities);
router.get('/favorites', weatherController.getFavorites);
router.post('/favorites', weatherController.addFavorite);
router.delete('/favorites/:id', weatherController.removeFavorite);

export default router;
