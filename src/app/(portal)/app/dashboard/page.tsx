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
  ArrowUpRight,
  Bell,
  CalendarClock,
  ShieldX,
} from 'lucide-react';
import { MarketMovement } from '@/components/dashboard/MarketMovement';
import { CancelProtectedCountdown } from '@/components/dashboard/CancelProtectedCountdown';
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
    { count: cancelProtectedCount },
    { data: recentListings },
    { data: upcomingFollowUps },
    { data: allListings },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'expired'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'terminated'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).not('sent_at', 'is', null),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('status', 'active'),
    supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('sent', false),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('listing_type', 'cancel_protected'),
    supabase.from('listings').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('follow_ups').select('*, listings(address, city)').eq('user_id', user?.id).eq('sent', false).order('follow_up_date', { ascending: true }).limit(5),
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
    {
      title: 'Cancel Protected',
      value: cancelProtectedCount || 0,
      icon: ShieldX,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      href: '/app/cancel-protected',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

      {/* Recent Listings & Map Preview */}
      <DashboardCharts listings={allListings || []} recentListings={recentListings || []} />

      {/* Market Movement & Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketMovement listings={allListings || []} />

        {/* Pipeline Summary */}
        <Card className="border-border/50 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pipeline Summary
            </CardTitle>
            <Link href="/app/pipeline" className="text-sm text-primary hover:underline cursor-pointer">
              View pipeline
            </Link>
          </CardHeader>
          <CardContent>
            {(() => {
              const pipelineData = [
                { stage: 'New', count: allListings?.filter(l => l.stage === 'new').length || 0, color: 'bg-slate-500' },
                { stage: 'Contacted', count: allListings?.filter(l => l.stage === 'contacted').length || 0, color: 'bg-blue-500' },
                { stage: 'Responded', count: allListings?.filter(l => l.stage === 'responded').length || 0, color: 'bg-cyan-500' },
                { stage: 'Meeting', count: allListings?.filter(l => l.stage === 'meeting').length || 0, color: 'bg-amber-500' },
                { stage: 'Listed', count: allListings?.filter(l => l.stage === 'listed').length || 0, color: 'bg-green-500' },
                { stage: 'Closed', count: allListings?.filter(l => l.stage === 'closed').length || 0, color: 'bg-emerald-600' },
              ];
              const total = pipelineData.reduce((sum, p) => sum + p.count, 0);

              return (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
                    {pipelineData.map((item, i) => (
                      item.count > 0 && (
                        <div
                          key={item.stage}
                          className={`${item.color} h-full transition-all`}
                          style={{ width: `${(item.count / Math.max(total, 1)) * 100}%` }}
                        />
                      )
                    ))}
                  </div>

                  {/* Stage breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    {pipelineData.map((item) => (
                      <div key={item.stage} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-sm text-muted-foreground">{item.stage}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Conversion hint */}
                  {total > 0 && pipelineData[4].count > 0 && (
                    <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                      {Math.round((pipelineData[4].count / total) * 100)}% conversion to listed
                    </p>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Follow-ups & Cancel Protected */}
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

        {/* Cancel Protected Countdown */}
        <CancelProtectedCountdown listings={allListings || []} />
      </div>
    </div>
  );
}
