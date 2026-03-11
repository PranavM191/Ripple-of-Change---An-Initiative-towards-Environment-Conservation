import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("volunteer");

    // Common State
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // NGO Specific State
    const [orgName, setOrgName] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construct the URL based on the tab
        const endpoint = activeTab === "volunteer" 
            ? "http://localhost:8081/api/auth/register"
            : "http://localhost:8081/api/auth/register-ngo";

        const bodyData = activeTab === "volunteer" 
            ? { fullName, email, password }
            : { fullName, email, password, organizationName: orgName };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                toast({ title: "Account Created", description: "You can now log in!" });
                navigate("/login");
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error: any) {
            toast({ 
                variant: "destructive", 
                title: "Registration Failed", 
                description: error.message || "Something went wrong." 
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Join the ripple of change today
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="volunteer" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                            <TabsTrigger value="ngo">NGO / Organization</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleRegister}>
                            <div className="space-y-4">
                                {activeTab === "ngo" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="orgName">Organization Name</Label>
                                        <Input 
                                            id="orgName" 
                                            placeholder="Green Earth Foundation" 
                                            required 
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">
                                        {activeTab === "ngo" ? "Contact Person Name" : "Full Name"}
                                    </Label>
                                    <Input 
                                        id="fullName" 
                                        placeholder="John Doe" 
                                        required 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-ocean mt-4">
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;