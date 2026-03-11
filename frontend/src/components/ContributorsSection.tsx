import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Medal, Crown, Gift, Zap } from "lucide-react";
import { getLeaderboard, getCurrentUser } from "@/services/apiService";

// Match backend User model
interface User {
  id: number;
  fullName: string;
  email: string;
  points: number;
}

const ContributorsSection = () => {
  const [topContributors, setTopContributors] = useState<User[]>([]);
  const [myPoints, setMyPoints] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // 1. Get top users from API
        const data = await getLeaderboard();
        setTopContributors(data);

        // 2. Check my own points
        const email = getCurrentUser();
        setCurrentUserEmail(email);
        
        if (email && data.length > 0) {
            // Simple way: if I'm in the top 10, show my points. 
            // Ideally, we'd have a separate /me endpoint for profile details.
            const me = data.find((u: User) => u.email === email);
            if (me) setMyPoints(me.points);
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      }
    };

    loadLeaderboard();
  }, []);

  // Helper to get initials
  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getBadgeIcon = (index: number) => {
    switch (index) {
      case 0: return Crown;
      case 1: return Trophy;
      case 2: return Medal;
      default: return Star;
    }
  };

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-amber-500';
      case 2: return 'text-orange-500';
      default: return 'text-primary';
    }
  };

  // Static Rewards Data (Keep this for display)
  const rewards = [
    { name: "Eco-Friendly Bottle", points: 500, available: 45, icon: Gift },
    { name: "Cleanup Kit", points: 1000, available: 23, icon: Zap },
    { name: "Plant a Tree", points: 1500, available: 12, icon: Star }
  ];

  return (
    <section id="contributors" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Contributors & Rewards
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Recognize our water warriors making the biggest impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* --- REAL LEADERBOARD --- */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-primary" />
                  Top Contributors
                </CardTitle>
                <CardDescription>Champions making the biggest impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topContributors.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No contributions yet. Be the first!</p>
                ) : (
                    topContributors.map((contributor, index) => {
                      const BadgeIcon = getBadgeIcon(index);
                      const badgeColor = getBadgeColor(index);
                      
                      return (
                        <div key={contributor.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-surface">
                          <div className="relative">
                            <div className={`absolute -top-2 -right-2 ${badgeColor}`}>
                              <BadgeIcon className="h-5 w-5" />
                            </div>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="" alt={contributor.fullName} />
                              <AvatarFallback>{getInitials(contributor.fullName)}</AvatarFallback>
                            </Avatar>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-foreground">
                                {contributor.fullName}
                                {contributor.email === currentUserEmail && <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>}
                              </h4>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contributor.points.toLocaleString()} points
                            </div>
                          </div>
                          
                          <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                        </div>
                      );
                    })
                )}
              </CardContent>
            </Card>
          </div>

          {/* --- YOUR PROGRESS --- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Keep contributing to level up!</CardDescription>
              </CardHeader>
              <CardContent>
                {currentUserEmail ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{myPoints}</div>
                        <div className="text-sm text-muted-foreground">Total Points</div>
                      </div>
                      <Progress value={Math.min((myPoints / 100) * 100, 100)} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">Next Reward at 100 pts</p>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">Log in to see your points</p>
                        <Button variant="outline" asChild><a href="/login">Log In</a></Button>
                    </div>
                )}
              </CardContent>
            </Card>

            {/* Static Points Info */}
            <Card>
              <CardHeader><CardTitle>How to Earn Points</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-sm">Report pollution</span><Badge variant="outline">+10 pts</Badge></div>
                <div className="flex justify-between"><span className="text-sm">Join cleanup drive</span><Badge variant="outline">+50 pts</Badge></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- REWARDS (Static Display) --- */}
        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Exclusive Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <Card key={reward.name} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">{reward.points} pts</div>
                    <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContributorsSection;