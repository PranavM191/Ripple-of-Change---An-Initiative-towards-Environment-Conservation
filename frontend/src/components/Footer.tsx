import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
        toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
        return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        toast({ title: "Subscribed! 🌊", description: "You are now part of the wave." });
        setEmail("");
    }, 1500);
  };

  const footerSections = [
    {
      title: "Get Involved",
      links: [
        { name: "Start a Drive", href: "/#start-drive" },
        { name: "Join Cleanup", href: "/#join-drives" },
        { name: "Report Pollution", href: "/impact" },
        { name: "Partner with Us", href: "/register" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Impact Map", href: "/impact" },
        { name: "Recycling Centers", href: "/impact" },
        { name: "Educational Materials", href: "/#donate" }, // Points to awareness section
        { name: "Research Reports", href: "#" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Top Contributors", href: "/#contributors" },
        { name: "NGO Partners", href: "/#ngo-partners" },
        { name: "Success Stories", href: "/#impact-map" },
        { name: "Events Calendar", href: "/#join-drives" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Donate", href: "/#donate" },
        { name: "Corporate Partnerships", href: "/#ngo-partners" },
        { name: "Grant Programs", href: "#" },
        { name: "Contact Us", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Droplets className="h-8 w-8 text-accent animate-wave" />
              </div>
              <span className="text-xl font-bold">Ripple of Change</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-sm">
              Creating waves of positive environmental impact through community-driven 
              water conservation initiatives worldwide.
            </p>
            
            {/* Newsletter Signup */}
            <div>
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex max-w-sm gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="secondary" className="shrink-0" onClick={handleSubscribe} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ? (
                         <Link 
                            to={link.href}
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 text-sm"
                         >
                            {link.name}
                         </Link>
                    ) : (
                        <a 
                          href={link.href} 
                          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info & Social Links */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <div className="space-y-2 text-primary-foreground/80 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contact@rippleofchange.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+91 11 2345 6789</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Connaught Place, New Delhi, India</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3">Follow Our Impact</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-200"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Environmental Commitment */}
            <div>
              <h4 className="font-semibold mb-3">Our Commitment</h4>
              <p className="text-sm text-primary-foreground/80">
                Carbon neutral operations • 100% renewable energy • 
                Transparent impact reporting • Community-first approach
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-primary-foreground/80 text-sm mb-4 md:mb-0">
              © 2025 Ripple of Change. All rights reserved. | Privacy Policy | Terms of Service
            </div>
            <div className="text-primary-foreground/80 text-sm">
              Made with 💙 for our planet
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;