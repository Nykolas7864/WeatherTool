package com.weatherapp; // Make sure this matches your package structure

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        // This line launches the embedded Tomcat server and starts Spring
        SpringApplication.run(Application.class, args);
    }
}