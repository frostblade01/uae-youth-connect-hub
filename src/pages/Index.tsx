import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CheckCircle, Globe, Shield, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import opportunitiesIcon from '@/assets/opportunities-icon.jpg';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Easy Access to Events",
      description: "Discover opportunities instantly without endless searching"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Verified Opportunities",
      description: "All events are reviewed and verified by our admin team"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Both Emirati & All-Nationality Filters",
      description: "Find opportunities specifically for your background"
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Online & Offline Listings",
      description: "Whether you prefer virtual or in-person events"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="UAE Youth Opportunities" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-left max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              UAE Youth <span className="text-primary">Connect Hub</span>
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
              Discover More Opportunities for UAE Youth
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Students in the UAE often miss out on valuable opportunities due to lack of awareness or accessibility. 
              This platform curates these events for you.
            </p>
            
            <Link to={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="bg-gradient-primary shadow-primary text-lg px-8 py-6">
                {user ? "Browse Opportunities" : "See More"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose <span className="text-primary">UAE Youth Connect</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Students in the UAE often miss out on valuable opportunities due to lack of awareness or accessibility. 
              This platform curates these events for you, making it easier than ever to discover internships, 
              hackathons, MUNs, volunteering opportunities, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Everything You Need in One Place
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Comprehensive Filtering</h3>
                    <p className="text-muted-foreground">
                      Filter by type, subject, price, nationality requirements, format, and deadlines
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Bookmark Favorites</h3>
                    <p className="text-muted-foreground">
                      Save opportunities you're interested in and access them anytime
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Community Submissions</h3>
                    <p className="text-muted-foreground">
                      Submit opportunities you discover to help the community grow
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={opportunitiesIcon} 
                alt="Opportunities Preview"
                className="w-full rounded-lg shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of UAE students discovering amazing opportunities every day
          </p>
          
          {!user && (
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary shadow-primary text-lg px-8 py-6">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
