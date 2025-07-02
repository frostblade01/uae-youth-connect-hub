import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import OpportunityCard from '@/components/OpportunityCard';
import SubmitOpportunityModal from '@/components/SubmitOpportunityModal';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '' as string,
    subject: '',
    price: '' as string,
    audience: '' as string,
    format: '' as string
  });

  const fetchOpportunities = async () => {
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (filters.type) query = query.eq('type', filters.type as any);
      if (filters.price) query = query.eq('price', filters.price as any);
      if (filters.audience) query = query.eq('audience', filters.audience as any);
      if (filters.format) query = query.eq('format', filters.format as any);
      if (filters.subject) query = query.ilike('subject', `%${filters.subject}%`);

      const { data, error } = await query;
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('opportunity_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setBookmarks(data?.map(b => b.opportunity_id) || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchOpportunities(), fetchBookmarks()]).finally(() => setLoading(false));
  }, [filters, user]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Opportunities</h1>
          <SubmitOpportunityModal onSubmitted={fetchOpportunities} />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 bg-gradient-card shadow-card border-border/50 h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="mun">MUN</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="volunteering">Volunteering</SelectItem>
                      <SelectItem value="summer_camp">Summer Camp</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                  <Input
                    placeholder="Search subjects..."
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price</label>
                  <Select value={filters.price} onValueChange={(value) => setFilters(prev => ({ ...prev, price: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Audience</label>
                  <Select value={filters.audience} onValueChange={(value) => setFilters(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Audiences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Audiences</SelectItem>
                      <SelectItem value="all">All Nationalities</SelectItem>
                      <SelectItem value="emiratis">UAE Nationals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Format</label>
                  <Select value={filters.format} onValueChange={(value) => setFilters(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Formats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Formats</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Grid */}
          <div className="lg:col-span-3">
            {opportunities.length === 0 ? (
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Opportunities Yet</h3>
                  <p className="text-muted-foreground">No opportunities have been added yet. Check back later!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isBookmarked={bookmarks.includes(opportunity.id)}
                    onBookmarkChange={() => fetchBookmarks()}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;