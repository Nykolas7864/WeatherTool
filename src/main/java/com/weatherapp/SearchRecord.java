package com.weatherapp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SearchRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String city;
    private String state;
    private String country;
    private LocalDateTime searchTime;
    private String iconCode;
    private Double temperature;
    private String unitLabel;
    private String localTime;

    public SearchRecord() {} // Required by JPA
    //TODO: Update constructor to include all class fields as required part of constructor
    //the other fields I'm just setting right after constructing the search record anyway.
    public SearchRecord(String city, Double temperature, String iconCode) {
        this.city = city;
        this.temperature = temperature;
        this.iconCode = iconCode;
        this.searchTime = LocalDateTime.now();
    }

    // Getters and Setters...

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getIconCode() { return iconCode; }
    public void setIconCode(String iconCode) { this.iconCode = iconCode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public LocalDateTime getSearchTime() { return searchTime; }
    public void setSearchTime(LocalDateTime searchTime) { this.searchTime = searchTime; }


    public String getUnitLabel() {
        return unitLabel;
    }

    public void setUnitLabel(String unitLabel) {
        this.unitLabel = unitLabel;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocalTime() {
        return localTime;
    }

    public void setLocalTime(String localTime) {
        this.localTime = localTime;
    }
}