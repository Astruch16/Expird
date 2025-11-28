'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Clock,
  Calendar,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
  MapPin,
  Loader2,
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { toast } from 'sonner';
import type { Listing, FollowUp } from '@/types';

interface FollowUpWithListing extends FollowUp {
  listing?: Listing;
}

const TIMEFRAME_OPTIONS = [
  { value: '3d', label: '3 Days', addFn: (date: Date) => addDays(date, 3) },
  { value: '1w', label: '1 Week', addFn: (date: Date) => addWeeks(date, 1) },
  { value: '2w', label: '2 Weeks', addFn: (date: Date) => addWeeks(date, 2) },
  { value: '1m', label: '1 Month', addFn: (date: Date) => addMonths(date, 1) },
  { value: '2m', label: '2 Months', addFn: (date: Date) => addMonths(date, 2) },
  { value: '3m', label: '3 Months', addFn: (date: Date) => addMonths(date, 3) },
  { value: 'custom', label: 'Custom Date', addFn: null },
];

export default function FollowUpsPage() {
  const searchParams = useSearchParams();
  const preselectedListingId = searchParams.get('listing');

  const [followUps, setFollowUps] = useState<FollowUpWithListing[]>([]);
  const [sentListings, setSentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState<string>(preselectedListingId || '');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1w');
  const [customDate, setCustomDate] = useState<string>('');

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch follow-ups with listing data
    const { data: followUpsData, error: followUpsError } = await supabase
      .from('follow_ups')
      .select('*, listing:listings(*)')
      .eq('user_id', user?.id)
      .order('scheduled_date', { ascending: true });

    // Fetch sent listings for the dropdown
    const { data: sentData, error: sentError } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user?.id)
      .not('sent_at', 'is', null)
      .order('sent_at', { ascending: false });

    if (followUpsError || sentError) {
      toast.error('Failed to fetch data');
    } else {
      setFollowUps(followUpsData || []);
      setSentListings(sentData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (preselectedListingId && sentListings.length > 0) {
      const exists = sentListings.find((l) => l.id === preselectedListingId);
      if (exists) {
        setSelectedListing(preselectedListingId);
        setDialogOpen(true);
      }
    }
  }, [preselectedListingId, sentListings]);

  const handleCreateFollowUp = async () => {
    if (!selectedListing) {
      toast.error('Please select a listing');
      return;
    }

    let scheduledDate: Date;

    if (selectedTimeframe === 'custom') {
      if (!customDate) {
        toast.error('Please select a date');
        return;
      }
      scheduledDate = new Date(customDate);
    } else {
      const option = TIMEFRAME_OPTIONS.find((o) => o.value === selectedTimeframe);
      if (!option?.addFn) {
        toast.error('Invalid timeframe');
        return;
      }
      scheduledDate = option.addFn(new Date());
    }

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('follow_ups').insert({
      user_id: user?.id,
      listing_id: selectedListing,
      scheduled_date: scheduledDate.toISOString(),
    });

    if (error) {
      toast.error('Failed to create follow-up');
    } else {
      toast.success('Follow-up scheduled! You will receive an email reminder.');
      setDialogOpen(false);
      setSelectedListing('');
      setSelectedTimeframe('1w');
      setCustomDate('');
      fetchData();
    }
    setCreating(false);
  };

  const handleMarkAsSent = async (followUp: FollowUpWithListing) => {
    const { error } = await supabase
      .from('follow_ups')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .eq('id', followUp.id);

    if (error) {
      toast.error('Failed to update follow-up');
    } else {
      toast.success('Follow-up marked as sent');
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this follow-up?')) return;

    const { error } = await supabase
      .from('follow_ups')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete follow-up');
    } else {
      toast.success('Follow-up deleted');
      fetchData();
    }
  };

  const pendingFollowUps = followUps.filter((f) => !f.sent);
  const completedFollowUps = followUps.filter((f) => f.sent);

  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Follow-ups
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule follow-up reminders for your sent listings
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Follow-up</DialogTitle>
              <DialogDescription>
                Select a sent listing and choose when you want to be reminded to follow up.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Listing</Label>
                <Select value={selectedListing} onValueChange={setSelectedListing}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Choose a sent listing" />
                  </SelectTrigger>
                  <SelectContent>
                    {sentListings.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No sent listings available
                      </div>
                    ) : (
                      sentListings.map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {listing.address}, {listing.city}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTimeframe === 'custom' && (
                <div className="space-y-2">
                  <Label>Custom Date</Label>
                  <Input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="bg-input border-border"
                  />
                </div>
              )}

              <Button
                onClick={handleCreateFollowUp}
                disabled={creating || !selectedListing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-3xl font-bold">{pendingFollowUps.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Pending Follow-ups</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-3xl font-bold">
                {pendingFollowUps.filter((f) => isOverdue(f.scheduled_date)).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Overdue</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-3xl font-bold">{completedFollowUps.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Follow-ups */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Pending Follow-ups
          </CardTitle>
          <CardDescription>
            These are your upcoming follow-up reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : pendingFollowUps.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No pending follow-ups</p>
              <Button
                variant="link"
                className="text-primary mt-1"
                onClick={() => setDialogOpen(true)}
              >
                Schedule your first follow-up
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Listing</TableHead>
                  <TableHead className="text-muted-foreground">Scheduled Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingFollowUps.map((followUp) => (
                  <TableRow key={followUp.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{followUp.listing?.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {followUp.listing?.city}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(followUp.scheduled_date), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isOverdue(followUp.scheduled_date) ? (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsSent(followUp)}
                          className="border-border"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Mark Done
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(followUp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Follow-ups */}
      {completedFollowUps.length > 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Completed Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Listing</TableHead>
                  <TableHead className="text-muted-foreground">Completed Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedFollowUps.map((followUp) => (
                  <TableRow key={followUp.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="font-medium">{followUp.listing?.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {followUp.listing?.city}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {followUp.sent_at && format(new Date(followUp.sent_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(followUp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
