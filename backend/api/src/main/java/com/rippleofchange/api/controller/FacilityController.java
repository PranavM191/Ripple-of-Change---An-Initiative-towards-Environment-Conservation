package com.rippleofchange.api.controller;

import com.rippleofchange.api.model.Facility;
import com.rippleofchange.api.service.DisposalRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*") // Allows your React frontend to call this API
public class FacilityController {

    @Autowired
    private DisposalRoutingService disposalRoutingService;

    /**
     * Endpoint for the React frontend to request the nearest compatible recycling centers.
     * Example URL: GET /api/facilities/route?lat=12.9716&lon=77.5946&wasteType=PLASTIC
     */
    @GetMapping("/route")
    public ResponseEntity<List<Facility>> getOptimalRoute(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String wasteType) {

        List<Facility> nearestFacilities = disposalRoutingService.getOptimalRouting(lat, lon, wasteType);
        return ResponseEntity.ok(nearestFacilities);
    }
}