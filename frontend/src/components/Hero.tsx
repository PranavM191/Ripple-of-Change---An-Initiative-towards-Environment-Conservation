import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Award } from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";

const Hero = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Active Contributors" },
    { icon: MapPin, value: "500+", label: "Cleanup Drives" },
    { icon: Award, value: "2M+", label: "Liters Cleaned" }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Clean water representing hope and sustainability"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-accent/50"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-float">
            Create a <span className="text-accent">Ripple</span> of Change
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Join thousands of water warriors making our rivers, lakes, and oceans cleaner. 
            Every action creates a ripple that transforms communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            
            {/* Button 1: Start Drive */}
            <a href="#start-drive">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 w-full sm:w-auto">
                  Start a Cleanup Drive
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </a>

            {/* Button 2: Impact Map (Fixed Visibility) */}
            <a href="#impact-map">
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white bg-black/20 hover:bg-white hover:text-primary w-full sm:w-auto transition-colors"
                >
                  Explore Impact Map
                </Button>
            </a>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;