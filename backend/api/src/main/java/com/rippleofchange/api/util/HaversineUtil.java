package com.rippleofchange.api.util;

public class HaversineUtil {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculates the geodesic distance between two points using the Haversine formula.
     * @param lat1 Latitude of the cleanup hotspot
     * @param lon1 Longitude of the cleanup hotspot
     * @param lat2 Latitude of the recycling facility
     * @param lon2 Longitude of the recycling facility
     * @return Distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Convert degrees to radians
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double originLat = Math.toRadians(lat1);
        double destinationLat = Math.toRadians(lat2);

        // Apply the Haversine formula
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.cos(originLat) * Math.cos(destinationLat) *
                        Math.pow(Math.sin(dLon / 2), 2);

        double c = 2 * Math.asin(Math.sqrt(a));

        return EARTH_RADIUS_KM * c;
    }
}