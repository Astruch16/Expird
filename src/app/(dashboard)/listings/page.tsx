'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  CheckSquare,
  Square,
  TrendingUp,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MailX,
  CheckCircle,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Listing, ListingStatus, Board, ListingType } from '@/types';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>(() => {
    const typeParam = searchParams.get('type');
    return typeParam === 'expired' || typeParam === 'terminated' ? typeParam : 'all';
  });
  const [boardFilter, setBoardFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'expiry_date' | 'created_at' | 'city'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [quickFilter, setQuickFilter] = useState<'all' | 'not_sent' | 'needs_followup' | 'hot'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const supabase = createClient();

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredListings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredListings.map(l => l.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkMarkAsSent = async () => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from('listings')
      .update({ sent_at: new Date().toISOString() })
      .in('id', Array.from(selectedIds));

    if (error) {
      toast.error('Failed to update listings');
    } else {
      toast.success(`${selectedIds.size} listings marked as sent`);
      setSelectedIds(new Set());
      fetchListings();
    }
  };

  const handleBulkMarkActive = async () => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from('listings')
      .update({ status: 'active' })
      .in('id', Array.from(selectedIds));

    if (error) {
      toast.error('Failed to update listings');
    } else {
      toast.success(`${selectedIds.size} listings marked as active`);
      setSelectedIds(new Set());
      fetchListings();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} listings?`)) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .in('id', Array.from(selectedIds));

    if (error) {
      toast.error('Failed to delete listings');
    } else {
      toast.success(`${selectedIds.size} listings deleted`);
      setSelectedIds(new Set());
      fetchListings();
    }
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

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
    if (startDate) {
      query = query.gte('expiry_date', startDate);
    }
    if (endDate) {
      query = query.lte('expiry_date', endDate);
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
  }, [statusFilter, typeFilter, boardFilter, startDate, endDate]);

  // Calculate days since expiry for "hot" leads (expired in last 7 days)
  const getDaysSinceExpiry = (expiryDate: string) => {
    return Math.floor((Date.now() - new Date(expiryDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  // Apply filters and sorting
  const filteredListings = listings
    .filter((listing) => {
      // Text search
      const matchesSearch =
        listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase());

      // Quick filter
      let matchesQuickFilter = true;
      if (quickFilter === 'not_sent') {
        matchesQuickFilter = !listing.sent_at;
      } else if (quickFilter === 'needs_followup') {
        matchesQuickFilter = listing.sent_at !== null && listing.status !== 'active';
      } else if (quickFilter === 'hot') {
        matchesQuickFilter = getDaysSinceExpiry(listing.expiry_date) <= 7 && !listing.sent_at;
      }

      return matchesSearch && matchesQuickFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'expiry_date') {
        comparison = new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      } else if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'city') {
        comparison = a.city.localeCompare(b.city);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Count for quick filter badges
  const notSentCount = listings.filter(l => !l.sent_at).length;
  const needsFollowupCount = listings.filter(l => l.sent_at && l.status !== 'active').length;
  const hotCount = listings.filter(l => getDaysSinceExpiry(l.expiry_date) <= 7 && !l.sent_at).length;

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
    if (type === 'expired') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
  };

  const getBoardLabel = (board: Board) => {
    switch (board) {
      case 'greater_vancouver': return 'Greater Vancouver';
      case 'fraser_valley': return 'Fraser Valley';
      case 'chilliwack': return 'Chilliwack';
      default: return board;
    }
  };

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
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

      {/* Quick Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={quickFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('all')}
          className={quickFilter === 'all' ? 'bg-primary' : 'border-border'}
        >
          All Listings
          <Badge variant="secondary" className="ml-2 bg-secondary/50">
            {listings.length}
          </Badge>
        </Button>
        <Button
          variant={quickFilter === 'hot' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('hot')}
          className={quickFilter === 'hot' ? 'bg-rose-500 hover:bg-rose-600' : 'border-rose-500/50 text-rose-500 hover:bg-rose-500/10'}
        >
          <Clock className="w-3 h-3 mr-1" />
          Hot Leads
          <Badge variant="secondary" className="ml-2 bg-rose-500/20 text-rose-500">
            {hotCount}
          </Badge>
        </Button>
        <Button
          variant={quickFilter === 'not_sent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('not_sent')}
          className={quickFilter === 'not_sent' ? 'bg-primary' : 'border-border'}
        >
          <MailX className="w-3 h-3 mr-1" />
          Not Sent
          <Badge variant="secondary" className="ml-2 bg-secondary/50">
            {notSentCount}
          </Badge>
        </Button>
        <Button
          variant={quickFilter === 'needs_followup' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('needs_followup')}
          className={quickFilter === 'needs_followup' ? 'bg-accent' : 'border-accent/50 text-accent hover:bg-accent/10'}
        >
          <Clock className="w-3 h-3 mr-1" />
          Needs Follow-up
          <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent">
            {needsFollowupCount}
          </Badge>
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                <span className="font-medium">{selectedIds.size} selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkMarkAsSent} className="border-border">
                  <Send className="w-3 h-3 mr-1" />
                  Mark Sent
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkMarkActive} className="border-green-500/50 text-green-500 hover:bg-green-500/10">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Mark Active
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDelete} className="border-destructive/50 text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClear={clearDateFilters}
              />

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
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead
                    className="text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort('city')}
                  >
                    <div className="flex items-center gap-1">
                      City
                      {sortField === 'city' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Board</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead
                    className="text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort('expiry_date')}
                  >
                    <div className="flex items-center gap-1">
                      Expiry Date
                      {sortField === 'expiry_date' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Sent</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow
                    key={listing.id}
                    className={`border-border/50 ${selectedIds.has(listing.id) ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(listing.id)}
                        onCheckedChange={() => handleSelectOne(listing.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/listings/${listing.id}`} className="hover:text-primary transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              listing.status === 'active'
                                ? 'bg-green-500'
                                : listing.listing_type === 'expired'
                                  ? 'bg-rose-500'
                                  : 'bg-violet-500'
                            }`}
                          />
                          {listing.address}
                          {getDaysSinceExpiry(listing.expiry_date) <= 7 && !listing.sent_at && (
                            <Badge className="bg-rose-500/20 text-rose-500 text-[10px] px-1 py-0">
                              HOT
                            </Badge>
                          )}
                        </div>
                      </Link>
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
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick inline actions */}
                        {!listing.sent_at && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => handleMarkAsSent(listing)}
                            title="Mark as Sent"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {listing.status !== 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-green-500"
                            onClick={() => handleStatusToggle(listing)}
                            title="Mark as Active"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
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
                      </div>
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
