"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Code, Trophy, Zap, Bug, Boxes, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChallengeDTO } from "@/services/hireme.types";

/**
 * Renders a challenge summary. Default CTA navigates to /developer/challenges/[id]
 * You can still pass onStart to override navigation (e.g., open a modal).
 */
export default function ChallengeCard({
  challenge,
  ctaLabel = "Start Challenge",
  disabled = false,
  className,
  onStart, // optional override
  role,    // optional, to preserve role param in URL
}: {
  challenge: ChallengeDTO;
  onStart?: () => void;
  ctaLabel?: string;
  disabled?: boolean;
  className?: string;
  role?: string;
}) {
  const TypeIcon = getTypeIcon(challenge.challenge_type);
  const difficulty = getDifficulty(challenge.difficulty);

  // skills_tested is not part of the Django model, but AI suggestions may include it
  const skillsTested: string[] = (challenge as any).skills_tested || [];

  const href =
    typeof challenge.id !== "undefined"
      ? `/developer/challenge_preview/?role=${role}&challenge_id=${challenge.id}`
      : undefined;

  const CTA = (
    <Button
      disabled={disabled}
      onClick={onStart}
      className={cn(
        "mt-1 w-full rounded-lg bg-indigo-600 text-white shadow-sm transition-transform hover:bg-indigo-700 hover:shadow-md active:translate-y-px",
        disabled && "opacity-60"
      )}
      aria-label={ctaLabel}
    >
      <Play className="mr-2 h-4 w-4" />
      {ctaLabel}
    </Button>
  );

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white/80 backdrop-blur hover:bg-white shadow-md transition-shadow hover:shadow-lg",
        className
      )}
      role="article"
      aria-label={`${challenge.name} challenge`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
              <TypeIcon className="h-4 w-4" />
            </span>
            <h3 className="truncate text-base font-semibold sm:text-lg">
              {challenge.name}
            </h3>
          </div>
          <Badge className={cn("border px-2.5 py-1 text-xs font-medium", difficulty.badge)}>
            {difficulty.label}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <CardContent className="p-5 sm:p-6 space-y-4">
        <p className="text-sm leading-relaxed text-slate-700">
          {challenge.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{challenge.time_limit} min</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{challenge.max_score} pts</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <TypeIcon className="h-4 w-4" />
            <span className="font-medium capitalize">
              {normalizeType(challenge.challenge_type)}
            </span>
          </div>
        </div>

        {/* Skills (optional, present for AI-suggested challenges) */}
        {!!skillsTested.length && (
          <div className="flex flex-wrap gap-2">
            {skillsTested.map((skill) => (
              <Badge
                key={skill}
                className="border border-blue-200 bg-blue-50 text-blue-700"
                variant="secondary"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA */}
        {onStart
          ? CTA
          : href ? (
              <LinkButton href={href} disabled={disabled} label={ctaLabel} />
            ) : (
              CTA
            )}
      </CardContent>
    </Card>
  );
}

function LinkButton({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled?: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <Button
        disabled
        className="mt-1 w-full rounded-lg bg-indigo-600 text-white opacity-60"
      >
        <Play className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  }
  return (
    <a href={href} aria-label={label}>
      <Button className="mt-1 w-full rounded-lg bg-indigo-600 text-white shadow-sm transition-transform hover:bg-indigo-700 hover:shadow-md active:translate-y-px">
        <Play className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </a>
  );
}

/* ---------- helpers ---------- */

function getTypeIcon(type: string) {
  const map = {
    coding: Code,
    algorithm: Zap,
    debugging: Bug,
    architecture: Boxes,
    system_design: Trophy,
  } as const;
  return (map as any)[type] || Code;
}

function normalizeType(t: string) {
  return t.replace(/_/g, " ");
}

function getDifficulty(d: string) {
  const map = {
    beginner: {
      label: "Beginner",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    intermediate: {
      label: "Intermediate",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
    },
    advanced: {
      label: "Advanced",
      badge: "bg-orange-50 text-orange-700 border-orange-200",
    },
    expert: {
      label: "Expert",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
    },
  } as const;
  return (map as any)[d] ?? map.beginner;
}
