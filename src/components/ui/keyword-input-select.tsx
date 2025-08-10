'use client';

import React, { useState } from 'react';

import { Tag, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface KeywordInputSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  valueType?: string;
}

export const KeywordInputSelect: React.FC<KeywordInputSelectProps> = ({
  value,
  onChange,
  placeholder = 'Type a keyword and press Enter...',
  icon = <Tag className="text-muted-foreground h-4 w-4" />,
  valueType = 'text',
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const keyword = input.trim();
      if (keyword && !value.includes(keyword)) {
        onChange([...value, keyword]);
        setInput('');
      }
    }
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter(v => v !== tag));
  };

  const handleBadgeClick = (tag: string) => {
    setInput(tag);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <Badge
            key={tag}
            className="bg-primary/10 text-primary border-primary/30 flex cursor-pointer items-center gap-1 border px-3 py-1 text-xs font-medium"
            onClick={() => handleBadgeClick(tag)}
          >
            {tag}
            <div
              onClick={e => {
                e.stopPropagation(); // Prevent badge click from firing
                handleRemove(tag);
              }}
            >
              <XCircle className="h-4 w-4 cursor-pointer" />
            </div>
          </Badge>
        ))}
      </div>
      {valueType === 'paragraph' ? (
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-28 resize-none pl-10"
        />
      ) : (
        <div className="relative">
          <Input
            type={valueType}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-12 pl-10"
          />
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </span>
        </div>
      )}
    </div>
  );
};
