'use client';

import React, { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DESIGN_TOKENS } from '@/lib/design-constants';

interface ModalWrapperProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

const SmallModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  description,
  isOpen,
  onOpenChange,
  children,
  className = '',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-md ${DESIGN_TOKENS.transition.normal} ${className}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SmallModalWrapper;
