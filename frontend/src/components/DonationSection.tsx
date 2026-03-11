import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Droplets, Users, BookOpen, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const amounts = [25, 50, 100, 250];

  const handleDonate = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount <= 0) {
        toast({ variant: "destructive", title: "Invalid Amount", description: "Please select or enter a donation amount." });
        return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
        setIsProcessing(false);
        toast({ 
            title: "Thank You! 🎉", 
            description: `Your donation of $${amount} has been successfully processed. You are making a difference!` 
        });
        setSelectedAmount(null);
        setCustomAmount("");
    }, 2000);
  };

  return (
    <section id="donate" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Make a Direct Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose your donation amount and see the immediate impact of your contribution.
            </p>
        </div>

        <div className="max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-cyan-500 shadow-lg">
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Left Column: Selection */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Donation</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {amounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant={selectedAmount === amount ? "default" : "outline"}
                                            className={`h-16 text-xl ${selectedAmount === amount ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-gray-200'}`}
                                            onClick={() => {
                                                setSelectedAmount(amount);
                                                setCustomAmount("");
                                            }}
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <input 
                                        type="number" 
                                        placeholder="Other Amount ($)"
                                        className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount(null);
                                        }}
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={handleDonate} 
                                disabled={isProcessing}
                                className="w-full h-12 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="mr-2 h-5 w-5 fill-current" />
                                        Donate with Secure Payment
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Powered by SecureMockPay™ • 256-bit SSL Encrypted
                            </p>
                        </div>

                        {/* Right Column: Impact Visuals */}
                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-900">Your Impact</h3>
                            
                            <div className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm">
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                    <Droplets className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">$25 can clean 500 gallons of water</p>
                                    <p className="text-xs text-gray-500">Provides filters and testing kits</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">$50 supports 10 community volunteers</p>
                                    <p className="text-xs text-gray-500">Safety gear, gloves, and bags</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm">
                                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">$100 funds educational outreach</p>
                                    <p className="text-xs text-gray-500">Workshops for local schools</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    <span>
                                        <strong>Transparency Promise:</strong> 100% of donations go directly to water conservation projects.
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </section>
  );
};

export default DonationSection;