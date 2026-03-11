import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Upload, Loader2, Sparkles, ScanLine, Globe } from "lucide-react";
import { createHotspot } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// --- Fix for Leaflet Marker Icons in React ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper Component: Handle Map Clicks ---
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            // Small delay to let the user see the marker before closing
            setTimeout(() => {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }, 500);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

interface ReportHotspotDialogProps {
  onSuccess: () => void;
}

export function ReportHotspotDialog({ onSuccess }: ReportHotspotDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [aiStatus, setAiStatus] = useState(""); 
  
  // New State for Map Picking Mode
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  // Option A: GPS
  const handleGetLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocating(false);
          toast({ title: "Location Captured", description: "GPS coordinates locked." });
        },
        () => {
          setLocating(false);
          toast({ variant: "destructive", title: "Error", description: "Could not get location." });
        }
      );
    }
  };

  // Option B: Map Picker
  const handleMapSelect = (lat: number, lng: number) => {
      setLocation({ lat, lng });
      setIsMapPickerOpen(false); // Close map, show form
      toast({ title: "Location Selected", description: "Coordinates locked from map." });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!location || !file) {
      toast({ variant: "destructive", title: "Missing Data", description: "Photo and Location are required." });
      return;
    }

    setLoading(true);
    setAiStatus("Uploading image...");

    try {
      const formData = new FormData();
      const jsonData = JSON.stringify({ latitude: location.lat, longitude: location.lng });
      formData.append("data", jsonData);
      formData.append("file", file);

      setTimeout(() => setAiStatus("AI Model Analyzing Waste Density..."), 500);
      setTimeout(() => setAiStatus("Classifying Pollution Type..."), 1500);

      const result = await createHotspot(formData);
      
      toast({ 
          title: "AI Analysis Complete! 🤖", 
          description: `Severity Classified as: ${result.severity}` 
      });
      
      setOpen(false);
      onSuccess(); 
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Submission failed." });
    } finally {
      setLoading(false);
      setAiStatus("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg rounded-full px-6 h-12">
          <Camera className="h-5 w-5" />
          Report Pollution
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-purple-500 h-5 w-5" />
            AI-Assisted Reporting
          </DialogTitle>
          <DialogDescription>
            {isMapPickerOpen 
                ? "Tap anywhere on the map to set the location." 
                : "Upload a photo. Our RippleNet™ AI model will automatically detect severity."}
          </DialogDescription>
        </DialogHeader>
        
        {/* --- CONDITIONAL RENDERING: MAP PICKER vs FORM --- */}
        {isMapPickerOpen ? (
            <div className="h-[300px] w-full rounded-md overflow-hidden border border-gray-200 relative">
                <MapContainer 
                    center={[28.6139, 77.2090]} // Default center (Delhi)
                    zoom={11} 
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationSelect={handleMapSelect} />
                </MapContainer>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2 z-[500]"
                    onClick={() => setIsMapPickerOpen(false)}
                >
                    Cancel
                </Button>
            </div>
        ) : (
            <div className="grid gap-6 py-4">
            
                {/* Location Step */}
                <div className="space-y-2">
                    <Label>1. Geo-Tagging</Label>
                    <div className="flex gap-2">
                        <Button 
                            variant={location ? "default" : "outline"} 
                            onClick={handleGetLocation} 
                            disabled={locating} 
                            className="flex-1"
                        >
                            {locating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                            Current GPS
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsMapPickerOpen(true)} 
                            className="flex-1"
                        >
                            <Globe className="mr-2 h-4 w-4" />
                            Choose on Map
                        </Button>
                    </div>
                    {location && (
                        <p className="text-xs text-green-600 font-medium text-center">
                            ✅ Coordinates Locked: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* Image Step */}
                <div className="space-y-2">
                    <Label>2. Evidence Photo</Label>
                    <div className="flex items-center gap-2">
                        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                {/* AI Status Box */}
                {loading && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex items-center gap-3 animate-pulse">
                        <ScanLine className="h-6 w-6 text-purple-600 animate-bounce" />
                        <div className="text-sm font-medium text-purple-700">
                            {aiStatus}
                        </div>
                    </div>
                )}

                <Button onClick={handleSubmit} disabled={loading || !location || !file} className="w-full bg-gradient-ocean">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Analyze & Report
                        </>
                    )}
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}