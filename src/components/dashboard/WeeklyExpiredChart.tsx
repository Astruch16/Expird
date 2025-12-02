'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  subWeeks,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import type { Listing } from '@/types';

interface WeeklyExpiredChartProps {
  listings: Listing[];
}

interface WeekData {
  weekStart: Date;
  weekEnd: Date;
  label: string;
  count: number;
}

export function WeeklyExpiredChart({ listings }: WeeklyExpiredChartProps) {
  // Calculate weekly data for the past 8 weeks
  const now = new Date();
  const weeks: WeekData[] = [];

  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

    const count = listings.filter((listing) => {
      const expiryDate = parseISO(listing.expiry_date);
      return isWithinInterval(expiryDate, { start: weekStart, end: weekEnd });
    }).length;

    weeks.push({
      weekStart,
      weekEnd,
      label: format(weekStart, 'MMM d'),
      count,
    });
  }

  const maxCount = Math.max(...weeks.map((w) => w.count), 1);
  const minCount = Math.min(...weeks.map((w) => w.count));

  // Calculate week-over-week change
  const currentWeekCount = weeks[weeks.length - 1].count;
  const lastWeekCount = weeks[weeks.length - 2].count;
  const change = currentWeekCount - lastWeekCount;
  const percentChange =
    lastWeekCount > 0
      ? Math.round((change / lastWeekCount) * 100)
      : currentWeekCount > 0
        ? 100
        : 0;

  // Calculate Y position for each point (inverted because SVG y=0 is top)
  const chartHeight = 140;
  const chartWidth = 100; // percentage
  const paddingTop = 15;
  const paddingBottom = 20; // More padding at bottom to prevent cutoff

  const getYPosition = (count: number) => {
    if (maxCount === minCount) return chartHeight / 2;
    return paddingTop + ((maxCount - count) / (maxCount - minCount)) * (chartHeight - paddingTop - paddingBottom);
  };

  // Generate SVG path for the line
  const points = weeks.map((week, index) => {
    const x = (index / (weeks.length - 1)) * 100;
    const y = getYPosition(week.count);
    return { x, y, count: week.count };
  });

  // Generate smooth bezier curve path
  const generateSmoothPath = () => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate control points for smooth curve
      const tension = 0.3;
      const prev = points[i - 1] || current;
      const afterNext = points[i + 2] || next;

      const cp1x = current.x + (next.x - prev.x) * tension;
      const cp1y = current.y + (next.y - prev.y) * tension;
      const cp2x = next.x - (afterNext.x - current.x) * tension;
      const cp2y = next.y - (afterNext.y - current.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const linePath = generateSmoothPath();

  // Create area path (for gradient fill under line)
  const areaPath = `${linePath} L 100 ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <Card className="border-border/50 glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Expired Listings
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {change > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-rose-500">
                  +{percentChange}%
                </span>
              </>
            ) : change < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  {percentChange}%
                </span>
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  0%
                </span>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Week-over-week comparison (by expiry date)
        </p>
      </CardHeader>
      <CardContent>
        {/* Line Chart */}
        <div className="relative h-[160px] mt-2">
          {/* SVG for line and area only */}
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={paddingTop + (i * (chartHeight - paddingTop - paddingBottom)) / 4}
                x2="100"
                y2={paddingTop + (i * (chartHeight - paddingTop - paddingBottom)) / 4}
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
                strokeOpacity="0.5"
              />
            ))}

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#areaGradient)"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Data points as absolute positioned divs to avoid SVG stretching */}
          {points.map((point, index) => {
            const isCurrentWeek = index === points.length - 1;
            return (
              <div
                key={index}
                className="absolute rounded-full border-2 border-card"
                style={{
                  left: `${point.x}%`,
                  top: `${(point.y / chartHeight) * 100}%`,
                  width: isCurrentWeek ? '10px' : '8px',
                  height: isCurrentWeek ? '10px' : '8px',
                  backgroundColor: isCurrentWeek ? '#a855f7' : '#c084fc',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-muted-foreground py-2 -ml-1">
            <span>{maxCount}</span>
            <span>{Math.round((maxCount + minCount) / 2)}</span>
            <span>{minCount}</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-1">
          {weeks.map((week, index) => {
            const isCurrentWeek = index === weeks.length - 1;
            return (
              <span
                key={week.label}
                className={`text-[10px] ${
                  isCurrentWeek
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {isCurrentWeek ? 'Now' : week.label}
              </span>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{currentWeekCount}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{lastWeekCount}</p>
            <p className="text-xs text-muted-foreground">Last Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {weeks.reduce((sum, w) => sum + w.count, 0)}
            </p>
            <p className="text-xs text-muted-foreground">8-Week Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
