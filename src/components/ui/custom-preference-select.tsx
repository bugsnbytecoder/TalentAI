'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface CustomPreferenceSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  icon?: React.ReactNode;
}

export default function CustomPreferenceSelect({
  value,
  onChange,
  options,
  icon,
}: CustomPreferenceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        className={cn(
          'group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition',
          'hover:bg-muted/10 hover:shadow-sm',
          'text-foreground text-left font-medium'
        )}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="flex items-center gap-2">
          {icon}
          {selected?.label || 'Select option'}
        </span>
        <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100" />
      </button>

      {isOpen && (
        <div className="bg-background absolute z-50 mt-1 w-full rounded-md border shadow-xl">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                'hover:bg-muted/20 flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition',
                opt.value === value && 'bg-muted/10 font-semibold'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
