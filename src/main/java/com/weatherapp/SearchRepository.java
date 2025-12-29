package com.weatherapp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SearchRepository extends JpaRepository<SearchRecord, Long> {

    // Custom query to find most searched cities
    @Query("SELECT s.city, COUNT(s) as count FROM SearchRecord s GROUP BY s.city ORDER BY count DESC")
    List<Object[]> findMostSearchedCities();

    // We'll define a simple interface to hold the count results
    interface CityStats {
        String getCity();
        Long getCount();
    }

    @Query("SELECT s.city as city, COUNT(s) as count FROM SearchRecord s GROUP BY s.city ORDER BY count DESC LIMIT 5")
    List<CityStats> findTop5Cities();

    // This tells Spring: "Select * from search_record order by search_time DESC"
    List<SearchRecord> findAllByOrderBySearchTimeDesc();
}