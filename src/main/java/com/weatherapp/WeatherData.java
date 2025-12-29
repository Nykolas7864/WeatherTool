package com.weatherapp;

public record WeatherData(String city, String state, String country, double temperature, String description, String iconCode,
                          String unitLabel, String localTime) {
    public double getTempFahrenheit() {
        return (temperature * 9/5) + 32;
    }

    public String getVibeColor() {
        boolean isHot = (unitLabel.equals("°F") ? temperature > 80 : temperature > 27);
        boolean isCold = (unitLabel.equals("°F") ? temperature < 45 : temperature < 7);

        if (isHot) return "linear-gradient(135deg, #ff9966, #ff5e62)";
        if (isCold) return "linear-gradient(135deg, #7f7fd5, #86a8e7)";
        return "linear-gradient(135deg, #e0eafc, #cfdef3)";
    }
}