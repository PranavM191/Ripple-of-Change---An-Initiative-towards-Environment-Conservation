import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, Tooltip } from "react-leaflet"; // Added Tooltip
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Button } from "@/components/ui/button";
import { Navigation, Calendar, Users } from "lucide-react"; 
import { getHotspots, getAuthToken, getRecyclingCenters, getDrives } from "../services/apiService"; 
import { ReportHotspotDialog } from "@/components/ReportHotspotDialog"; 

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- ICONS ---
// Green for Recycling
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Blue for Drives
const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- INTERFACES ---
interface Hotspot { id: number; latitude: number; longitude: number; severity: 'LOW' | 'MODERATE' | 'HIGH'; }
interface RecyclingCenter { name: string; type: string; lat: number; lng: number; }
interface Drive { id: number; title: string; locationName: string; eventDate: string; status: string; latitude: number; longitude: number; participants: any[]; }

function buildHeatData(hotspots: Hotspot[]) {
    const tuples: [number, number, number][] = hotspots.map((h) => {
        const intensity = h.severity === "HIGH" ? 1.0 : h.severity === "MODERATE" ? 0.6 : 0.3;
        return [h.latitude, h.longitude, intensity];
    });
    return tuples;
}

function HeatLayer({ hotspots }: { hotspots: Hotspot[] }) {
    const map = useMap();
    useEffect(() => {
        if (!hotspots || hotspots.length === 0) return;
        const points = buildHeatData(hotspots);
        const layer = (L as any).heatLayer(points, {
            maxZoom: 25, radius: 30, blur: 12, minOpacity: 0.4,
            gradient: { 0.3: "#ffff00", 0.6: "#ffa500", 1.0: "#ff0000" },
        }).addTo(map);
        return () => { map.removeLayer(layer); };
    }, [map, hotspots]);
    return null;
}

export default function MapPage() {
    const center: [number, number] = [28.6500, 77.2400]; 
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [centers, setCenters] = useState<RecyclingCenter[]>([]);
    const [drives, setDrives] = useState<Drive[]>([]); // State for drives
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadData = async () => {
        try {
            const token = getAuthToken();
            setIsLoggedIn(!!token);
            
            const hotspotData = await getHotspots();
            setHotspots(hotspotData);
            
            const centerData = await getRecyclingCenters();
            setCenters(centerData);

            const drivesData = await getDrives();
            // Filter for only UPCOMING drives to show on map
            const upcoming = drivesData.filter((d: Drive) => d.status === 'UPCOMING');
            setDrives(upcoming);

        } catch (error) {
            console.error("Error fetching map data:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleNavigate = (lat: number, lng: number) => {
        const url = `http://googleusercontent.com/maps.google.com/maps?daddr=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <> 
            <div className="fixed bottom-8 right-8 z-[9999]"> 
               {isLoggedIn ? (
                   <ReportHotspotDialog onSuccess={loadData} />
               ) : (
                   <div className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-xl text-sm border border-gray-200">
                       Log in to report pollution
                   </div>
               )}
            </div>

            <div style={{ height: "85vh", width: "100%", position: "relative", zIndex: 0 }}>
                <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© OpenStreetMap contributors'
                    />
                    
                    {/* 1. Heatmap Layer */}
                    <HeatLayer hotspots={hotspots} />
                    
                    {/* 2. Recycling Centers (Green Markers + Labels) */}
                    {centers.map((center, idx) => (
                        <Marker key={`center-${idx}`} position={[center.lat, center.lng]} icon={greenIcon}>
                            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                                {center.name}
                            </Tooltip>
                            <Popup>
                                <div className="p-2 text-center">
                                    <h3 className="font-bold text-sm">{center.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">Recycling Center</p>
                                    <Button size="sm" className="w-full bg-blue-600 h-8 text-white" onClick={() => handleNavigate(center.lat, center.lng)}>
                                        <Navigation className="w-3 h-3 mr-2" /> Directions
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* 3. Upcoming Drives (Blue Markers + Labels) */}
                    {drives.map((drive) => (
                        <Marker key={`drive-${drive.id}`} position={[drive.latitude, drive.longitude]} icon={blueIcon}>
                            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                                📅 {drive.title}
                            </Tooltip>
                            <Popup>
                                <div className="p-2 w-48">
                                    <h3 className="font-bold text-sm mb-1">{drive.title}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mb-1">
                                        <Calendar className="w-3 h-3 mr-1" /> {new Date(drive.eventDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mb-3">
                                        <Users className="w-3 h-3 mr-1" /> {drive.participants.length} Joined
                                    </div>
                                    <Button size="sm" className="w-full bg-blue-600 h-8 text-white" onClick={() => handleNavigate(drive.latitude, drive.longitude)}>
                                        <Navigation className="w-3 h-3 mr-2" /> Navigate to Event
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </>
    );
}