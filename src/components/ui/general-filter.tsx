'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { addDays } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  RotateCcw,
  Search,
  Settings2,
  SortAsc,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import DateRangeSelector, { formatDisplayRange } from './date-range-selector';
import GeneralButton from './general-button';
import GeneralToggleGroup from './general-toggle-group';

export type DateLabel = Record<string, { count: number }>;

export interface DatePreset {
  key: string;
  label: string;
  days: number;
  icon?: React.ElementType;
}

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

export interface GeneralFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateRangeChange?: (range: DateRange) => void;
  onSortChange?: (value: string) => void;
  onOrderChange?: (value: string) => void;
  onFilterChange?: (value: string) => void;

  dateRange?: DateRange;
  sortOptions?: SelectOption[];
  orderOptions?: SelectOption[];
  filterOptions?: SelectOption[];
  dateLabel?: DateLabel;

  sortBy?: string;
  sortOrder?: string;
  filter?: string;
  searchKeyword?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;

  handleResetFilters?: () => void;
  defaultDateRange?: () => DateRange;
}

const DEFAULT_PRESETS: DatePreset[] = [
  { key: '7days', label: 'Last 7 Days', days: 7, icon: CalendarDays },
  { key: '30days', label: 'Last 1 Month', days: 30, icon: CalendarRange },
  { key: '90days', label: 'Last 3 Months', days: 90, icon: CalendarCheck },
  { key: '365days', label: 'Last 1 Year', days: 365, icon: CalendarCheck },
  { key: 'custom', label: 'Custom', days: 1, icon: Clock },
];

const createDateRange = (days: number): DateRange => {
  const today = new Date();
  const from = new Date(today);
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (days - 1));

  const to = new Date(today);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

export const GeneralFilter = React.forwardRef<
  HTMLDivElement,
  GeneralFilterProps
