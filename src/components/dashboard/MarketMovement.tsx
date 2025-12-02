'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, FileX, FileCheck, Activity } from 'lucide-react';
import {
  format,
  subDays,
  parseISO,
} from 'date-fns';
import type { Listing } from '@/types';

interface MarketMovementProps {
  listings: Listing[];
}

interface DayData {
  date: Date;
  label: string;
  expired: number;
  terminated: number;
}

// Helper to get just the date string (YYYY-MM-DD) in local timezone
function getLocalDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Helper to get date string from ISO timestamp in local timezone
function getListingDateString(isoString: string): string {
  // Parse and format in local timezone so listings appear on the day
  // the user actually added them (not UTC day)
  const date = parseISO(isoString);
  return format(date, 'yyyy-MM-dd');
}

export function MarketMovement({ listings }: MarketMovementProps) {
  // Calculate daily data for the past 7 days based on when listings were added
  const now = new Date();
  const days: DayData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const dateString = getLocalDateString(date);

    const expired = listings.filter((listing) => {
      if (listing.listing_type !== 'expired') return false;
      const listingDateString = getListingDateString(listing.created_at);
      return listingDateString === dateString;
    }).length;

    const terminated = listings.filter((listing) => {
      if (listing.listing_type !== 'terminated') return false;
      const listingDateString = getListingDateString(listing.created_at);
      return listingDateString === dateString;
    }).length;

    days.push({
      date,
      label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : format(date, 'EEE'),
      expired,
      terminated,
    });
  }

  // Calculate today vs yesterday change
  const today = days[days.length - 1];
  const yesterday = days[days.length - 2];

  const expiredChange = today.expired - yesterday.expired;
  const terminatedChange = today.terminated - yesterday.terminated;

  const maxCount = Math.max(
    ...days.map((d) => Math.max(d.expired, d.terminated)),
    1
  );

  return (
    <Card className="border-border/50 glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Market Movement
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Listings added in the past 7 days
        </p>
      </CardHeader>
      <CardContent>
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileX className="w-4 h-4 text-rose-500" />
                <span className="text-xs text-muted-foreground">Expired</span>
              </div>
              <div className="flex items-center gap-1">
                {expiredChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-rose-500" />
                ) : expiredChange < 0 ? (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${
                    expiredChange > 0
                      ? 'text-rose-500'
                      : expiredChange < 0
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                  }`}
                >
                  {expiredChange > 0 ? '+' : ''}
                  {expiredChange}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-500 mt-1">
              {today.expired}
            </p>
            <p className="text-[10px] text-muted-foreground">today</p>
          </div>

          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-violet-500" />
                <span className="text-xs text-muted-foreground">Terminated</span>
              </div>
              <div className="flex items-center gap-1">
                {terminatedChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-violet-500" />
                ) : terminatedChange < 0 ? (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${
                    terminatedChange > 0
                      ? 'text-violet-500'
                      : terminatedChange < 0
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                  }`}
                >
                  {terminatedChange > 0 ? '+' : ''}
                  {terminatedChange}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-violet-500 mt-1">
              {today.terminated}
            </p>
            <p className="text-[10px] text-muted-foreground">today</p>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">7-Day Trend</p>
          <div className="flex items-end gap-1" style={{ height: '64px' }}>
            {days.map((day, index) => {
              const total = day.expired + day.terminated;
              // Calculate height in pixels (max 64px)
              const barHeight = maxCount > 0 ? Math.max((total / maxCount) * 64, total > 0 ? 8 : 2) : 2;
              const expiredRatio = total > 0 ? day.expired / total : 0;
              const isToday = index === days.length - 1;

              return (
                <div
                  key={day.label}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  {/* Tooltip */}
                  {total > 0 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {total} {total === 1 ? 'listing' : 'listings'}
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-sm overflow-hidden flex flex-col cursor-pointer transition-opacity ${total > 0 ? 'hover:opacity-80' : ''}`}
                    style={{ height: `${barHeight}px` }}
                  >
                    {/* Terminated portion (top) */}
                    {day.terminated > 0 && (
                      <div
                        className={`w-full ${
                          isToday ? 'bg-violet-500' : 'bg-violet-500/70'
                        }`}
                        style={{ height: `${(1 - expiredRatio) * 100}%` }}
                      />
                    )}
                    {/* Expired portion (bottom) */}
                    {day.expired > 0 && (
                      <div
                        className={`w-full ${
                          isToday ? 'bg-rose-500' : 'bg-rose-500/70'
                        }`}
                        style={{ height: `${expiredRatio * 100}%` }}
                      />
                    )}
                    {/* Empty placeholder for days with no data */}
                    {total === 0 && (
                      <div className="w-full h-full bg-muted/30 rounded-t-sm" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] mt-1 ${
                      isToday
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-muted-foreground">Expired</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
            <span className="text-muted-foreground">Terminated</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
