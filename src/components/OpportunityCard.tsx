import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Calendar, Users, MapPin, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  short_summary: string;
  type: string;
  subject: string;
  price: 'free' | 'paid';
  audience: 'all' | 'emiratis';
  format: 'online' | 'offline';
  deadline?: string;
  image_url?: string;
  registration_link?: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  isBookmarked?: boolean;
  onBookmarkChange?: () => void;
  showAdminActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const OpportunityCard = ({ 
  opportunity, 
  isBookmarked = false, 
  onBookmarkChange,
  showAdminActions = false,
  onEdit,
  onDelete
}: OpportunityCardProps) => {
  const { user } = useAuth();
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const formatType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleBookmark = async () => {
    if (!user) return;
    
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunity.id);
        
        if (error) throw error;
        toast({ title: "Removed from bookmarks" });
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, opportunity_id: opportunity.id });
        
        if (error) throw error;
        toast({ title: "Added to bookmarks" });
      }
      
      onBookmarkChange?.();
    } catch (error) {
      console.error('Bookmark error:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 border-border/50">
      {opportunity.image_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={opportunity.image_url} 
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {opportunity.title}
          </h3>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className="text-muted-foreground hover:text-primary shrink-0 ml-2"
            >
              <Bookmark 
                className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} 
              />
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {opportunity.short_summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {formatType(opportunity.type)}
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/30">
            {opportunity.subject}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="capitalize">{opportunity.price}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{opportunity.audience === 'all' ? 'All Nationalities' : 'UAE Nationals'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{opportunity.format}</span>
          </div>
          
          {opportunity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between">
        <Link to={`/opportunity/${opportunity.id}`}>
          <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
            See More
          </Button>
        </Link>
        
        {opportunity.registration_link && (
          <Button 
            size="sm" 
            className="bg-gradient-primary shadow-primary"
            onClick={() => window.open(opportunity.registration_link, '_blank')}
          >
            Register
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;