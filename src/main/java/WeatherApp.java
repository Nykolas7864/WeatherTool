import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Scanner;

public class WeatherApp {
    public static void main(String[] args) throws Exception {
        String apiKey = System.getenv("WEATHER_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            System.err.println("Error: WEATHER_API_KEY environment variable not set!");
            return;
        }

        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a city name: ");
        String city = scanner.nextLine();
//        String city = "London";
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

        // 1. Create a Client
        HttpClient client = HttpClient.newHttpClient();

        // 2. Create the Request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        // 3. Send the Request and get the Response
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Status Code: " + response.statusCode());
        System.out.println("Response Body: " + response.body());
/*

        // 4. Parse the JSON
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.body());

        // 5. Output the result
        double temp = root.path("main").path("temp").asDouble();
        String description = root.path("weather").get(0).path("description").asText();

        System.out.println("Current weather in " + city + ":");
        System.out.println("Temperature: " + temp + "°C");
        System.out.println("Condition: " + description);
*/

        // 4. Check if the request was successful
        if (response.statusCode() == 200) {


            double temp = parseTemperature(response.body());
//            System.out.println("Temperature: " + temp + "°C");

            // Defensive check for the nested array
            JsonNode weatherArray = parseWeather(response.body());
            String description = "No description available";
            if (weatherArray.isArray() && !weatherArray.isEmpty()) {
                description = weatherArray.get(0).path("description").asText();
            }

            System.out.println("Current weather in " + city + ":");
            System.out.println("Temperature: " + temp + "°C");
            System.out.println("Condition: " + description);
        } else {
            System.err.println("Error: API returned status code " + response.statusCode());
            System.err.println("Message: " + response.body());
        }

    }

    public static double parseTemperature(String jsonResponse) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(jsonResponse);

        return root.path("main").path("temp").asDouble();
    }

    public static JsonNode parseWeather(String jsonResponse) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(jsonResponse);

        return root.path("weather");
    }
}