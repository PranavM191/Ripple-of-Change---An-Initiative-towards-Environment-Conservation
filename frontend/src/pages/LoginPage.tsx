import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "@/services/apiService";
import { Link } from "react-router-dom"; // Removed useNavigate
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate(); // We don't need this anymore
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            await login(email, password);
            toast({ title: "Welcome back!", description: "You successfully logged in." });
            
            // --- THE FIX ---
            // Instead of navigate("/"), we use window.location.href
            // This forces a page refresh, which updates the Header immediately.
            window.location.href = "/"; 
            
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Login Failed", 
                description: "Invalid email or password." 
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full bg-gradient-ocean">
                            Sign In
                        </Button>
                        <p className="text-sm text-center text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;