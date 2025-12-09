import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import {
  FileX,
  FileCheck,
  Send,
  Clock,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Activity,
  Bell,
  CalendarClock,
} from 'lucide-react';
import { MarketMovement } from '@/components/dashboard/MarketMovement';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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
    { data: upcomingFollowUps },
    { data: recentActivity },
    { data: allListings },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'expired'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'terminated'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).not('sent_at', 'is', null),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('status', 'active'),
    supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('sent', false),
    supabase.from('listings').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('follow_ups').select('*, listings(address, city)').eq('user_id', user?.id).eq('sent', false).order('follow_up_date', { ascending: true }).limit(5),
    supabase.from('listings').select('*').eq('user_id', user?.id).order('updated_at', { ascending: false }).limit(8),
    supabase.from('listings').select('*').eq('user_id', user?.id),
  ]);

  const stats = [
    {
      title: 'Expired Listings',
      value: expiredCount || 0,
      icon: FileX,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      href: '/app/listings?type=expired',
    },
    {
      title: 'Terminated Listings',
      value: terminatedCount || 0,
      icon: FileCheck,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      href: '/app/listings?type=terminated',
    },
    {
      title: 'Sent Out',
      value: sentCount || 0,
      icon: Send,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      href: '/app/sent',
    },
    {
      title: 'Back to Active',
      value: activeCount || 0,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      href: null,
    },
    {
      title: 'Pending Follow-ups',
      value: pendingFollowUps || 0,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      href: '/app/follow-ups',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your expired and terminated MLS listings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const cardContent = (
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {stat.href && (
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
            </CardContent>
          );

          if (stat.href) {
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className={`border ${stat.borderColor} glass-card cursor-pointer group h-full`}>
                  {cardContent}
                </Card>
              </Link>
            );
          }

          return (
            <Card key={stat.title} className={`border ${stat.borderColor} glass-card`}>
              {cardContent}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Map Preview */}
      <DashboardCharts listings={allListings || []} />

      {/* Recent Listings & Market Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Recent Listings
            </CardTitle>
            <Link href="/app/listings" className="text-sm text-primary hover:underline cursor-pointer">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentListings && recentListings.length > 0 ? (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/app/listings/${listing.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        listing.status === 'active'
                          ? 'bg-green-500'
                          : listing.listing_type === 'expired'
                            ? 'bg-rose-500'
                            : 'bg-violet-500'
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
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-violet-500/10 text-violet-500'
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
                  href="/app/listings/new"
                  className="text-sm text-primary hover:underline mt-1 inline-block cursor-pointer"
                >
                  Add your first listing
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Movement */}
        <MarketMovement listings={allListings || []} />
      </div>

      {/* Upcoming Follow-ups & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Follow-ups */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-accent" />
              Upcoming Follow-ups
            </CardTitle>
            <Link href="/app/follow-ups" className="text-sm text-primary hover:underline cursor-pointer">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingFollowUps && upcomingFollowUps.length > 0 ? (
              <div className="space-y-3">
                {upcomingFollowUps.map((followUp: any) => {
                  const isOverdue = new Date(followUp.follow_up_date) < new Date();
                  const isToday = new Date(followUp.follow_up_date).toDateString() === new Date().toDateString();
                  return (
                    <Link
                      key={followUp.id}
                      href={`/listings/${followUp.listing_id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isOverdue
                            ? 'bg-red-500/10'
                            : isToday
                              ? 'bg-amber-500/10'
                              : 'bg-accent/10'
                        }`}>
                          <Bell className={`w-4 h-4 ${
                            isOverdue
                              ? 'text-red-500'
                              : isToday
                                ? 'text-amber-500'
                                : 'text-accent'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{followUp.listings?.address || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{followUp.listings?.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            isOverdue
                              ? 'bg-red-500/10 text-red-500'
                              : isToday
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {isOverdue
                            ? 'Overdue'
                            : isToday
                              ? 'Today'
                              : formatDistanceToNow(new Date(followUp.follow_up_date), { addSuffix: true })}
                        </Badge>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarClock className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No upcoming follow-ups</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Schedule follow-ups from your listings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((listing: any) => {
                  const getActivityIcon = () => {
                    if (listing.status === 'active') return TrendingUp;
                    if (listing.sent_at) return Send;
                    if (listing.listing_type === 'expired') return FileX;
                    return FileCheck;
                  };
                  const getActivityColor = () => {
                    if (listing.status === 'active') return 'text-green-500 bg-green-500/10';
                    if (listing.sent_at) return 'text-primary bg-primary/10';
                    if (listing.listing_type === 'expired') return 'text-rose-500 bg-rose-500/10';
                    return 'text-violet-500 bg-violet-500/10';
                  };
                  const getActivityText = () => {
                    if (listing.status === 'active') return 'Back to active';
                    if (listing.sent_at) return 'Sent out';
                    if (listing.listing_type === 'expired') return 'Expired';
                    return 'Terminated';
                  };
                  const ActivityIcon = getActivityIcon();
                  const colorClass = getActivityColor();

                  return (
                    <Link
                      key={listing.id}
                      href={`/app/listings/${listing.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg ${colorClass.split(' ')[1]}`}>
                        <ActivityIcon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{listing.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {getActivityText()} · {formatDistanceToNow(new Date(listing.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No recent activity</p>
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
      </div>
    </div>
  );
}
