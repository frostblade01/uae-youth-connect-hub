import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, DollarSign, ExternalLink, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  short_summary: string;
  type: string;
  subject: string;
  price: 'free' | 'paid';
  audience: 'all' | 'emiratis';
  format: 'online' | 'offline';
  deadline?: string;
  image_url?: string;
  registration_link?: string;
  min_age?: number;
  max_age?: number;
}

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchOpportunity = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();
      
      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunity details",
        variant: "destructive"
      });
    }
  };

  const checkBookmark = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('opportunity_id', id)
        .single();
      
      setIsBookmarked(!!data);
    } catch (error) {
      // Not bookmarked
      setIsBookmarked(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !id) return;
    
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', id);
        
        if (error) throw error;
        setIsBookmarked(false);
        toast({ title: "Removed from bookmarks" });
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, opportunity_id: id });
        
        if (error) throw error;
        setIsBookmarked(true);
        toast({ title: "Added to bookmarks" });
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  const formatType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    Promise.all([fetchOpportunity(), checkBookmark()]).finally(() => setLoading(false));
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
              <p className="text-muted-foreground mb-6">This opportunity may have been removed or doesn't exist.</p>
              <Link to="/dashboard">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Button>
          </Link>
        </div>

        <Card className="bg-gradient-card shadow-elegant border-border/50">
          {opportunity.image_url && (
            <div className="aspect-[2/1] w-full overflow-hidden rounded-t-lg">
              <img 
                src={opportunity.image_url} 
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{opportunity.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{opportunity.short_summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {formatType(opportunity.type)}
                  </Badge>
                  <Badge variant="outline" className="border-muted-foreground/30">
                    {opportunity.subject}
                  </Badge>
                </div>
              </div>
              
              {user && (
                <Button
                  variant="outline"
                  onClick={toggleBookmark}
                  className={`ml-4 ${isBookmarked ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="capitalize font-medium">{opportunity.price}</span>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  <span>{opportunity.audience === 'all' ? 'All Nationalities' : 'UAE Nationals'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="capitalize">{opportunity.format}</span>
                </div>
                
                {opportunity.deadline && (
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {(opportunity.min_age || opportunity.max_age) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Age Requirements</h3>
                  <p className="text-muted-foreground">
                    {opportunity.min_age && opportunity.max_age 
                      ? `Ages ${opportunity.min_age} - ${opportunity.max_age}`
                      : opportunity.min_age 
                        ? `Ages ${opportunity.min_age}+`
                        : `Ages up to ${opportunity.max_age}`
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {opportunity.registration_link && (
                <Button 
                  size="lg" 
                  className="bg-gradient-primary shadow-primary flex-1"
                  onClick={() => window.open(opportunity.registration_link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
              )}
              
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" size="lg" className="w-full border-primary/30 hover:bg-primary/10">
                  Browse More Opportunities
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityDetail;