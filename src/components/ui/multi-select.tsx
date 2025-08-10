'use client';

import * as React from 'react';

import {
  Check,
  CheckCircle,
  ChevronDown,
  ListFilter,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxVisibleTags?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  maxVisibleTags = 3,
}) => {
  const [open, setOpen] = React.useState(false);

  const toggle = (val: string) => {
    const updated = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val];
    onChange(updated);
  };

  const clearAll = () => {
    onChange([]);
  };

  const visibleTags = value.slice(0, maxVisibleTags);
  const hiddenCount = value.length - visibleTags.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-auto min-h-12 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {visibleTags.map(val => {
                const opt = options.find(o => o.value === val);
                return (
                  <Badge
                    key={val}
                    className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 pointer-events-auto flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition"
                  >
                    {opt?.label}
                    <div>
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          toggle(val);
                        }}
                      />
                    </div>
                  </Badge>
                );
              })}

              {value.length === 0 && (
                <div className="ml-2 flex items-center gap-2">
                  <ListFilter className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    {placeholder}
                  </span>
                </div>
              )}

              {hiddenCount > 0 && (
                <Badge
                  className="bg-muted text-muted-foreground cursor-pointer px-2 py-1 text-xs font-medium"
                  onClick={e => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  +{hiddenCount} more
                </Badge>
              )}
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-popover text-popover-foreground border-border z-50 max-h-[300px] w-auto p-0"
        align="start"
        onEscapeKeyDown={() => setOpen(false)}
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            className="text-sm"
            // Optional keyboard handler
            onKeyDown={e => {
              if (e.key === 'Escape') setOpen(false);
            }}
          />
          <CommandList className="focus:outline-none">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                onSelect={() => {
                  const allSelected = value.length === options.length;
                  onChange(allSelected ? [] : options.map(o => o.value));
                }}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                    value.length === options.length
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
                <span>(Select All)</span>
              </CommandItem>

              {options.map(option => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggle(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        'border-primary-foreground mr-2 flex h-4 w-4 items-center justify-center rounded-sm border opacity-50'
                      )}
                    >
                      {isSelected && (
                        <CheckCircle className="text-primary text-bold h-4 w-4" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup>
              <div className="flex items-center justify-between">
                {value.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={clearAll}
                      className="flex-1 cursor-pointer justify-center"
                    >
                      Clear
                    </CommandItem>
                    <div className="bg-border h-full w-px" />
                  </>
                )}
                <CommandItem
                  onSelect={() => setOpen(false)}
                  className="max-w-full flex-1 cursor-pointer justify-center"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

MultiSelect.displayName = 'MultiSelect';
