'use client';

import { Loader } from 'lucide-react';

interface AppLoaderProps {
  title: string;
  description?: string;
  fullHeight?: string | null;
}

export function AppLoader({
  title,
  description,
  fullHeight = null,
}: AppLoaderProps) {
  return (
    <div
      className={`flex w-full items-center justify-center px-4 ${
        fullHeight ? fullHeight : 'h-screen'
      } bg-background`}
    >
      <div className="space-y-4 text-center">
        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <Loader className="text-primary h-8 w-8 animate-spin" />
        </div>
        <div>
          <h2 className="text-foreground mb-1 text-xl font-semibold">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
