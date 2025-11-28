'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  MapPin,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

interface Listing {
  id: string;
  listing_type: 'expired' | 'terminated';
  status: 'expired' | 'terminated' | 'active';
  board: string;
  city: string;
  created_at: string;
  sent_at: string | null;
}

export default function StatsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const supabase = createClient();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const startDate = subDays(new Date(), parseInt(timeRange));

      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString());

      setListings(data || []);
      setLoading(false);
    };

    fetchListings();
  }, [timeRange]);

  // Calculate stats
  const totalListings = listings.length;
  const expiredListings = listings.filter(l => l.listing_type === 'expired').length;
  const terminatedListings = listings.filter(l => l.listing_type === 'terminated').length;
  const sentListings = listings.filter(l => l.sent_at).length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const conversionRate = totalListings > 0 ? ((activeListings / totalListings) * 100).toFixed(1) : '0';
  const sendRate = totalListings > 0 ? ((sentListings / totalListings) * 100).toFixed(1) : '0';

  // Group by board
  const byBoard = listings.reduce((acc, l) => {
    acc[l.board] = (acc[l.board] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by city (top 5)
  const byCity = listings.reduce((acc, l) => {
    acc[l.city] = (acc[l.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCities = Object.entries(byCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Daily trend for chart visualization
  const days = parseInt(timeRange);
  const dailyData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = listings.filter(l =>
      format(new Date(l.created_at), 'yyyy-MM-dd') === dateStr
    ).length;
    return { date: format(date, 'MMM d'), count };
  });

  const maxDaily = Math.max(...dailyData.map(d => d.count), 1);

  const boardColors: Record<string, string> = {
    greater_vancouver: 'bg-primary',
    fraser_valley: 'bg-accent',
    chilliwack: 'bg-amber-500',
  };

  const formatBoardName = (board: string) => {
    return board.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your performance and listing trends
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-input border-border">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-3xl font-bold mt-1">{totalListings}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-muted-foreground">in last {timeRange} days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Send Rate</p>
                <p className="text-3xl font-bold mt-1">{sendRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-muted-foreground">{sentListings} of {totalListings} sent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-muted-foreground">{activeListings} back to active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. per Day</p>
                <p className="text-3xl font-bold mt-1">
                  {(totalListings / parseInt(timeRange)).toFixed(1)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-muted-foreground">listings added</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Listing Activity
            </CardTitle>
            <CardDescription>New listings added over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-1">
              {dailyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${(day.count / maxDaily) * 100}%`,
                      minHeight: day.count > 0 ? '4px' : '0px'
                    }}
                  />
                  {dailyData.length <= 14 && (
                    <span className="text-[10px] text-muted-foreground rotate-[-45deg] origin-top-left whitespace-nowrap">
                      {day.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {dailyData.length > 14 && (
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{dailyData[0]?.date}</span>
                <span>{dailyData[dailyData.length - 1]?.date}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Type Breakdown */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent" />
              Listing Types
            </CardTitle>
            <CardDescription>Breakdown by listing type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Expired */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Expired</span>
                  <span className="text-sm text-muted-foreground">{expiredListings} ({totalListings > 0 ? ((expiredListings / totalListings) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${totalListings > 0 ? (expiredListings / totalListings) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Terminated */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Terminated</span>
                  <span className="text-sm text-muted-foreground">{terminatedListings} ({totalListings > 0 ? ((terminatedListings / totalListings) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${totalListings > 0 ? (terminatedListings / totalListings) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Sent */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sent Out</span>
                  <span className="text-sm text-muted-foreground">{sentListings} ({totalListings > 0 ? ((sentListings / totalListings) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${totalListings > 0 ? (sentListings / totalListings) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Active */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Back to Active</span>
                  <span className="text-sm text-muted-foreground">{activeListings} ({totalListings > 0 ? ((activeListings / totalListings) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${totalListings > 0 ? (activeListings / totalListings) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Board */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              By Board
            </CardTitle>
            <CardDescription>Distribution across real estate boards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(byBoard).length > 0 ? (
                Object.entries(byBoard)
                  .sort((a, b) => b[1] - a[1])
                  .map(([board, count]) => (
                    <div key={board}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{formatBoardName(board)}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${boardColors[board] || 'bg-primary'} rounded-full transition-all`}
                          style={{ width: `${(count / totalListings) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Top Cities
            </CardTitle>
            <CardDescription>Most active cities for listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.length > 0 ? (
                topCities.map(([city, count], index) => (
                  <div key={city} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{city}</span>
                        <span className="text-sm text-muted-foreground">{count} listings</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                          style={{ width: `${(count / topCities[0][1]) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