>(
  (
    {
      className,
      onDateRangeChange,
      onSortChange,
      onOrderChange,
      onFilterChange,
      sortOptions,
      orderOptions,
      filterOptions,
      filter,
      dateRange,
      sortBy = 'date',
      sortOrder = 'asc',
      searchKeyword,
      onSearchChange,
      showSearch = false,
      handleResetFilters,
      dateLabel,
      defaultDateRange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activePreset, setActivePreset] = React.useState<string | null>(null);

    const updateDateRange = (range: DateRange) => {
      onDateRangeChange?.(range);
    };

    const handlePresetClick = (preset: DatePreset) => {
      const range = createDateRange(preset.days);
      setActivePreset(preset.key);
      updateDateRange(range);
    };

    const handleCustomDateSelect = (range: DateRange) => {
      if (!range?.from) return;
      const newRange = {
        from: range.from,
        to: range.to || range.from,
      };
      if (range.to || (!range.to && !dateRange?.from)) {
        updateDateRange(newRange);
      } else {
        onDateRangeChange?.(newRange);
      }
    };

    const handleClearFilter = () => {
      setActivePreset(null);
      updateDateRange(
        defaultDateRange?.() ?? {
          from: addDays(new Date(), -30),
          to: new Date(),
        }
      );
    };

    useEffect(() => {
      if (!dateRange?.from || !dateRange?.to) return;

      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const dayDiff =
        Math.ceil(
          (dateRange.to.setHours(0, 0, 0, 0) -
            dateRange.from.setHours(0, 0, 0, 0)) /
            MS_PER_DAY
        ) + 1;

      const presets = [
        { key: '7days', match: (days: number) => days === 7 },
        { key: '30days', match: (days: number) => days >= 28 && days <= 31 },
        { key: '90days', match: (days: number) => days >= 89 && days <= 92 },
        { key: '365days', match: (days: number) => days >= 364 && days <= 366 },
      ];

      if (dayDiff <= 0) {
        handleClearFilter();
        return;
      }

      const matchedPreset = presets.find(preset => preset.match(dayDiff));
      setActivePreset(matchedPreset?.key ?? 'custom');
    }, [dateRange]);

    const isValidRange = !!(dateRange?.from && dateRange?.to);

    const navigate = (direction: 'prev' | 'next') => {
      if (!dateRange?.from || !dateRange?.to) return;

      const days = Math.ceil(
        (dateRange?.to.getTime() - dateRange?.from.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const shift = direction === 'next' ? days : -days;

      const today = new Date();
      let newFrom = addDays(dateRange?.from, shift);
      let newTo = addDays(dateRange?.to, shift);

      if (direction === 'next' && newTo > today) {
        newTo = today;
        newFrom = addDays(today, -days + 1);
      }

      const newRange = { from: newFrom, to: newTo };
      onDateRangeChange?.(newRange ?? { from: undefined, to: undefined });
      handleCustomDateSelect(newRange ?? { from: undefined, to: undefined });
    };

    return (
      <div ref={ref} className={cn('w-full space-y-4', className)}>
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative w-full">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="search-input"
                type="search"
                aria-label="Search"
                placeholder="Search anything..."
                value={searchKeyword || ''}
                onChange={e => onSearchChange?.(e.target.value)}
                className="h-12 w-full pr-4 pl-9"
              />
            </div>
          )}

          {/* Minimal filter popup button */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="outline" className="h-12 w-12">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[360px] space-y-4 p-3" align="end">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                {handleResetFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>

              {(sortOptions?.length ||
                orderOptions?.length ||
                filterOptions?.length) && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-muted-foreground flex h-10 items-center gap-2"
                    >
                      <Settings2 className="h-4 w-4" />
                      Advanced Filters
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[250px] space-y-4" align="end">
                    {sortOptions && sortOptions.length > 0 && (
                      <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger>
                          <SortAsc className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {orderOptions && orderOptions.length > 0 && (
                      <Select value={sortOrder} onValueChange={onOrderChange}>
                        <SelectTrigger>
                          {sortOrder === 'asc' ? (
                            <ArrowUp className="mr-2 h-4 w-4" />
                          ) : (
                            <ArrowDown className="mr-2 h-4 w-4" />
                          )}
                          <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filterOptions && filterOptions.length > 0 && (
                      <Select value={filter} onValueChange={onFilterChange}>
                        <SelectTrigger>
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {handleResetFilters && (
                      <div className="flex justify-end">
                        <GeneralButton
                          variant="outline"
                          onClick={handleResetFilters}
                          className="text-destructive"
                          icon={<RotateCcw className="h-4 w-4" />}
                          text="Reset Filters"
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}

              {dateRange && (
                <>
                  {/* Small/medium screens: popovers side-by-side */}
                  <div className="flex flex-wrap justify-between gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-muted-foreground h-10 w-full flex-1 items-center gap-2"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {activePreset
                            ? DEFAULT_PRESETS.find(p => p.key === activePreset)
                                ?.label
                            : 'Select Date Preset'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] space-y-4">
                        <GeneralToggleGroup
                          options={DEFAULT_PRESETS.map(
                            ({ key, label, icon }) => ({
                              label,
                              value: key,
                              icon,
                            })
                          )}
                          value={activePreset || ''}
                          onChange={value => {
                            const preset = DEFAULT_PRESETS.find(
                              p => p.key === value
                            );
                            if (preset) handlePresetClick(preset);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
              {/* Reset + Nav (mobile) */}
              {isValidRange && (
                <div className="mt-2 flex items-center gap-2">
                  <GeneralButton
                    variant="outline"
                    onClick={() => navigate('prev')}
                    icon={<ChevronLeft className="h-4 w-4" />}
                    iconOnly
                  />
                  <Button
                    variant="outline"
                    className="text-muted-foreground h-10 w-full flex-1 items-center gap-2"
                  >
                    {formatDisplayRange(dateRange)}
                  </Button>
                  <GeneralButton
                    variant="outline"
                    onClick={() => navigate('next')}
                    icon={<ChevronRight className="h-4 w-4" />}
                    iconOnly
                  />
                </div>
              )}
              <DateRangeSelector
                dateRange={dateRange ?? { from: undefined, to: undefined }}
                setDateRange={range =>
                  onDateRangeChange?.(
                    range ?? { from: undefined, to: undefined }
                  )
                }
                onChange={range =>
                  handleCustomDateSelect(
                    range ?? { from: undefined, to: undefined }
                  )
                }
                dateLabel={dateLabel}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);

GeneralFilter.displayName = 'GeneralFilter';
export default GeneralFilter;
