import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SubmitOpportunityModalProps {
  onSubmitted?: () => void;
}

const SubmitOpportunityModal = ({ onSubmitted }: SubmitOpportunityModalProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    short_summary: '',
    description: '',
    type: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('opportunities')
        .insert({
          ...formData,
          type: formData.type as any,
          submitted_by: user.id,
          status: 'pending' as any,
          deadline: formData.deadline || null,
          registration_link: formData.registration_link || null,
          image_url: formData.image_url || null
        });
      
      if (error) throw error;
      
      toast({
        title: "Opportunity Submitted!",
        description: "Your opportunity has been submitted for review. It will be visible once approved by an admin."
      });
      
      resetForm();
      setIsOpen(false);
      onSubmitted?.();
    } catch (error) {
      console.error('Error submitting opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to submit opportunity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-primary">
          <Plus className="h-4 w-4 mr-2" />
          Submit Opportunity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Opportunity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter opportunity title"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Type *</label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mun">MUN</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="volunteering">Volunteering</SelectItem>
                  <SelectItem value="summer_camp">Summer Camp</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Short Summary *</label>
            <Textarea
              value={formData.short_summary}
              onChange={(e) => setFormData(prev => ({ ...prev, short_summary: e.target.value }))}
              placeholder="Brief description (will be shown on the card)"
              required
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Full Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the opportunity"
              required
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Subject *</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Technology, Medicine"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Price</label>
              <Select value={formData.price} onValueChange={(value: 'free' | 'paid') => setFormData(prev => ({ ...prev, price: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Format</label>
              <Select value={formData.format} onValueChange={(value: 'online' | 'offline') => setFormData(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Target Audience</label>
              <Select value={formData.audience} onValueChange={(value: 'all' | 'emiratis') => setFormData(prev => ({ ...prev, audience: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nationalities</SelectItem>
                  <SelectItem value="emiratis">UAE Nationals Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Application Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Minimum Age</label>
              <Input
                type="number"
                value={formData.min_age}
                onChange={(e) => setFormData(prev => ({ ...prev, min_age: parseInt(e.target.value) || 14 }))}
                min="1"
                max="100"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Maximum Age</label>
              <Input
                type="number"
                value={formData.max_age}
                onChange={(e) => setFormData(prev => ({ ...prev, max_age: parseInt(e.target.value) || 30 }))}
                min="1"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Registration Link</label>
            <Input
              type="url"
              value={formData.registration_link}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_link: e.target.value }))}
              placeholder="https://example.com/register"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Image URL</label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={submitting}
              className="flex-1 bg-gradient-primary shadow-primary"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-primary/30 hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitOpportunityModal;