import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Upload, AlertTriangle, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getHotspots } from "@/services/apiService";

interface Hotspot {
    id: number;
    latitude: number;
    longitude: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH';
    createdAt: string;
    displayName?: string; // We will add this property dynamically
}

const MapSection = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getHotspots();
            // Get the 3 most recent hotspots
            const recentThree = data.slice(-3).reverse();

            // --- NEW: REVERSE GEOCODING LOGIC ---
            // We transform the list by asking OpenStreetMap for the address of each point
            const enrichedHotspots = await Promise.all(
                recentThree.map(async (spot) => {
                    try {
                        // Free API call to OpenStreetMap
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${spot.latitude}&lon=${spot.longitude}`
                        );
                        const addressData = await response.json();
                        
                        // Clean up the address (Take the first 2 parts, e.g., "Yamuna Bank, Delhi")
                        // The API returns a long string, we just want the neighborhood/city
                        let cleanName = "Unknown Location";
                        if (addressData.address) {
                            const parts = [
                                addressData.address.suburb || addressData.address.neighbourhood || addressData.address.road,
                                addressData.address.city || addressData.address.state_district
                            ].filter(Boolean);
                            
                            cleanName = parts.length > 0 ? parts.join(", ") : addressData.display_name.split(",")[0];
                        }

                        return { ...spot, displayName: cleanName };
                    } catch (err) {
                        // Fallback if API fails
                        return { ...spot, displayName: `Lat: ${spot.latitude.toFixed(2)}` };
                    }
                })
            );

            setHotspots(enrichedHotspots);
        } catch (error) {
            console.error("Failed to fetch hotspots", error);
        }
    };
    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'destructive';
      case 'MODERATE': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  const handleContributeClick = () => {
      navigate("/impact");
  };

  return (
    <section id="impact-map" className="py-20 bg-gradient-surface">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Global Water Impact Map
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track water pollution hotspots worldwide. Help build the most comprehensive water quality database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Map Preview Card */}
          <div className="lg:col-span-2">
            <Card className="h-96 bg-white border shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.openstreetmap.org/assets/osm_logo-41dfeb75674d3875040a8099234365d9.svg')] bg-center bg-no-repeat opacity-5 grayscale group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-8 relative z-10">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="h-10 w-10 text-blue-600 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Live Interactive Map
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  View real-time pollution data, find recycling centers, and track cleanup drives in your city.
                </p>
                
                <div className="flex gap-4">
                    <Link to="/impact">
                        <Button className="bg-gradient-ocean text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all">
                            Launch Map <ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Real Data & Actions */}
          <div className="space-y-6">
            
            {/* Active Hotspots List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                  Recent Reports
                </CardTitle>
                <CardDescription>Real-time community submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotspots.length > 0 ? (
                    hotspots.map((hotspot) => (
                    <div key={hotspot.id} className="border-l-4 border-primary/20 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r-md">
                        <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">
                            {/* Use the fetched name, or a fallback */}
                            {hotspot.displayName || "Unknown Location"}
                        </h4>
                        <Badge variant={getSeverityColor(hotspot.severity) as any} className="text-[10px] px-1.5 shrink-0 ml-2">
                            {hotspot.severity}
                        </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                         Reported on {new Date(hotspot.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">No hotspots reported yet.</div>
                )}
              </CardContent>
            </Card>

            {/* Contribute Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Upload className="mr-2 h-5 w-5 text-primary" />
                  Contribute Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={handleContributeClick}>
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Water Photo
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleContributeClick}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Report Pollution
                </Button>
                <Button className="w-full justify-start" variant="outline" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Clean (NGO Only)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MapSection;