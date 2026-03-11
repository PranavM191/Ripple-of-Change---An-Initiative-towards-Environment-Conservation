package com.rippleofchange.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/recycling")
public class RecyclingController {

    // Simple inner class for data
    public static class Center {
        public String name;
        public String type;
        public double lat;
        public double lng;

        public Center(String name, String type, double lat, double lng) {
            this.name = name;
            this.type = type;
            this.lat = lat;
            this.lng = lng;
        }
    }

    @GetMapping
    public List<Center> getCenters() {
        return Arrays.asList(
                new Center("Okhla Waste to Energy Plant", "Energy Recovery", 28.5562, 77.2820),
                new Center("Bhalaswa Recycling Hub", "Plastic Recycling", 28.7372, 77.1619),
                new Center("Ghazipur Management Facility", "Electronic Waste", 28.6267, 77.3295),
                new Center("New Delhi E-Waste Dropoff", "E-Waste", 28.6139, 77.2090)
        );
    }
}