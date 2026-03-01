import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const router = Router();
const weatherController = new WeatherController();

router.get('/weather', (req, res) => weatherController.getWeather(req, res));
router.get('/weather/forecast', (req, res) => weatherController.getForecast(req, res));
router.get('/history', (req, res) => weatherController.getHistory(req, res));
router.get('/stats/top-cities', (req, res) => weatherController.getTopCities(req, res));
router.get('/favorites', (req, res) => weatherController.getFavorites(req, res));
router.post('/favorites', (req, res) => weatherController.addFavorite(req, res));
router.delete('/favorites/:id', (req, res) => weatherController.removeFavorite(req, res));

export default router;
