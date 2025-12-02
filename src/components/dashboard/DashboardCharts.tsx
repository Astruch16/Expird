'use client';

import { DashboardMapPreview } from './DashboardMapPreview';
import { WeeklyExpiredChart } from './WeeklyExpiredChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Listing } from '@/types';

interface DashboardChartsProps {
  listings: Listing[];
}

export function DashboardCharts({ listings }: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      {/* Top Row: Quick Actions (left) & Map Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50 glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/listings/new"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
            >
              <span className="text-sm font-medium">Add New Listing</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/map"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
            >
              <span className="text-sm font-medium">View Map</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/sent"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
            >
              <span className="text-sm font-medium">View Sent Listings</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              href="/follow-ups"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer"
            >
              <span className="text-sm font-medium">Manage Follow-ups</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
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
