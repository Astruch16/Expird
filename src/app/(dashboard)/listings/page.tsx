'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Send,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Listing, ListingStatus, Board, ListingType } from '@/types';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [boardFilter, setBoardFilter] = useState<string>('all');

  const supabase = createClient();

  const fetchListings = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    if (typeFilter !== 'all') {
      query = query.eq('listing_type', typeFilter);
    }
    if (boardFilter !== 'all') {
      query = query.eq('board', boardFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch listings');
      console.error(error);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [statusFilter, typeFilter, boardFilter]);

  const filteredListings = listings.filter((listing) =>
    listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusToggle = async (listing: Listing) => {
    const newStatus: ListingStatus = listing.status === 'active'
      ? listing.listing_type
      : 'active';

    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Listing marked as ${newStatus}`);
      fetchListings();
    }
  };

  const handleMarkAsSent = async (listing: Listing) => {
    const { error } = await supabase
      .from('listings')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', listing.id);

    if (error) {
      toast.error('Failed to mark as sent');
    } else {
      toast.success('Listing marked as sent');
      fetchListings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete listing');
    } else {
      toast.success('Listing deleted');
      fetchListings();
    }
  };

  const getStatusColor = (status: ListingStatus, type: ListingType) => {
    if (status === 'active') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (type === 'expired') return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  const getBoardLabel = (board: Board) => {
    switch (board) {
      case 'greater_vancouver': return 'Greater Vancouver';
      case 'fraser_valley': return 'Fraser Valley';
      case 'chilliwack': return 'Chilliwack';
      default: return board;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your expired and terminated listings
          </p>
        </div>
        <Link href="/listings/new">
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, city, or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="w-[160px] bg-input border-border">
                  <SelectValue placeholder="Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  <SelectItem value="greater_vancouver">Greater Vancouver</SelectItem>
                  <SelectItem value="fraser_valley">Fraser Valley</SelectItem>
                  <SelectItem value="chilliwack">Chilliwack</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={fetchListings}
                className="border-border"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
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
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No listings found</p>
              <Link href="/listings/new">
                <Button variant="link" className="text-primary mt-1">
                  Add your first listing
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground">City</TableHead>
                  <TableHead className="text-muted-foreground">Board</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                  <TableHead className="text-muted-foreground">Sent</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} className="border-border/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            listing.status === 'active'
                              ? 'bg-green-500'
                              : listing.listing_type === 'expired'
                                ? 'bg-orange-500'
                                : 'bg-amber-500'
                          }`}
                        />
                        {listing.address}
                      </div>
                    </TableCell>
                    <TableCell>{listing.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getBoardLabel(listing.board)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(listing.status, listing.listing_type)}>
                        {listing.status === 'active' ? 'Active' : listing.listing_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(listing.expiry_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {listing.sent_at ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {format(new Date(listing.sent_at), 'MMM d')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
                            <Link href={`/listings/${listing.id}/edit`} className="flex items-center gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {!listing.sent_at && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsSent(listing)}
                              className="flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Mark as Sent
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(listing)}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            {listing.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(listing.id)}
                            className="flex items-center gap-2 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
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
