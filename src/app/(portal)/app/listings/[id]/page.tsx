'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Bath,
  Ruler,
  User,
  Phone,
  Mail,
  Send,
  Clock,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
  FileText,
  TrendingUp,
  CalendarPlus,
  History,
  Copy,
  Check,
  PhoneOff,
  PhoneCall,
  UserX,
  UserCheck,
  CalendarCheck,
  Flame,
  Thermometer,
  Snowflake,
  Target,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing, PipelineStage } from '@/types';
import { PIPELINE_STAGES } from '@/types';
import { getScoreLabel, getScoreBreakdown, calculateLeadScore } from '@/lib/scoring';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface ActivityLog {
  id: string;
  listing_id: string;
  user_id: string;
  activity_type: 'note' | 'email_sent' | 'status_change' | 'follow_up_scheduled' | 'created' | 'edited';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [newLogType, setNewLogType] = useState<string>('note');
  const [newLogDescription, setNewLogDescription] = useState('');
  const [addingLog, setAddingLog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [followUpDate, setFollowUpDate] = useState('');
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);

  const supabase = createClient();

  // Quick note templates for workflow
  const quickNoteTemplates = [
    { label: 'Left voicemail', icon: PhoneOff, description: 'Left a voicemail message' },
    { label: 'No answer', icon: PhoneOff, description: 'Called - no answer' },
    { label: 'Spoke with owner', icon: PhoneCall, description: 'Had a conversation with the owner' },
    { label: 'Not interested', icon: UserX, description: 'Owner not interested at this time' },
    { label: 'Interested', icon: UserCheck, description: 'Owner expressed interest' },
    { label: 'Meeting scheduled', icon: CalendarCheck, description: 'Scheduled a meeting with owner' },
  ];

  // Copy to clipboard function
  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Quick note handler
  const handleQuickNote = async (template: typeof quickNoteTemplates[0]) => {
    setAddingLog(true);
    await addActivityLog('note', template.description);
    toast.success('Note added');
    setAddingLog(false);
  };

  // Schedule follow-up inline
  const handleScheduleFollowUp = async () => {
    if (!followUpDate) {
      toast.error('Please select a date');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSchedulingFollowUp(true);

    const { error } = await supabase.from('follow_ups').insert({
      listing_id: id,
      user_id: user.id,
      scheduled_date: new Date(followUpDate).toISOString(),
      sent: false,
    });

    if (error) {
      toast.error('Failed to schedule follow-up');
    } else {
      await addActivityLog('follow_up_scheduled', `Follow-up scheduled for ${format(new Date(followUpDate), 'MMM d, yyyy')}`);
      toast.success('Follow-up scheduled');
      setFollowUpDate('');
    }
    setSchedulingFollowUp(false);
  };

  const fetchListing = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Failed to fetch listing');
      router.push('/listings');
    } else {
      setListing(data);
    }
    setLoading(false);
  };

  const fetchActivityLogs = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setActivityLogs(data);
    }
  };

  const addActivityLog = async (type: string, description: string, metadata?: Record<string, any>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('activity_logs').insert({
      listing_id: id,
      user_id: user.id,
      activity_type: type,
      description,
      metadata,
    });

    if (!error) {
      fetchActivityLogs();
    }
  };

  const handleAddLog = async () => {
    if (!newLogDescription.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setAddingLog(true);
    await addActivityLog(newLogType, newLogDescription.trim());
    setNewLogDescription('');
    setNewLogType('note');
    toast.success('Activity logged');
    setAddingLog(false);
  };

  useEffect(() => {
    fetchListing();
    fetchActivityLogs();
  }, [id]);

  useEffect(() => {
    if (!mapContainer.current || !listing || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [listing.longitude, listing.latitude],
      zoom: 15,
      interactive: true,
    });

    new mapboxgl.Marker({
      color: listing.status === 'active' ? '#22c55e' : listing.listing_type === 'expired' ? '#f43f5e' : '#8b5cf6',
    })
      .setLngLat([listing.longitude, listing.latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [listing]);

  const handleStatusToggle = async () => {
    if (!listing) return;

    const newStatus = listing.status === 'active' ? listing.listing_type : 'active';

    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Listing marked as ${newStatus}`);
      await addActivityLog(
        'status_change',
        `Status changed to ${newStatus}`,
        { old_status: listing.status, new_status: newStatus }
      );
      fetchListing();
    }
  };

  const handleMarkAsSent = async () => {
    if (!listing) return;

    const { error } = await supabase
      .from('listings')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to mark as sent');
    } else {
      toast.success('Listing marked as sent');
      await addActivityLog('email_sent', 'Marked as sent');
      fetchListing();
    }
  };

  const handleDelete = async () => {
    if (!listing || !confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to delete listing');
    } else {
      toast.success('Listing deleted');
      router.push('/listings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
        <p className="text-muted-foreground mt-2">Listing not found</p>
        <Link href="/app/listings">
          <Button variant="link" className="text-primary mt-1">
            Back to listings
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = () => {
    if (listing.status === 'active') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (listing.listing_type === 'expired') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
  };

  const getBoardLabel = () => {
    switch (listing.board) {
      case 'greater_vancouver': return 'Greater Vancouver';
      case 'fraser_valley': return 'Fraser Valley';
      case 'chilliwack': return 'Chilliwack';
      default: return listing.board;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/app/listings">
            <Button variant="ghost" size="icon" className="h-8 w-8 mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getStatusColor()}>
                {listing.status === 'active' ? 'Active' : listing.listing_type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getBoardLabel()}
              </Badge>
              {listing.sent_at && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Send className="w-3 h-3 mr-1" />
                  Sent
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{listing.address}</h1>
            <p className="text-muted-foreground mt-1">
              {listing.city}
              {listing.neighborhood && `, ${listing.neighborhood}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/listings/${listing.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusToggle}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {listing.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
          </Button>
          {!listing.sent_at && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsSent}
            >
              <Send className="w-4 h-4 mr-2" />
              Mark as Sent
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Workflow Status Bar */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lead Status:</span>
              <Badge className={`${getStatusColor()} text-sm`}>
                {listing.status === 'active' ? 'Back to Active' : listing.listing_type === 'expired' ? 'Expired' : 'Terminated'}
              </Badge>
              {listing.sent_at && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Send className="w-3 h-3 mr-1" />
                  Letter Sent
                </Badge>
              )}
              {activityLogs.some(log => log.description.toLowerCase().includes('interested')) && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Interested
                </Badge>
              )}
              {activityLogs.some(log => log.description.toLowerCase().includes('meeting')) && (
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  <CalendarCheck className="w-3 h-3 mr-1" />
                  Meeting Set
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!listing.sent_at && (
                <Button size="sm" variant="outline" onClick={handleMarkAsSent} className="border-border">
                  <Send className="w-3 h-3 mr-1" />
                  Mark Sent
                </Button>
              )}
              {listing.status !== 'active' && (
                <Button size="sm" variant="outline" onClick={handleStatusToggle} className="border-green-500/50 text-green-500 hover:bg-green-500/10">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Mark Active
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details & Timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Property Details */}
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.price && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <p className="text-xl font-bold">${listing.price.toLocaleString()}</p>
                </div>
              )}
              {listing.bedrooms && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Bedrooms</span>
                  </div>
                  <p className="text-xl font-bold">{listing.bedrooms}</p>
                </div>
              )}
              {listing.bathrooms && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm">Bathrooms</span>
                  </div>
                  <p className="text-xl font-bold">{listing.bathrooms}</p>
                </div>
              )}
              {listing.square_feet && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm">Sq Ft</span>
                  </div>
                  <p className="text-xl font-bold">{listing.square_feet.toLocaleString()}</p>
                </div>
              )}
            </div>

            <Separator className="my-6 bg-border" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">MLS Number:</span>
                <span className="ml-2 font-medium">{listing.mls_number || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expiry Date:</span>
                <span className="ml-2 font-medium">
                  {format(new Date(listing.expiry_date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Added:</span>
                <span className="ml-2 font-medium">
                  {format(new Date(listing.created_at), 'MMMM d, yyyy')}
                </span>
              </div>
              {listing.sent_at && (
                <div>
                  <span className="text-muted-foreground">Sent:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(listing.sent_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Days Counter & Contact Attempts */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Timeline & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Contact Attempts Counter */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Contact attempts</span>
              </div>
              <span className="text-xl font-bold text-primary">
                {activityLogs.filter(log =>
                  log.description.toLowerCase().includes('voicemail') ||
                  log.description.toLowerCase().includes('no answer') ||
                  log.description.toLowerCase().includes('spoke with') ||
                  log.description.toLowerCase().includes('called')
                ).length}
              </span>
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Days since expiry</span>
              <span className="text-xl font-bold text-rose-500">
                {differenceInDays(new Date(), new Date(listing.expiry_date))}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Days in system</span>
              <span className="text-xl font-bold text-primary">
                {differenceInDays(new Date(), new Date(listing.created_at))}
              </span>
            </div>
            {listing.sent_at && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Days since sent</span>
                <span className="text-xl font-bold text-green-500">
                  {differenceInDays(new Date(), new Date(listing.sent_at))}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Score Breakdown */}
      <Card className="border-border/50 glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Lead Score
          </CardTitle>
          <CardDescription>Score breakdown based on lead quality factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Overall Score */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                {listing.score >= 80 ? (
                  <Flame className="w-8 h-8 text-red-500" />
                ) : listing.score >= 60 ? (
                  <Thermometer className="w-8 h-8 text-orange-500" />
                ) : listing.score >= 40 ? (
                  <Thermometer className="w-8 h-8 text-blue-500" />
                ) : (
                  <Snowflake className="w-8 h-8 text-slate-500" />
                )}
              </div>
              <div className={`text-5xl font-bold ${getScoreLabel(listing.score).color}`}>
                {listing.score}
              </div>
              <div className={`text-lg font-medium mt-1 ${getScoreLabel(listing.score).color}`}>
                {getScoreLabel(listing.score).label} Lead
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Based on 5 quality factors
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="lg:col-span-4 space-y-3">
              {getScoreBreakdown(listing).map((factor) => (
                <div key={factor.factor} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{factor.factor}</span>
                    <span className="font-medium">
                      {factor.score}/100 × {factor.weight}% = <span className="text-primary">{factor.contribution}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
              <Separator className="my-4 bg-border" />
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total Score</span>
                <span className={`text-lg ${getScoreLabel(listing.score).color}`}>
                  {listing.score}/100
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Info, Map & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owner Info - Always show, with placeholder if no info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(listing.owner_name || listing.owner_phone || listing.owner_email) ? (
              <div className="space-y-3">
                {listing.owner_name && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{listing.owner_name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(listing.owner_name!, 'Name')}
                    >
                      {copiedField === 'Name' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
                {listing.owner_phone && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a href={`tel:${listing.owner_phone}`} className="font-medium text-primary hover:underline cursor-pointer">
                          {listing.owner_phone}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(listing.owner_phone!, 'Phone')}
                    >
                      {copiedField === 'Phone' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
                {listing.owner_email && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${listing.owner_email}`} className="font-medium text-primary hover:underline cursor-pointer">
                          {listing.owner_email}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(listing.owner_email!, 'Email')}
                    >
                      {copiedField === 'Email' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <User className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm mt-2">No owner info added</p>
                <Link href={`/listings/${listing.id}/edit`}>
                  <Button variant="link" size="sm" className="text-primary mt-1">
                    Add owner details
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={mapContainer}
              className="w-full h-[200px] rounded-lg overflow-hidden border border-border"
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Lat: {listing.latitude.toFixed(6)}</span>
              <span>Lng: {listing.longitude.toFixed(6)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Follow-up */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Inline Follow-up Scheduling */}
            <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-accent" />
                Schedule Follow-up
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="flex-1 bg-input border-border text-sm"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
                <Button
                  size="sm"
                  onClick={handleScheduleFollowUp}
                  disabled={schedulingFollowUp || !followUpDate}
                  className="bg-accent hover:bg-accent/90"
                >
                  {schedulingFollowUp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href={`/map?listing=${listing.id}`} className="block">
                <Button variant="outline" className="w-full justify-start border-border">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </Link>
              <Link href={`/listings/${listing.id}/edit`} className="block">
                <Button variant="outline" className="w-full justify-start border-border">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Listing
                </Button>
              </Link>
              {!listing.sent_at && (
                <Button
                  variant="outline"
                  className="w-full justify-start border-border"
                  onClick={handleMarkAsSent}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Mark as Sent
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section (if exists) */}
      {listing.notes && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Activity Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Log Entry */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Quick Log Entry
            </CardTitle>
            <CardDescription>Add a note or log an interaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Note Templates */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Quick notes (one-click)</p>
              <div className="grid grid-cols-2 gap-2">
                {quickNoteTemplates.map((template) => (
                  <Button
                    key={template.label}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs border-border h-auto py-2"
                    onClick={() => handleQuickNote(template)}
                    disabled={addingLog}
                  >
                    <template.icon className="w-3 h-3 mr-1.5 shrink-0" />
                    <span className="truncate">{template.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Custom Note */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Or add a custom note</p>
              <Select value={newLogType} onValueChange={setNewLogType}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Note
                    </div>
                  </SelectItem>
                  <SelectItem value="email_sent">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Sent
                    </div>
                  </SelectItem>
                  <SelectItem value="follow_up_scheduled">
                    <div className="flex items-center gap-2">
                      <CalendarPlus className="w-4 h-4" />
                      Follow-up Scheduled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Enter details about this interaction..."
                value={newLogDescription}
                onChange={(e) => setNewLogDescription(e.target.value)}
                className="min-h-[80px] bg-input border-border resize-none"
              />

              <Button
                onClick={handleAddLog}
                disabled={addingLog || !newLogDescription.trim()}
                className="w-full btn-glow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {addingLog ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Log Entry
                    </>
                  )}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Activity Timeline
            </CardTitle>
            <CardDescription>History of all interactions with this listing</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLogs.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-4">
                  {activityLogs.map((log, index) => {
                    const getLogIcon = () => {
                      switch (log.activity_type) {
                        case 'note':
                          return <FileText className="w-4 h-4" />;
                        case 'email_sent':
                          return <Mail className="w-4 h-4" />;
                        case 'status_change':
                          return <TrendingUp className="w-4 h-4" />;
                        case 'follow_up_scheduled':
                          return <CalendarPlus className="w-4 h-4" />;
                        case 'created':
                          return <Plus className="w-4 h-4" />;
                        case 'edited':
                          return <Pencil className="w-4 h-4" />;
                        default:
                          return <MessageSquare className="w-4 h-4" />;
                      }
                    };

                    const getLogColor = () => {
                      switch (log.activity_type) {
                        case 'note':
                          return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                        case 'email_sent':
                          return 'bg-green-500/10 text-green-500 border-green-500/20';
                        case 'status_change':
                          return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
                        case 'follow_up_scheduled':
                          return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
                        case 'created':
                          return 'bg-primary/10 text-primary border-primary/20';
                        case 'edited':
                          return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                        default:
                          return 'bg-secondary text-secondary-foreground border-border';
                      }
                    };

                    const getLogTypeLabel = () => {
                      switch (log.activity_type) {
                        case 'note':
                          return 'Note';
                        case 'email_sent':
                          return 'Email Sent';
                        case 'status_change':
                          return 'Status Change';
                        case 'follow_up_scheduled':
                          return 'Follow-up';
                        case 'created':
                          return 'Created';
                        case 'edited':
                          return 'Edited';
                        default:
                          return 'Activity';
                      }
                    };

                    return (
                      <div key={log.id} className="relative flex gap-4 pl-2">
                        {/* Icon */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 ${getLogColor()}`}
                        >
                          {getLogIcon()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`text-xs ${getLogColor()}`}>
                              {getLogTypeLabel()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{log.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No activity logged yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add your first note or log an interaction
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
