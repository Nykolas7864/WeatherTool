package com.weatherapp.controller;

import com.weatherapp.SearchRepository;
import com.weatherapp.WeatherData;
import com.weatherapp.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api") // This prefixes all routes in this class with /api
public class WeatherApiController {

    private final WeatherService weatherService;
    private final SearchRepository searchRepository;

    public WeatherApiController(WeatherService weatherService, SearchRepository searchRepository) {
        this.weatherService = weatherService;
        this.searchRepository = searchRepository;
    }

    @GetMapping("/weather")
    public WeatherData getWeather(@RequestParam String city, @RequestParam String units) throws Exception {
        // Because of the @RestController annotation,
        // Spring automatically converts the WeatherData object into JSON!
        return weatherService.fetchWeather(city, units);
    }
    @GetMapping("/stats")
    public List<Object[]> getStats() {
        return searchRepository.findMostSearchedCities();
    }
}