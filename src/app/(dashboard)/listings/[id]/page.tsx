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
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

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

  useEffect(() => {
    fetchListing();
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
      color: listing.status === 'active' ? '#22c55e' : listing.listing_type === 'expired' ? '#f97316' : '#eab308',
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
        <Link href="/listings">
          <Button variant="link" className="text-primary mt-1">
            Back to listings
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = () => {
    if (listing.status === 'active') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (listing.listing_type === 'expired') return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
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
          <Link href="/listings">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Details */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
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

              <div className="grid grid-cols-2 gap-4 text-sm">
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

          {/* Owner Info */}
          {(listing.owner_name || listing.owner_phone || listing.owner_email) && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {listing.owner_name && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{listing.owner_name}</p>
                      </div>
                    </div>
                  )}
                  {listing.owner_phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a href={`tel:${listing.owner_phone}`} className="font-medium text-primary hover:underline">
                          {listing.owner_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {listing.owner_email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${listing.owner_email}`} className="font-medium text-primary hover:underline">
                          {listing.owner_email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {listing.notes && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{listing.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                className="w-full h-[250px] rounded-lg overflow-hidden border border-border"
              />
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Lat: {listing.latitude.toFixed(6)}</p>
                <p>Lng: {listing.longitude.toFixed(6)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/follow-ups?listing=${listing.id}`} className="block">
                <Button variant="outline" className="w-full justify-start border-border">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </Link>
              <Link href={`/map?listing=${listing.id}`} className="block">
                <Button variant="outline" className="w-full justify-start border-border">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
