'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  RefreshCw,
  MoreHorizontal,
  Eye,
  ChevronRight,
  MapPin,
  Flame,
  Thermometer,
  Snowflake,
  ArrowUp,
  ArrowDown,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Listing, PipelineStage } from '@/types';
import { PIPELINE_STAGES } from '@/types';
import { getScoreLabel, calculateLeadScore } from '@/lib/scoring';
import { cn } from '@/lib/utils';

type ListingWithScore = Listing & { score: number; stage: PipelineStage };

export default function PipelinePage() {
  const [listings, setListings] = useState<ListingWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'score' | 'expiry_date'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const supabase = createClient();

  const fetchListings = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user?.id)
      .order('score', { ascending: false });

    if (error) {
      toast.error('Failed to fetch listings');
      console.error(error);
    } else {
      setListings((data || []) as ListingWithScore[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const recalculateAllScores = async () => {
    setRecalculating(true);
    let updatedCount = 0;

    for (const listing of listings) {
      const newScore = calculateLeadScore({
        expiry_date: listing.expiry_date,
        price: listing.price,
        property_type: listing.property_type,
        city: listing.city,
        owner_name: listing.owner_name,
        owner_phone: listing.owner_phone,
        owner_email: listing.owner_email,
      });

      if (newScore !== listing.score) {
        const { error } = await supabase
          .from('listings')
          .update({ score: newScore })
          .eq('id', listing.id);

        if (!error) {
          updatedCount++;
        }
      }
    }

    await fetchListings();
    setRecalculating(false);
    toast.success(`Recalculated scores for ${updatedCount} listings`);
  };

  const moveToStage = async (listingId: string, newStage: PipelineStage) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing || listing.stage === newStage) return;

    // Optimistic update
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, stage: newStage } : l))
    );

    const { error } = await supabase
      .from('listings')
      .update({ stage: newStage })
      .eq('id', listingId);

    if (error) {
      toast.error('Failed to update stage');
      setListings(prev =>
        prev.map(l => (l.id === listingId ? { ...l, stage: listing.stage } : l))
      );
    } else {
      toast.success(`Moved to ${PIPELINE_STAGES.find(s => s.value === newStage)?.label}`);

      await supabase.from('activity_logs').insert({
        listing_id: listingId,
        user_id: listing.user_id,
        activity_type: 'stage_changed',
        description: `Stage changed from ${listing.stage} to ${newStage}`,
        metadata: { from: listing.stage, to: newStage },
      });
    }
  };

  const getNextStage = (currentStage: PipelineStage): PipelineStage | null => {
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.value === currentStage);
    if (currentIndex < PIPELINE_STAGES.length - 1 && currentStage !== 'lost') {
      return PIPELINE_STAGES[currentIndex + 1].value;
    }
    return null;
  };

  const getListingsForStage = (stage: PipelineStage) => {
    return listings.filter(l => l.stage === stage);
  };

  const getStageValue = (stage: PipelineStage) => {
    const stageListings = getListingsForStage(stage);
    return stageListings.reduce((sum, l) => sum + (l.price || 0), 0);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Flame className="w-4 h-4 text-red-500" />;
    if (score >= 60) return <Thermometer className="w-4 h-4 text-orange-500" />;
    if (score >= 40) return <Thermometer className="w-4 h-4 text-blue-500" />;
    return <Snowflake className="w-4 h-4 text-slate-500" />;
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort listings
  const filteredListings = listings
    .filter(l => stageFilter === 'all' || l.stage === stageFilter)
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'expiry_date') {
        comparison = new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const getStageColor = (stage: PipelineStage) => {
    return PIPELINE_STAGES.find(s => s.value === stage)?.color || 'bg-slate-500';
  };

  const getStageLabel = (stage: PipelineStage) => {
    return PIPELINE_STAGES.find(s => s.value === stage)?.label || stage;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Track leads through your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={recalculateAllScores}
            disabled={recalculating || listings.length === 0}
            className="border-border"
          >
            {recalculating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4 mr-2" />
            )}
            Recalculate Scores
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchListings}
            className="border-border"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Pipeline Stats - Clickable stage filters */}
      <div className="grid grid-cols-7 gap-2">
        {PIPELINE_STAGES.map((stage) => {
          const count = getListingsForStage(stage.value).length;
          const value = getStageValue(stage.value);
          const isActive = stageFilter === stage.value;
          return (
            <Card
              key={stage.value}
              className={cn(
                'border-border/50 glass-card cursor-pointer group',
                isActive && 'ring-2 ring-primary'
              )}
              onClick={() => setStageFilter(isActive ? 'all' : stage.value)}
            >
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                  <span className={cn('text-xs font-medium', stage.color.replace('bg-', 'text-'))}>
                    {stage.label}
                  </span>
                </div>
                <div className="text-2xl font-bold mt-1">{count}</div>
                {value > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {formatPrice(value)}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {stageFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Showing:</span>
          <Badge className={cn(getStageColor(stageFilter as PipelineStage), 'text-white')}>
            {getStageLabel(stageFilter as PipelineStage)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStageFilter('all')}
            className="text-xs h-6"
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Pipeline Table */}
      <Card className="border-border/50 glass-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">No leads found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead
                    className="text-muted-foreground cursor-pointer hover:text-foreground w-[80px]"
                    onClick={() => toggleSort('score')}
                  >
                    <div className="flex items-center gap-1">
                      Score
                      {sortField === 'score' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground">City</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead
                    className="text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort('expiry_date')}
                  >
                    <div className="flex items-center gap-1">
                      Expired
                      {sortField === 'expiry_date' && (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-muted-foreground w-[180px]">Stage</TableHead>
                  <TableHead className="text-muted-foreground text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(listing.score)}
                        <span className={cn('font-medium', getScoreLabel(listing.score).color)}>
                          {listing.score}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/listings/${listing.id}`} className="hover:text-primary transition-colors font-medium">
                        {listing.address}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{listing.city}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {listing.price ? formatPrice(listing.price) : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(listing.expiry_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={listing.stage}
                        onValueChange={(value) => moveToStage(listing.id, value as PipelineStage)}
                      >
                        <SelectTrigger className="h-8 w-[160px] bg-transparent border-border/50">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <div className={cn('w-2 h-2 rounded-full', getStageColor(listing.stage))} />
                              <span className="text-sm">{getStageLabel(listing.stage)}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {PIPELINE_STAGES.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                                {stage.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={!getNextStage(listing.stage)}
                          onClick={() => {
                            const next = getNextStage(listing.stage);
                            if (next) moveToStage(listing.id, next);
                          }}
                          title="Advance to next stage"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
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
