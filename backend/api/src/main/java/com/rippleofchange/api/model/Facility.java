package com.rippleofchange.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "facilities")
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Example: "PLASTIC", "ORGANIC", "HAZARDOUS", "MIXED"
    private String acceptedWasteCategory;

    private double latitude;
    private double longitude;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAcceptedWasteCategory() { return acceptedWasteCategory; }
    public void setAcceptedWasteCategory(String acceptedWasteCategory) { this.acceptedWasteCategory = acceptedWasteCategory; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}