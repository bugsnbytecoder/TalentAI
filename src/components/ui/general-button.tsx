'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GeneralButtonProps {
  text?: string;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  onClickStopPropagation?: boolean;
  onClickPreventDefault?: boolean;
  className?: string;
  loadingMessage?: string;
  icon?: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  iconOnly?: boolean;
  isStatic?: boolean;
  disabled?: boolean;
}

const GeneralButton: React.FC<GeneralButtonProps> = ({
  text = 'Submit',
  isLoading,
  type = 'submit',
  variant = 'default',
  className = '',
  loadingMessage = 'Loading...',
  onClick,
  onClickStopPropagation = false,
  onClickPreventDefault = false,
  icon,
  iconOnly = false,
  isStatic = false,
  disabled = false,
}) => {
  const baseClasses =
    'flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer';

  const staticClasses =
    'cursor-default pointer-events-none outline-none ring-0 focus:outline-none focus:ring-0 hover:bg-transparent active:bg-transparent';

  // For filled variants, enforce white text (unless overridden)
  const filledVariants = ['default', 'destructive'];
  const enforceWhiteText =
    filledVariants.includes(variant) && !/\btext-[^\s]+\b/.test(className)
      ? 'text-white'
      : '';

  return (
    <motion.div whileTap={isStatic ? {} : { scale: 0.97 }}>
      <Button
        type={type}
        variant={variant}
        disabled={isLoading || isStatic || disabled}
        onClick={
          isStatic
            ? undefined
            : onClickStopPropagation
              ? e => {
                  e.stopPropagation();
                  onClick?.();
                }
              : onClickPreventDefault
                ? e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick?.();
                  }
                : onClick
        }
        className={cn(
          baseClasses,
          enforceWhiteText,
          isStatic && staticClasses,
          className
        )}
      >
        {isLoading ? (
          iconOnly ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {loadingMessage}
            </>
          )
        ) : iconOnly ? (
          icon
        ) : (
          <>
            {icon}
            {text}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default GeneralButton;
