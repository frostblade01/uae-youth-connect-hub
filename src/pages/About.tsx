import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Target, Users, Globe, CheckCircle } from 'lucide-react';

const About = () => {
  const problems = [
    "Students miss valuable opportunities due to lack of awareness",
    "Information is scattered across multiple platforms",
    "No centralized system for UAE-specific opportunities",
    "Students don't know where to look for extracurriculars"
  ];

  const solutions = [
    "Centralized platform for all opportunities",
    "Verified and curated content",
    "UAE-specific filtering options",
    "Easy search and discovery"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">UAE Youth Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering UAE youth by making opportunities accessible and centralized
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-destructive" />
                <h2 className="text-3xl font-bold text-foreground">The Problem</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Many extracurricular opportunities exist in the UAE, but students often don't know about them 
                or don't make the effort to search across multiple platforms and sources.
              </p>
              
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-3 shrink-0"></div>
                    <p className="text-muted-foreground">{problem}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Current Challenges</h3>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Awareness Gap</h4>
                    <p className="text-sm text-muted-foreground">Students are unaware of 70% of available opportunities</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Fragmented Information</h4>
                    <p className="text-sm text-muted-foreground">Opportunities spread across 10+ different platforms</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Time Consuming</h4>
                    <p className="text-sm text-muted-foreground">Students spend hours searching without success</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Card className="bg-gradient-card shadow-card border-border/50 order-2 lg:order-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Platform Features</h3>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">Smart Filtering</h4>
                    <p className="text-sm text-muted-foreground">Filter by nationality, format, price, and more</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">Verified Content</h4>
                    <p className="text-sm text-muted-foreground">All opportunities reviewed by our admin team</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">Community Driven</h4>
                    <p className="text-sm text-muted-foreground">Students can submit new opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-8 w-8 text-success" />
                <h2 className="text-3xl font-bold text-foreground">Our Solution</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                UAE Youth Connect centralizes all extracurricular opportunities in one platform, 
                making it easy for students to discover, filter, and apply to relevant programs.
              </p>
              
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-1 shrink-0" />
                    <p className="text-muted-foreground">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Platform Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How UAE Youth Connect makes a difference for students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  For Students
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Easy discovery of opportunities</li>
                  <li>• Personalized filtering options</li>
                  <li>• Bookmark favorite events</li>
                  <li>• One-click registration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  For Organizations
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Reach target audience easily</li>
                  <li>• Verified platform presence</li>
                  <li>• Increased event visibility</li>
                  <li>• Direct student engagement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  For UAE
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Increased youth engagement</li>
                  <li>• Better skill development</li>
                  <li>• Stronger communities</li>
                  <li>• Future-ready workforce</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;