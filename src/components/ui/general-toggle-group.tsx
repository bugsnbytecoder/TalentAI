'use client';

import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/utils';

export interface IconToggleOption {
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface IconToggleGroupProps {
  options: IconToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const GeneralToggleGroup: React.FC<IconToggleGroupProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={val => {
        if (val) onChange(val);
      }}
      className={cn('flex flex-wrap justify-start gap-2', className)}
    >
      {options.map(option => {
        const IconComponent = option.icon;
        const isActive = value === option.value;

        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={`Toggle ${option.label}`}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all',
              'hover:bg-muted/50',
              isActive
                ? 'bg-primary border-primary text-white'
                : 'bg-background text-muted-foreground'
            )}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span className="capitalize">{option.label}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export default GeneralToggleGroup;
