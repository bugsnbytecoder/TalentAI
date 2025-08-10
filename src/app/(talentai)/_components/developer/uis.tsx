"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // ensure you have this helper; if not, replace cn(...) with template strings

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  User,
} from "lucide-react";

/**
 * TYPES
 */
export type ValidationStatus =
  | "fully_validated"
  | "partially_validated"
  | "not_validated";

export type TabId = "profile" | "challenges" | "analytics";

/**
 * PAGE SHELL
 * - tighter vertical rhythm
 * - optional header slot and constrained container variants
 */
export function PageShell({
  children,
  container = "xl",
}: {
  children: React.ReactNode;
  /** max-width container size */
  container?: "lg" | "xl" | "2xl";
}) {
  const max = container === "2xl" ? "max-w-6xl" : container === "xl" ? "max-w-7xl" : "max-w-5xl";
  return (
    <div className="min-h-screen bg-[radial-gradient(50%_50%_at_50%_0%,#eef2ff_0%,#f8fafc_40%,#fff_100%)]">
      <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8", max)}>
        {children}
      </div>
    </div>
  );
}

/**
 * PORTAL HEADER
 * - aligned title block + actions
 * - subtitle and byline support
 */
export function PortalHeader({
  developer,
  onEdit,
  role,
  subtitle = role === "developer" ? "Build your profile, validate skills, and climb the global rankings" : "View developer profile and skills",
}: {
  developer: { full_name: string; location: string; validation_status: ValidationStatus };
  onEdit: () => void;
  subtitle?: string;
  role?: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {role === "developer" ? "Developer Portal" : "Developer Profile"}
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">{subtitle}</p>
          <div className="mt-2 text-sm text-slate-500">
            {developer.full_name} • {developer.location}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <StatusBadge status={developer.validation_status} />
          {role === "developer" && (
            <Button onClick={onEdit} className="shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
              <User className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>
      <Separator className="mt-6" />
    </header>
  );
}

/**
 * TABS
 * - keyboard accessible
 * - underline/filled variants
 */
const tabBtn = cva(
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
  {
    variants: {
      active: {
        true: "bg-white shadow-sm text-indigo-700",
        false: "text-slate-600 hover:bg-white/60",
      },
      full: { true: "flex-1", false: "" },
    },
    defaultVariants: { active: false, full: true },
  }
);

/**
 * STATUS BADGE
 * - cva variants for colors/icons
 */
const statusStyles = {
  fully_validated: {
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle,
    label: "Fully validated",
  },
  partially_validated: {
    class: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: AlertCircle,
    label: "Partially validated",
  },
  not_validated: {
    class: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: XCircle,
    label: "Not validated",
  },
} satisfies Record<ValidationStatus, { class: string; Icon: any; label: string }>;

export function StatusBadge({ status }: { status: ValidationStatus }) {
  const s = statusStyles[status];
  const Icon = s.Icon;
  return (
    <Badge className={cn("border px-3 py-1.5 font-medium", s.class)}>
      <Icon className="mr-2 h-4 w-4" /> {s.label}
    </Badge>
  );
}

/**
 * METRIC CARD (compact KPI tile)
 */
export function MetricCard({
  title,
  value,
  trend,
  gradient = "from-slate-50 to-slate-100",
  valueClass,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  trend?: string;
  gradient?: string;
  valueClass?: string;
  icon?: any;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-gradient-to-r p-4 shadow-sm", gradient && `bg-gradient-to-r ${gradient}`)}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</div>
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      </div>
      <div className={cn("mt-1 text-2xl font-bold", valueClass ?? "text-slate-900")}>{value}</div>
      {trend && (
        <div className="mt-2 flex items-center text-emerald-600">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
}

/**
 * METRIC PANEL (card with gradient header)
 */
export function MetricPanel({ gradient, title, children }: { gradient: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200/70 bg-white/70 backdrop-blur shadow-sm">
      <CardHeader className={cn("rounded-t-lg", `bg-gradient-to-r ${gradient} text-white`)}>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">{children}</CardContent>
    </Card>
  );
}

/**
 * SKELETONS (optional nice-to-have)
 */
export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 w-full animate-pulse rounded bg-slate-200/70", className)} />;
}

export function SkeletonTile() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-4">
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="mt-2 h-7 w-1/4" />
      <SkeletonLine className="mt-3 w-2/3" />
    </div>
  );
}
