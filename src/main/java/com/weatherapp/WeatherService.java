package com.weatherapp;

import org.apache.commons.text.WordUtils;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WeatherService {
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    private final SearchRepository searchRepository;

    public WeatherService(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    public WeatherData fetchWeather(String city, String units) throws Exception {
//        logger.info("Attempting to fetch weather for city: {}", city);
        /*
        // 1. Normalize: "  daLLas  " -> "Dallas"
        String normalizedCity = city.trim();
        if (!normalizedCity.isEmpty()) {
            normalizedCity = normalizedCity.substring(0, 1).toUpperCase() +
                    normalizedCity.substring(1).toLowerCase();
        }
        normalizedCity = org.apache.commons.text.WordUtils.capitalizeFully(city);
        */

        // 1. Clean up whitespace
        String trimmedCity = city.trim();

        // 2. "new york" -> "New York", "dallas" -> "Dallas"
        String normalizedCity = WordUtils.capitalizeFully(trimmedCity);

        logger.info(">>> NEW REQUEST: User is looking for weather in: {}", normalizedCity);
        String apiKey = System.getenv("WEATHER_API_KEY");

        String encodedCity = URLEncoder.encode(normalizedCity, StandardCharsets.UTF_8);

        // 1. Call Geocoding API first
        String geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + encodedCity + "&limit=1&appid=" + apiKey;

        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodedCity + "&units=" + units + "&appid=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        HttpRequest geoRequest = HttpRequest.newBuilder().uri(URI.create(geoUrl)).GET().build();
        HttpResponse<String> geoResponse = client.send(geoRequest, HttpResponse.BodyHandlers.ofString());

        JsonNode geoRoot = mapper.readTree(geoResponse.body());

//        String state = null;
//        if (geoRoot.isArray() && !geoRoot.isEmpty()) {
//            // Extract the state/province if it exists
//            state = geoRoot.get(0).path("state").asText();
//        }
        String state = null;
        if (geoRoot.isArray() && !geoRoot.isEmpty()) {
            JsonNode firstResult = geoRoot.get(0);
            if (firstResult.has("state")) {
                state = firstResult.path("state").asText();
            }
        }
        // If state is empty string, make it null for cleaner HTML logic
        if (state != null && state.trim().isEmpty()) {
            state = null;
        }

        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        //Throw exception if response was not successful
        if (response.statusCode() != 200) {
//            logger.error("Failed to fetch weather for {}. Status code: {}", city, response.statusCode());
            logger.warn(">>> API ISSUE: Weather for {} not found. Status: {}", normalizedCity, response.statusCode());
            throw new RuntimeException("City not found");
        }
//        logger.info("Successfully retrieved weather for: {}", city);
        logger.info(">>> SUCCESS: Found weather for {} via API", normalizedCity);


        JsonNode root = mapper.readTree(response.body());



        // 1. Extract the raw values from JSON
        String cityNameFromApi = root.path("name").asText();
        String country = root.path("sys").path("country").asText();
        double temperature = root.path("main").path("temp").asDouble(); // Renamed for clarity
        String description = root.path("weather").get(0).path("description").asText();
        String iconCode = root.path("weather").get(0).path("icon").asText();
        String label = units.equals("imperial") ? "°F" : "°C";

        long timezoneOffsetSeconds = root.path("timezone").asLong();
        Instant nowUtc = Instant.now();
        ZoneOffset offset = ZoneOffset.ofTotalSeconds((int) timezoneOffsetSeconds);
        ZonedDateTime localDateTime = nowUtc.atZone(offset);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
        String localTime = localDateTime.format(formatter);

        // After successful API call, save to DB:
        SearchRecord searchRecord = new SearchRecord(cityNameFromApi, temperature, iconCode);
        searchRecord.setUnitLabel(label);
        searchRecord.setState(state);
        searchRecord.setCountry(country);
        searchRecord.setLocalTime(localTime);
        searchRepository.save(searchRecord);
        // 2. Pass them into the record in the correct order
        // We return a simple record/DTO instead of raw JSON
        return new WeatherData(
                cityNameFromApi,
                state,
                country,
                temperature, // This maps to the record's 'tempCelsius'
                description,
                iconCode,
                label,
                localTime
        );
    }

    public List<SearchRecord> getAllHistory() {
        // This fetches all rows and sorts them so the newest searches are at the top
        return searchRepository.findAllByOrderBySearchTimeDesc();
    }
}