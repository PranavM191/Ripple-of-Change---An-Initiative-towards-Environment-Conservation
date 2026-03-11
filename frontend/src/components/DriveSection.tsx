import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Dialog imports
import { Calendar, MapPin, Users, Plus, Search, Trash2, CheckCircle, Flag, Globe } from "lucide-react";
import { getDrives, createDrive, joinDrive, leaveDrive, getCurrentUser } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import { CompleteDriveDialog } from "@/components/CompleteDriveDialog";

// --- Map Imports ---
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper: Map Click Handler
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setTimeout(() => onLocationSelect(e.latlng.lat, e.latlng.lng), 500);
        },
    });
    return position === null ? null : <Marker position={position} />;
}

interface Drive {
  id: number;
  title: string;
  description: string;
  locationName: string;
  eventDate: string;
  status: 'UPCOMING' | 'COMPLETED';
  participants: { email: string }[];
  organizer: { email: string; fullName: string };
  latitude: number; // Added coords
  longitude: number; // Added coords
}

const DriveSection = () => {
  const { toast } = useToast();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // Dialog States
  const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false); // New state for map picker

  const [newDrive, setNewDrive] = useState({
    title: "",
    locationName: "",
    date: "",
    time: "",
    description: "",
    latitude: 28.6139, // Default Delhi
    longitude: 77.2090
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        fetchDrives();
      } catch (error) {
        console.error("Init error:", error);
      }
    };
    loadData();
  }, []);

  const fetchDrives = async () => {
    try {
      const data = await getDrives();
      data.sort((a: Drive, b: Drive) => (a.status === 'COMPLETED' ? 1 : -1));
      setDrives(data);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  const handleCreateDrive = async () => {
    if (!currentUser) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in to create a drive." });
        return;
    }
    try {
        const eventDate = `${newDrive.date}T${newDrive.time || '09:00'}:00`;
        await createDrive({
            title: newDrive.title,
            locationName: newDrive.locationName,
            description: newDrive.description,
            eventDate: eventDate,
            latitude: newDrive.latitude, // Use selected coords
            longitude: newDrive.longitude 
        });
        toast({ title: "Success", description: "Drive created successfully!" });
        fetchDrives(); 
        setNewDrive({ title: "", locationName: "", date: "", time: "", description: "", latitude: 28.6139, longitude: 77.2090 });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Permission Denied", description: "Only registered NGOs can create drives." });
    }
  };

  const handleJoinLeave = async (drive: Drive) => {
    if (!currentUser) {
        toast({ variant: "destructive", title: "Error", description: "Please log in to join drives." });
        return;
    }
    const isJoined = drive.participants.some(p => p.email === currentUser);
    try {
        if (isJoined) {
            await leaveDrive(drive.id);
            toast({ title: "Left Drive", description: "You have left the cleanup drive." });
        } else {
            await joinDrive(drive.id);
            toast({ title: "Joined!", description: "You successfully joined the cleanup drive." });
        }
        fetchDrives(); 
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Action failed." });
    }
  };

  return (
    <div className="py-20 bg-gradient-surface">
      <div className="container mx-auto px-4">
        
        {/* START DRIVE FORM */}
        <section id="start-drive" className="mb-20">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Start Your Water Cleanup Drive</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Only registered NGOs can create drives.</p>
             </div>

             <div className="max-w-2xl mx-auto">
                <Card>
                   <CardHeader><CardTitle>Create New Drive</CardTitle></CardHeader>
                   <CardContent className="space-y-4">
                        <Input placeholder="Title" value={newDrive.title} onChange={(e) => setNewDrive({...newDrive, title: e.target.value})} />
                        
                        {/* Location Row with Map Button */}
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Location Name (e.g. Yamuna Bank)" 
                                value={newDrive.locationName} 
                                onChange={(e) => setNewDrive({...newDrive, locationName: e.target.value})}
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={() => setIsMapPickerOpen(true)} title="Pick on Map">
                                <Globe className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground ml-1">
                            Coordinates: {newDrive.latitude.toFixed(4)}, {newDrive.longitude.toFixed(4)}
                        </div>

                        <div className="flex gap-4">
                            <Input type="date" className="flex-1" value={newDrive.date} onChange={(e) => setNewDrive({...newDrive, date: e.target.value})} />
                            <Input type="time" className="w-32" value={newDrive.time} onChange={(e) => setNewDrive({...newDrive, time: e.target.value})} />
                        </div>
                        <Textarea placeholder="Description..." value={newDrive.description} onChange={(e) => setNewDrive({...newDrive, description: e.target.value})} />
                        <Button className="w-full bg-gradient-ocean" onClick={handleCreateDrive}><Plus className="mr-2 h-4 w-4" /> Create Drive</Button>
                   </CardContent>
                </Card>
             </div>
        </section>

        {/* JOIN DRIVES LIST */}
        <section id="join-drives">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join Existing Drives</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => {
                const isJoined = currentUser && drive.participants.some(p => p.email === currentUser);
                const isOrganizer = currentUser && drive.organizer?.email === currentUser;
                const isCompleted = drive.status === 'COMPLETED';

                return (
                  <Card key={drive.id} className={`hover:shadow-xl transition-shadow duration-300 ${isCompleted ? 'opacity-75 bg-gray-50' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex justify-between items-start">
                          {drive.title}
                          {isCompleted && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="mr-1 h-4 w-4" /> {drive.locationName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{drive.description}</p>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <div className="flex items-center text-primary">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(drive.eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-accent">
                          <Users className="mr-1 h-4 w-4" />
                          {drive.participants.length} joined
                        </div>
                      </div>
                      
                      {isCompleted ? (
                          <Button className="w-full" variant="secondary" disabled>Event Closed</Button>
                      ) : isOrganizer ? (
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelectedDrive(drive); setIsCompleteDialogOpen(true); }}>
                            <Flag className="mr-2 h-4 w-4" /> Mark as Complete
                          </Button>
                      ) : (
                          <Button className={`w-full ${isJoined ? "bg-red-100 text-red-600 hover:bg-red-200" : ""}`} variant="outline" onClick={() => handleJoinLeave(drive)}>
                            {isJoined ? "Leave Drive" : "Join Drive"}
                          </Button>
                      )}
                    </CardContent>
                  </Card>
                );
            })}
          </div>
        </section>

        {/* Dialogs */}
        {selectedDrive && (
            <CompleteDriveDialog isOpen={isCompleteDialogOpen} onClose={() => setIsCompleteDialogOpen(false)} onSuccess={fetchDrives} driveId={selectedDrive.id} driveTitle={selectedDrive.title} />
        )}

        {/* MAP PICKER DIALOG */}
        <Dialog open={isMapPickerOpen} onOpenChange={setIsMapPickerOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Pick Drive Location</DialogTitle>
                </DialogHeader>
                <div className="h-[400px] w-full rounded-md overflow-hidden border relative">
                    <MapContainer center={[28.6139, 77.2090]} zoom={11} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker onLocationSelect={(lat, lng) => {
                            setNewDrive(prev => ({ ...prev, latitude: lat, longitude: lng }));
                            setIsMapPickerOpen(false);
                            toast({ title: "Location Set", description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` });
                        }} />
                    </MapContainer>
                </div>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DriveSection;