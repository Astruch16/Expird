import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldX,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { differenceInDays, addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import type { Listing } from '@/types';

export default async function CancelProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user?.id)
    .eq('listing_type', 'cancel_protected')
    .order('cancel_protected_date', { ascending: true });

  // Process listings with countdown info
  const processedListings = (listings || []).map((listing: Listing) => {
    const cancelDate = listing.cancel_protected_date
      ? new Date(listing.cancel_protected_date)
      : new Date();
    const releaseDate = addDays(cancelDate, 60);
    const today = new Date();
    const daysRemaining = differenceInDays(releaseDate, today);
    const totalDays = 60;
    const daysElapsed = totalDays - Math.max(0, daysRemaining);
    const progress = Math.min(100, (daysElapsed / totalDays) * 100);
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
    const isReady = daysRemaining <= 0;

    return {
      ...listing,
      cancelDate,
      releaseDate,
      daysRemaining: Math.max(0, daysRemaining),
      progress,
      isExpiringSoon,
      isReady,
    };
  });

  const readyListings = processedListings.filter((l) => l.isReady);
  const expiringSoonListings = processedListings.filter((l) => l.isExpiringSoon);
  const waitingListings = processedListings.filter((l) => !l.isReady && !l.isExpiringSoon);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Cancel Protected
          </h1>
          <p className="text-muted-foreground mt-1">
            Track listings in the 60-day protection period
          </p>
        </div>
        <Link href="/app/listings/new?type=cancel_protected">
          <Button className="btn-glow">
            <span className="relative z-10 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Cancel Protected
            </span>
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-500/20 glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-3xl font-bold">{readyListings.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Ready to Contact</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-3xl font-bold">{expiringSoonListings.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Expiring in 7 Days</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-3xl font-bold">{waitingListings.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Still Waiting</p>
          </CardContent>
        </Card>
      </div>

      {/* Ready to Contact Section */}
      {readyListings.length > 0 && (
        <Card className="border-green-500/20 glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Ready to Contact
              <Badge className="bg-green-500/10 text-green-500 ml-2">
                {readyListings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readyListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} variant="ready" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon Section */}
      {expiringSoonListings.length > 0 && (
        <Card className="border-amber-500/20 glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Expiring Soon
              <Badge className="bg-amber-500/10 text-amber-500 ml-2">
                {expiringSoonListings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoonListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} variant="expiring" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Section */}
      {waitingListings.length > 0 && (
        <Card className="border-border/50 glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Waiting Period
              <Badge className="bg-orange-500/10 text-orange-500 ml-2">
                {waitingListings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} variant="waiting" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {processedListings.length === 0 && (
        <Card className="border-border/50 glass-card">
          <CardContent className="py-16">
            <div className="text-center">
              <ShieldX className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <h3 className="text-lg font-medium mt-4">No Cancel Protected Listings</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Add listings that have been cancelled with protection. You&apos;ll be able to track the
                60-day countdown until you can contact the homeowner.
              </p>
              <Link href="/app/listings/new?type=cancel_protected" className="mt-6 inline-block">
                <Button className="btn-glow">
                  <span className="relative z-10 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ProcessedListing extends Listing {
  cancelDate: Date;
  releaseDate: Date;
  daysRemaining: number;
  progress: number;
  isExpiringSoon: boolean;
  isReady: boolean;
}

function ListingRow({
  listing,
  variant,
}: {
  listing: ProcessedListing;
  variant: 'ready' | 'expiring' | 'waiting';
}) {
  const colorClasses = {
    ready: {
      badge: 'bg-green-500/10 text-green-500',
      progress: 'bg-green-500',
      icon: 'text-green-500 bg-green-500/10',
    },
    expiring: {
      badge: 'bg-amber-500/10 text-amber-500',
      progress: 'bg-amber-500',
      icon: 'text-amber-500 bg-amber-500/10',
    },
    waiting: {
      badge: 'bg-orange-500/10 text-orange-500',
      progress: 'bg-orange-500',
      icon: 'text-orange-500 bg-orange-500/10',
    },
  };

  const colors = colorClasses[variant];

  return (
    <Link
      href={`/app/listings/${listing.id}`}
      className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg shrink-0 ${colors.icon}`}>
            {variant === 'ready' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{listing.address}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.city}
              </span>
              {listing.mls_number && (
                <span className="text-xs">MLS# {listing.mls_number}</span>
              )}
            </div>

            {/* Progress bar for waiting/expiring */}
            {variant !== 'ready' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    Protected: {format(listing.cancelDate, 'MMM d, yyyy')}
                  </span>
                  <span className="text-muted-foreground">
                    Available: {format(listing.releaseDate, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full ${colors.progress} transition-all`}
                    style={{ width: `${listing.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {variant === 'ready' ? (
            <Badge className={colors.badge}>Ready!</Badge>
          ) : (
            <Badge className={colors.badge}>
              {listing.daysRemaining}d left
            </Badge>
          )}
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
