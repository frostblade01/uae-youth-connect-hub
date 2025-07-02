import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Plus, Edit, Trash2, Calendar, Users, MapPin, DollarSign } from 'lucide-react';
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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [pendingOpportunities, setPendingOpportunities] = useState<Opportunity[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    short_summary: '',
    description: '',
    type: '' as string,
    subject: '',
    price: 'free' as 'free' | 'paid',
    audience: 'all' as 'all' | 'emiratis',
    format: 'online' as 'online' | 'offline',
    deadline: '',
    registration_link: '',
    image_url: '',
    min_age: 14,
    max_age: 30
  });

  const fetchPendingOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPendingOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching pending opportunities:', error);
    }
  };

  const fetchAllOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAllOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching all opportunities:', error);
    }
  };

  const approveOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Opportunity approved successfully" });
      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (error) {
      console.error('Error approving opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to approve opportunity",
        variant: "destructive"
      });
    }
  };

  const rejectOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Opportunity rejected" });
      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (error) {
      console.error('Error rejecting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to reject opportunity",
        variant: "destructive"
      });
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Opportunity deleted successfully" });
      fetchAllOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to delete opportunity",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOpportunity) {
        const { error } = await supabase
          .from('opportunities')
          .update({
            ...formData,
            type: formData.type as any,
            deadline: formData.deadline || null,
            registration_link: formData.registration_link || null,
            image_url: formData.image_url || null
          })
          .eq('id', editingOpportunity.id);
        
        if (error) throw error;
        toast({ title: "Opportunity updated successfully" });
        setEditingOpportunity(null);
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert({
            ...formData,
            type: formData.type as any,
            status: 'approved' as any,
            deadline: formData.deadline || null,
            registration_link: formData.registration_link || null,
            image_url: formData.image_url || null
          });
        
        if (error) throw error;
        toast({ title: "Opportunity created successfully" });
        setIsCreateDialogOpen(false);
      }
      
      resetForm();
      fetchAllOpportunities();
    } catch (error) {
      console.error('Error submitting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to save opportunity",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short_summary: '',
      description: '',
      type: '',
      subject: '',
      price: 'free',
      audience: 'all',
      format: 'online',
      deadline: '',
      registration_link: '',
      image_url: '',
      min_age: 14,
      max_age: 30
    });
  };

  const startEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      short_summary: opportunity.short_summary,
      description: opportunity.description,
      type: opportunity.type,
      subject: opportunity.subject,
      price: opportunity.price,
      audience: opportunity.audience,
      format: opportunity.format,
      deadline: opportunity.deadline || '',
      registration_link: opportunity.registration_link || '',
      image_url: opportunity.image_url || '',
      min_age: opportunity.min_age || 14,
      max_age: opportunity.max_age || 30
    });
  };

  const formatType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-white">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-white">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      Promise.all([fetchPendingOpportunities(), fetchAllOpportunities()]).finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
              <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Opportunity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form content trimmed for brevity */}
                <Button type="submit" className="w-full bg-gradient-primary shadow-primary">
                  {editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending Approval ({pendingOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Opportunities ({allOpportunities.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingOpportunities.length === 0 ? (
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Pending Submissions</h3>
                  <p className="text-muted-foreground">All submissions have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pendingOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="bg-gradient-card shadow-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">{opportunity.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{opportunity.short_summary}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {formatType(opportunity.type)}
                            </Badge>
                            <Badge variant="outline">{opportunity.subject}</Badge>
                            {getStatusBadge(opportunity.status)}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => approveOpportunity(opportunity.id)}
                            className="bg-success hover:bg-success/80"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectOpportunity(opportunity.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t border-border/50 pt-4">
                        <h4 className="font-medium text-foreground mb-2">Description:</h4>
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">{opportunity.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {allOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-gradient-card shadow-card border-border/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{opportunity.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{opportunity.short_summary}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {formatType(opportunity.type)}
                          </Badge>
                          <Badge variant="outline">{opportunity.subject}</Badge>
                          {getStatusBadge(opportunity.status)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => startEdit(opportunity)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Opportunity</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <Button type="submit" className="w-full bg-gradient-primary shadow-primary">
                                Update Opportunity
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteOpportunity(opportunity.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">{allOpportunities.filter(o => o.status === 'approved').length}</h3>
                    <p className="text-muted-foreground">Approved Opportunities</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-warning">{pendingOpportunities.length}</h3>
                    <p className="text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground">{allOpportunities.length}</h3>
                    <p className="text-muted-foreground">Total Submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
