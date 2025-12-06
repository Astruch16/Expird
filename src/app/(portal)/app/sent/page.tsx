'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Eye,
  Clock,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Listing } from '@/types';

export default function SentListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  const fetchListings = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user?.id)
      .not('sent_at', 'is', null)
      .order('sent_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch listings');
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) =>
    listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnsend = async (listing: Listing) => {
    if (!confirm('Remove sent status from this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .update({ sent_at: null })
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to update listing');
    } else {
      toast.success('Sent status removed');
      fetchListings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sent Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all the expired and terminated listings you&apos;ve sent out
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 rounded-lg bg-primary/10">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">{listings.length}</span>
            <span className="text-muted-foreground">total sent</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sent listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Button
              variant="outline"
              onClick={fetchListings}
              disabled={loading}
              className="border-border"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Send className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No sent listings yet</p>
              <Link href="/app/listings">
                <Button variant="link" className="text-primary mt-1">
                  Go to listings and mark some as sent
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground">City</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Sent Date</TableHead>
                  <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} className="border-border/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {listing.address}
                      </div>
                    </TableCell>
                    <TableCell>{listing.city}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          listing.listing_type === 'expired'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-violet-500/10 text-violet-500'
                        }`}
                      >
                        {listing.listing_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          listing.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {listing.status === 'active' ? 'Back to Active!' : listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {listing.sent_at && format(new Date(listing.sent_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(listing.expiry_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/listings/${listing.id}`} className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/follow-ups?listing=${listing.id}`} className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Schedule Follow-up
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUnsend(listing)}
                            className="flex items-center gap-2 text-destructive"
                          >
                            <XCircle className="w-4 h-4" />
                            Remove Sent Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
