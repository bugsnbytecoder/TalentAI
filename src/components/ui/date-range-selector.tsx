'use client';

import React from 'react';

import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Calendar, CalendarDayButton } from '@/components/ui/calendar';

import { DateLabel } from './general-filter';

export function formatDisplayRange(dateRange: DateRange) {
  if (!dateRange.from || !dateRange.to) return 'Select date range';
  return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
}

export default function DateRangeSelector({
  onChange,
  dateRange,
  setDateRange,
  dateLabel,
}: {
  onChange: (range: DateRange) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  dateLabel?: DateLabel;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={(range: DateRange | undefined) => {
          if (!range) return;
          setDateRange(range);
          onChange(range);
        }}
        numberOfMonths={1}
        captionLayout="dropdown"
        className="w-full rounded-lg border shadow-sm [--cell-size:--spacing(11)]"
        formatters={{
          formatMonthDropdown: date =>
            date.toLocaleString('default', { month: 'long' }),
        }}
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const isoDate = day.date.toISOString().split('T')[0];
            const label = dateLabel?.[isoDate];

            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                {!modifiers.outside && label && (
                  <span className="bg-muted text-muted-foreground absolute right-1 bottom-1 rounded-sm px-1 text-[10px]">
                    {label.count}
                  </span>
                )}
              </CalendarDayButton>
            );
          },
        }}
      />
    </div>
  );
}
