'use client';

import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IconSelectProps {
  id: string;
  value: string | undefined;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  hasError?: boolean;
  icon?: React.ReactNode;
  noBorder?: boolean;
}

const SingleSelect: React.FC<IconSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  hasError = false,
  icon,
  noBorder = false,
}) => {
  return (
    <div className="relative">
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          id={id}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} text-left text-sm font-medium transition ${
            noBorder
              ? 'hover:bg-muted/10 rounded-md border-none bg-transparent shadow-none hover:shadow-sm'
              : ''
          } ${hasError ? 'border-red-500 ring-1 ring-red-500' : ''} `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="z-[9999] max-h-96">
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <span className="block max-w-full truncate overflow-hidden whitespace-nowrap">
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {icon && (
        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
          {icon}
        </span>
      )}
    </div>
  );
};

export default SingleSelect;
