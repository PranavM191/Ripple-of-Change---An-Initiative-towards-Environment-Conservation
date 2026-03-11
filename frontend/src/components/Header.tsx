import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Droplets, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUserName, clearAuthToken } from "@/services/apiService"; // Import Name getter
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null); // Store Name, not Email
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for logged-in user when component loads
  useEffect(() => {
    const name = getCurrentUserName();
    setUserName(name);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUserName(null);
    toast({ title: "Logged Out", description: "See you next time!" });
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Start a Drive", href: "/#start-drive" },
    { name: "Join Drives", href: "/#join-drives" },
    { name: "NGO Partners", href: "/#ngo-partners" },
    { name: "Impact Map", href: "/impact", isRoute: true },
    { name: "Donate", href: "/#donate" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* --- Logo --- */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Droplets className="h-8 w-8 text-primary animate-wave" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ripple"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
              Ripple of Change
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </a>
              )
            )}
          </nav>

          {/* --- Desktop User Actions --- */}
          <div className="hidden md:flex items-center gap-4">
            {userName ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                    <User className="h-4 w-4 text-primary" />
                    {userName}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/register">
                <Button variant="default" className="bg-gradient-wave">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* --- Mobile Navigation --- */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              )}
              
              <div className="px-4 pt-4 border-t mt-2">
                {userName ? (
                    <div className="flex flex-col gap-3">
                        <span className="text-sm text-muted-foreground font-medium">Hi, {userName}</span>
                        <Button variant="outline" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="default" className="w-full bg-gradient-wave">
                            Get Started
                        </Button>
                    </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;