'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldX, ArrowUpRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays, addDays, format } from 'date-fns';
import type { Listing } from '@/types';

interface CancelProtectedCountdownProps {
  listings: Listing[];
}

export function CancelProtectedCountdown({ listings }: CancelProtectedCountdownProps) {
  const cancelProtectedListings = listings
    .filter((l) => l.listing_type === 'cancel_protected' && l.cancel_protected_date)
    .map((listing) => {
      const cancelDate = new Date(listing.cancel_protected_date!);
      const releaseDate = addDays(cancelDate, 60);
      const today = new Date();
      const daysRemaining = differenceInDays(releaseDate, today);
      const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
      const isReady = daysRemaining <= 0;

      return {
        ...listing,
        cancelDate,
        releaseDate,
        daysRemaining: Math.max(0, daysRemaining),
        isExpiringSoon,
        isReady,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const readyCount = cancelProtectedListings.filter((l) => l.isReady).length;
  const expiringSoonCount = cancelProtectedListings.filter((l) => l.isExpiringSoon).length;

  return (
    <Card className="border-border/50 glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldX className="w-5 h-5 text-orange-500" />
          Cancel Protected
        </CardTitle>
        <Link href="/app/cancel-protected" className="text-sm text-primary hover:underline cursor-pointer">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {cancelProtectedListings.length > 0 ? (
          <div className="space-y-3">
            {/* Summary badges */}
            {(readyCount > 0 || expiringSoonCount > 0) && (
              <div className="flex gap-2 mb-4">
                {readyCount > 0 && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {readyCount} Ready to Contact
                  </Badge>
                )}
                {expiringSoonCount > 0 && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {expiringSoonCount} Expiring Soon
                  </Badge>
                )}
              </div>
            )}

            {/* Listing items */}
            {cancelProtectedListings.slice(0, 5).map((listing) => (
              <Link
                key={listing.id}
                href={`/app/listings/${listing.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      listing.isReady
                        ? 'bg-green-500/10'
                        : listing.isExpiringSoon
                          ? 'bg-amber-500/10'
                          : 'bg-orange-500/10'
                    }`}
                  >
                    {listing.isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock
                        className={`w-4 h-4 ${listing.isExpiringSoon ? 'text-amber-500' : 'text-orange-500'}`}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{listing.address}</p>
                    <p className="text-xs text-muted-foreground truncate">{listing.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {listing.isReady ? (
                    <Badge className="bg-green-500/10 text-green-500 text-xs">Ready!</Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        listing.isExpiringSoon
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-orange-500/10 text-orange-500'
                      }`}
                    >
                      {listing.daysRemaining}d left
                    </Badge>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}

            {cancelProtectedListings.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{cancelProtectedListings.length - 5} more cancel protected listings
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <ShieldX className="w-10 h-10 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground mt-2 text-sm">No cancel protected listings</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add listings that are in the 60-day protection period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
