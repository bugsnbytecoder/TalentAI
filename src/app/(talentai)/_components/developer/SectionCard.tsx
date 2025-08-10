"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * SectionCard (TopRecruiters-style)
 * - Gradient header (no CardHeader to avoid hidden padding)
 * - Left: icon + title
 * - Right: actions (button/link/etc.)
 * - Rounded corners, zero top gap, subtle body background
 */
export function SectionCard({
  title,
  titleIcon: Icon,
  actions,                // right side actions (e.g., <Button>View All</Button>)
  description,
  gradient = "from-purple-600 to-pink-600",
  children,
  className,
  contentClassName,
  headerClassName,
  footer,
}: {
  title?: string;
  titleIcon?: React.ElementType;
  actions?: React.ReactNode;
  description?: string;
  gradient?: string;              // e.g. "from-purple-600 to-pink-600"
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm shadow-xl",
        className
      )}
    >
      {/* Header */}
      {(title || actions) && (
        <div
          className={cn(
            "bg-gradient-to-r text-white",
            gradient,
            "px-4 py-3 sm:px-6 sm:py-4"
          )}
        >
          <div className={cn("flex items-center justify-between gap-3", headerClassName)}>
            <div className="flex min-w-0 items-center gap-2">
              {Icon && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
              )}
              {title && (
                <span className="truncate text-base font-semibold sm:text-lg">
                  {title}
                </span>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
          {description && (
            <p className="mt-1 text-sm text-white/85">{description}</p>
          )}
        </div>
      )}

      {/* Body */}
      <CardContent className={cn("p-5 sm:p-6", contentClassName)}>
        {children}
      </CardContent>

      {/* Footer (optional) */}
      {footer && <div className="px-5 pb-5 sm:px-6 sm:pb-6">{footer}</div>}
    </Card>
  );
}

/* ---------- Convenience action for 'View All' like TopRecruiters ---------- */

export function SectionViewAll({
  href,
  label = "View All",
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link href={href}>
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "rounded-lg text-white hover:bg-white/20",
          className
        )}
      >
        {label}
        <svg
          className="ml-2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </Link>
  );
}
