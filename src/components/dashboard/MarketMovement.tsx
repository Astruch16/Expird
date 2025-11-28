'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, FileX, FileCheck, Activity } from 'lucide-react';
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
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

export function MarketMovement({ listings }: MarketMovementProps) {
  // Calculate daily data for the past 7 days
  const now = new Date();
  const days: DayData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const expired = listings.filter((listing) => {
      if (listing.listing_type !== 'expired') return false;
      const expiryDate = parseISO(listing.expiry_date);
      return isWithinInterval(expiryDate, { start: dayStart, end: dayEnd });
    }).length;

    const terminated = listings.filter((listing) => {
      if (listing.listing_type !== 'terminated') return false;
      const expiryDate = parseISO(listing.expiry_date);
      return isWithinInterval(expiryDate, { start: dayStart, end: dayEnd });
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Market Movement
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Daily expired & terminated listings (by expiry date)
        </p>
      </CardHeader>
      <CardContent>
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileX className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Expired</span>
              </div>
              <div className="flex items-center gap-1">
                {expiredChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-orange-500" />
                ) : expiredChange < 0 ? (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${
                    expiredChange > 0
                      ? 'text-orange-500'
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
            <p className="text-2xl font-bold text-orange-500 mt-1">
              {today.expired}
            </p>
            <p className="text-[10px] text-muted-foreground">today</p>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Terminated</span>
              </div>
              <div className="flex items-center gap-1">
                {terminatedChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-amber-500" />
                ) : terminatedChange < 0 ? (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${
                    terminatedChange > 0
                      ? 'text-amber-500'
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
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {today.terminated}
            </p>
            <p className="text-[10px] text-muted-foreground">today</p>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">7-Day Trend</p>
          <div className="flex items-end gap-1 h-[80px]">
            {days.map((day, index) => {
              const total = day.expired + day.terminated;
              const height = maxCount > 0 ? (total / maxCount) * 100 : 0;
              const expiredHeight = total > 0 ? (day.expired / total) * 100 : 0;
              const isToday = index === days.length - 1;

              return (
                <div
                  key={day.label}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-sm overflow-hidden relative"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    {/* Expired portion */}
                    <div
                      className={`absolute bottom-0 w-full ${
                        isToday ? 'bg-orange-500' : 'bg-orange-500/70'
                      }`}
                      style={{ height: `${expiredHeight}%` }}
                    />
                    {/* Terminated portion */}
                    <div
                      className={`absolute top-0 w-full ${
                        isToday ? 'bg-amber-500' : 'bg-amber-500/70'
                      }`}
                      style={{ height: `${100 - expiredHeight}%` }}
                    />
                  </div>
                  <span
                    className={`text-[9px] ${
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
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            <span className="text-muted-foreground">Expired</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className="text-muted-foreground">Terminated</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
