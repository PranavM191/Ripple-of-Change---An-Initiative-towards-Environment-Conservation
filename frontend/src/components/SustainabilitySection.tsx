import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Leaf, Recycle, Droplets, Globe, Target, CheckCircle } from "lucide-react";
import { getDrives } from "@/services/apiService";

// Define the structure of a Drive (matching backend)
interface Drive {
  id: number;
  title: string;
  locationName: string;
  status: 'UPCOMING' | 'COMPLETED';
  wasteCollected: number;
  afterPhotoUrl: string;
  eventDate: string;
}

const SustainabilitySection = () => {
  const [completedDrives, setCompletedDrives] = useState<Drive[]>([]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [totalDrives, setTotalDrives] = useState(0);

 useEffect(() => {
    const fetchImpactData = async () => {
      try {
        console.log(">>> Fetching drives..."); // DEBUG 1
        const allDrives = await getDrives();
        console.log(">>> RAW DATA FROM BACKEND:", allDrives); // DEBUG 2
        
        // Filter only COMPLETED drives
        const finished = allDrives.filter((d: Drive) => d.status === 'COMPLETED');
        console.log(">>> FILTERED COMPLETED DRIVES:", finished); // DEBUG 3

        setCompletedDrives(finished);
        setTotalDrives(finished.length);

        // Calculate total waste
        const waste = finished.reduce((sum: number, d: Drive) => sum + (d.wasteCollected || 0), 0);
        setTotalWaste(waste);

      } catch (error) {
        console.error(">>> ERROR FETCHING DRIVES:", error); // DEBUG 4
      }
    };

    fetchImpactData();
  }, []);

  // Dynamic Metrics based on REAL data
  const globalMetrics = [
    {
      title: "Cleanups Completed",
      current: totalDrives,
      target: 50, // Goal
      unit: "drives",
      icon: Droplets,
      trend: "Active",
      color: "text-blue-500"
    },
    {
      title: "Waste Removed",
      current: totalWaste,
      target: 1000, // Goal (kg)
      unit: "kg",
      icon: Recycle,
      trend: "Growing",
      color: "text-green-500"
    }
  ];

  // (Keep your existing static data for now, it looks good as context)
  const sdgGoals = [
    { number: 6, title: "Clean Water and Sanitation", progress: 78, description: "Ensure access to water and sanitation for all", status: "On Track" },
    { number: 14, title: "Life Below Water", progress: 65, description: "Conserve and sustainably use oceans", status: "Accelerating" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Real-World Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the tangible difference we are making together. Verified data from our community drives.
          </p>
        </div>

        {/* Key Metrics (Dynamic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {globalMetrics.map((metric) => {
            const Icon = metric.icon;
            const progress = Math.min((metric.current / metric.target) * 100, 100);
            
            return (
              <Card key={metric.title} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                    <div className="flex items-center text-success text-sm font-bold">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {metric.trend}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        {metric.current.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{metric.unit}</div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-sm font-medium">{metric.title}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- NEW: WE MADE A DIFFERENCE GALLERY --- */}
        {completedDrives.length > 0 && (
            <div className="mb-20">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <Award className="text-yellow-500" /> 
                        We Made a Difference
                    </h3>
                    <p className="text-muted-foreground">Before & After results from our latest missions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completedDrives.map((drive) => (
                        <Card key={drive.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                            {/* Image Section */}
                            <div className="relative h-48 w-full bg-gray-200">
                                {drive.afterPhotoUrl ? (
                                    <img 
                                        src={`http://localhost:8081${drive.afterPhotoUrl}`} 
                                        alt="After Cleanup" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2 bg-green-600">COMPLETED</Badge>
                            </div>
                            
                            <CardHeader>
                                <CardTitle className="text-lg">{drive.title}</CardTitle>
                                <CardDescription>{drive.locationName}</CardDescription>
                            </CardHeader>
                            
                            <CardContent>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="text-sm font-medium text-green-800">Waste Removed:</span>
                                    <span className="text-xl font-bold text-green-700">{drive.wasteCollected} kg</span>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground text-right">
                                    Completed on {new Date(drive.eventDate).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}

        {/* --- SDG Goals (Static for context) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                UN Sustainable Development Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sdgGoals.map((goal) => (
                <div key={goal.number} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {goal.number}
                      </div>
                      <div>
                        <div className="font-medium">{goal.title}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{goal.status}</Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-surface flex flex-col justify-center text-center p-8">
             <Award className="h-12 w-12 text-primary mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Certified Impact</h3>
             <p className="text-muted-foreground mb-4">
                Our data is verified and contributes directly to national environmental indices.
             </p>
             <Badge className="mx-auto bg-green-600">Gold Standard</Badge>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default SustainabilitySection;