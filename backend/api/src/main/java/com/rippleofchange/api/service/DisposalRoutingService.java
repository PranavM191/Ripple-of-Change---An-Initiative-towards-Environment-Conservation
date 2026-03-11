package com.rippleofchange.api.service;

import com.rippleofchange.api.model.Facility;
import com.rippleofchange.api.repository.FacilityRepository;
import com.rippleofchange.api.util.HaversineUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisposalRoutingService {

    @Autowired
    private FacilityRepository facilityRepository;

    /**
     * Finds and ranks the best disposal facilities based on waste type and Haversine distance.
     * @param cleanupLat Latitude of the finished cleanup drive
     * @param cleanupLon Longitude of the finished cleanup drive
     * @param wasteType The type of waste collected (e.g., "PLASTIC")
     * @return A sorted list of compatible facilities, closest first
     */
    public List<Facility> getOptimalRouting(double cleanupLat, double cleanupLon, String wasteType) {

        // 1. Fetch all verified facilities from the database
        List<Facility> allFacilities = facilityRepository.findAll();

        // 2. Filter by waste compatibility AND sort by Haversine distance
        return allFacilities.stream()
                // Keep facilities that accept this specific waste, or accept "MIXED" waste
                .filter(f -> f.getAcceptedWasteCategory().equalsIgnoreCase(wasteType) ||
                        f.getAcceptedWasteCategory().equalsIgnoreCase("MIXED"))
                // Sort the remaining facilities by calculating geodesic distance using our math utility
                .sorted(Comparator.comparingDouble(f ->
                        HaversineUtil.calculateDistance(cleanupLat, cleanupLon, f.getLatitude(), f.getLongitude())))
                .collect(Collectors.toList());
    }
}