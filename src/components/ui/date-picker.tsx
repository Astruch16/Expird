'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the string value (YYYY-MM-DD) to a Date object
  const date = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format the date as YYYY-MM-DD for the value
      onChange(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      onChange('');
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[140px] justify-start text-left font-normal bg-input border-border hover:bg-secondary/80 cursor-pointer',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {date ? (
            <span className="flex-1">{format(date, 'MMM d, yyyy')}</span>
          ) : (
            <span className="flex-1">{placeholder}</span>
          )}
          {value && (
            <X
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground ml-1"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        placeholder="Start date"
      />
      <span className="text-muted-foreground text-sm">to</span>
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        placeholder="End date"
      />
      {(startDate || endDate) && onClear && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
