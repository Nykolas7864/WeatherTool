package com.weatherapp.controller;

import com.weatherapp.SearchRepository;
import com.weatherapp.WeatherData;
import com.weatherapp.WeatherService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class WeatherController {

    private final WeatherService weatherService;
    private final SearchRepository searchRepository;

    // Spring "injects" the service here (Dependency Injection)
    public WeatherController(WeatherService weatherService, SearchRepository searchRepository) {
        this.weatherService = weatherService;
        this.searchRepository = searchRepository;
    }
/*
    @GetMapping("/weather")
    public String getWeather(@RequestParam String city, Model model) {
        try {
            WeatherData data = weatherService.fetchWeather(city);
            model.addAttribute("weather", data);
        } catch (Exception e) {
            model.addAttribute("error", "Could not find weather for: " + city);
        }
        return "index";
    }
    */

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("topCities", searchRepository.findTop5Cities());
        return "index";
    }

    @GetMapping("/weather")
    public String getWeather(@RequestParam String city, @RequestParam(required = false, defaultValue = "metric") String units, Model model) {
        try {
            WeatherData data = weatherService.fetchWeather(city, units);
            model.addAttribute("weather", data);
        } catch (Exception e) {
            model.addAttribute("error", "Could not find weather for: " + city);
        }
        // Always refresh the stats so the table updates
        model.addAttribute("topCities", searchRepository.findTop5Cities());
        return "index";
    }

    @GetMapping("/history")
    public String displayHistory(Model model) {
        model.addAttribute("historyList", weatherService.getAllHistory());
        return "history"; // This looks for history.html in templates
    }

}
