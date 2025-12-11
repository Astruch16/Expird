'use client';

import { DashboardMapPreview } from './DashboardMapPreview';
import { WeeklyExpiredChart } from './WeeklyExpiredChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Listing } from '@/types';

interface DashboardChartsProps {
  listings: Listing[];
  recentListings?: Listing[];
}

export function DashboardCharts({ listings, recentListings }: DashboardChartsProps) {
  // If no recentListings passed, use most recent 5 from all listings
  const displayListings = recentListings || listings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Row: Recent Listings (left) & Map Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Recent Listings
            </CardTitle>
            <Link href="/app/listings" className="text-sm text-primary hover:underline cursor-pointer">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayListings && displayListings.length > 0 ? (
              displayListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/app/listings/${listing.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      listing.status === 'active'
                        ? 'bg-green-500'
                        : listing.listing_type === 'expired'
                          ? 'bg-rose-500'
                          : 'bg-violet-500'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{listing.address}</p>
                      <p className="text-xs text-muted-foreground truncate">{listing.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        listing.status === 'active'
                          ? 'bg-green-500/10 text-green-500'
                          : listing.listing_type === 'expired'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-violet-500/10 text-violet-500'
                      }`}
                    >
                      {listing.status === 'active' ? 'Active' : listing.listing_type === 'expired' ? 'Expired' : 'Term.'}
                    </Badge>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-6">
                <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2 text-sm">No listings yet</p>
                <Link
                  href="/app/listings/new"
                  className="text-sm text-primary hover:underline mt-1 inline-block cursor-pointer"
                >
                  Add your first listing
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Preview */}
        <div className="lg:col-span-2">
          <DashboardMapPreview listings={listings} />
        </div>
      </div>

      {/* Second Row: Weekly Line Chart (full width) */}
      <WeeklyExpiredChart listings={listings} />
    </div>
  );
}
