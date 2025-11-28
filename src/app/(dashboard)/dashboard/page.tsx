import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileX,
  FileCheck,
  Send,
  Clock,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch stats
  const [
    { count: expiredCount },
    { count: terminatedCount },
    { count: sentCount },
    { count: activeCount },
    { count: pendingFollowUps },
    { data: recentListings },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'expired'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'terminated'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).not('sent_at', 'is', null),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('status', 'active'),
    supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('sent', false),
    supabase.from('listings').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      title: 'Expired Listings',
      value: expiredCount || 0,
      icon: FileX,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: 'Terminated Listings',
      value: terminatedCount || 0,
      icon: FileCheck,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'Sent Out',
      value: sentCount || 0,
      icon: Send,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      title: 'Back to Active',
      value: activeCount || 0,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Pending Follow-ups',
      value: pendingFollowUps || 0,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your expired and terminated MLS listings
          </p>
        </div>
        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:opacity-90 transition-opacity"
        >
          <MapPin className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`border ${stat.borderColor} bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/listings/new"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <span className="text-sm font-medium">Add New Listing</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/map"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <span className="text-sm font-medium">View Map</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/sent"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <span className="text-sm font-medium">View Sent Listings</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/follow-ups"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <span className="text-sm font-medium">Manage Follow-ups</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Recent Listings
            </CardTitle>
            <Link href="/listings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentListings && recentListings.length > 0 ? (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        listing.status === 'active'
                          ? 'bg-green-500'
                          : listing.listing_type === 'expired'
                            ? 'bg-orange-500'
                            : 'bg-amber-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{listing.address}</p>
                        <p className="text-xs text-muted-foreground">{listing.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          listing.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : listing.listing_type === 'expired'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {listing.status === 'active' ? 'Active' : listing.listing_type}
                      </Badge>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No listings yet</p>
                <Link
                  href="/listings/new"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  Add your first listing
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
