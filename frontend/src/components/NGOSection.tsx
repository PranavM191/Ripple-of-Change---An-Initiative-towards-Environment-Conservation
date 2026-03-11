import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Users, BookOpen, Megaphone, Building2 } from "lucide-react";
import { getNgos } from "@/services/apiService";
import { Link } from "react-router-dom";

interface User {
    id: number;
    fullName: string;
    organizationName: string;
    points: number;
}

const NGOSection = () => {
  const [ngos, setNgos] = useState<User[]>([]);

  useEffect(() => {
    const fetchNgos = async () => {
        try {
            const data = await getNgos();
            setNgos(data);
        } catch (error) {
            console.error("Error fetching NGOs", error);
        }
    };
    fetchNgos();
  }, []);

  const benefits = [
    { title: "Partnership Programs", description: "Form strategic alliances to amplify your impact.", icon: Handshake },
    { title: "Volunteer Exchange", description: "Share volunteer networks for large-scale cleanups.", icon: Users },
    { title: "Knowledge Sharing", description: "Access best practices and research data.", icon: BookOpen },
    { title: "Joint Campaigns", description: "Collaborate on awareness and fundraising.", icon: Megaphone }
  ];

  return (
    <section id="ngo-partners" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            NGO Partners & Collaboration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join forces with established NGOs and environmental organizations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Partners (Real Data) */}
        <div className="mb-20">
            <h3 className="text-2xl font-bold text-center mb-8">Featured Partners</h3>
            {ngos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ngos.map((ngo) => (
                        <Card key={ngo.id} className="bg-white border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Building2 className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <CardTitle className="text-lg">{ngo.organizationName || "Organization"}</CardTitle>
                                        <CardDescription>Delhi, India</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Leading conservation efforts with community-driven initiatives.
                                </p>
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span className="text-green-600">Impact Score: {ngo.points}</span>
                                    <Button variant="ghost" size="sm" className="text-primary">Partner with Us</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">No partners registered yet.</div>
            )}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-blue-100 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Amplify Your Impact?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Connect with like-minded organizations and create lasting change in water conservation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                        Register as NGO Partner
                    </Button>
                </Link>
                <Button variant="outline" className="bg-white">
                    Browse All Partners
                </Button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default NGOSection;