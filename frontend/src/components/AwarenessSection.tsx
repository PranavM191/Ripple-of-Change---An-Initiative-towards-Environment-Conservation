import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle, Camera, ArrowRight, Recycle } from "lucide-react";
import { Link } from "react-router-dom";

const AwarenessSection = () => {
  const steps = [
    {
      title: "1. Segregate at Source",
      desc: "Separate waste into three bags: Recyclable (Plastic/Glass), Wet (Organic), and Hazardous (E-waste).",
      icon: Recycle,
      color: "text-blue-500",
      bg: "bg-blue-100"
    },
    {
      title: "2. Locate Verified Partner",
      desc: "Use our Impact Map to find the nearest 'Verified Recycler' (Green Marker) specific to your waste type.",
      icon: MapPin,
      color: "text-red-500",
      bg: "bg-red-100"
    },
    {
      title: "3. Transport & Handover",
      desc: "Click 'Get Directions' on the map to navigate. Hand over waste only to authorized personnel at the gate.",
      icon: Truck,
      color: "text-yellow-500",
      bg: "bg-yellow-100"
    },
    {
      title: "4. Verify & Close Drive",
      desc: "Take a photo of the cleared site and the handover receipt. Upload it to mark the drive as 'Completed'.",
      icon: Camera,
      color: "text-green-500",
      bg: "bg-green-100"
    }
  ];

  return (
    <section className="py-20 bg-emerald-50/50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Disposal Protocol
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Collecting waste is only half the battle. Here is how to ensure it doesn't end up back in the river.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Visual Guide */}
            <div className="space-y-6">
                <Card className="border-none shadow-md">
                    <CardContent className="p-0">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
    <iframe 
        width="100%" 
        height="100%" 
        // Using TED-Ed: "What really happens to the plastic you throw away"
        src="https://www.youtube.com/embed/_6xlNyWPpB8" 
        title="Plastic Life Cycle" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
        className="border-none"
    ></iframe>
</div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2">Why "Smart Disposal" Matters?</h3>
                            <p className="text-muted-foreground text-sm">
                                Dumping collected waste into random municipal bins often leads to landfills. 
                                By routing waste to our <strong>Verified Partners</strong>, we ensure 85% of materials are recycled or converted to energy.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-emerald-900">Certified Green Chain</h4>
                            <p className="text-sm text-emerald-700/80 mt-1">
                                All centers listed on our map are government-audited facilities compliant with Waste Management Rules 2016.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Step-by-Step Guide */}
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="flex gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`shrink-0 w-12 h-12 ${step.bg} rounded-full flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 ${step.color}`} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-6">
                    <Link to="/impact">
                        <Button className="w-full h-12 text-lg bg-gradient-ocean gap-2 group">
                            Find Nearest Recycling Center
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default AwarenessSection;