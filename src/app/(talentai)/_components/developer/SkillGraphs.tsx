"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Skill = {
  name: string;
  level: number;        // 0–100
  validated: boolean;
};

type SkillsGraphProps = {
  skills: Skill[];
  /**
   * list: default vertical list
   * compact: tighter spacing for dense views
   */
  variant?: "list" | "compact";
  className?: string;
};

export default function SkillsGraph({
  skills,
  variant = "list",
  className,
}: SkillsGraphProps) {
  return (
    <div
      className={cn(
        variant === "compact" ? "space-y-3" : "space-y-5 sm:space-y-6",
        className
      )}
    >
      {skills.map((skill, index) => (
        <SkillRow key={`${skill.name}-${index}`} skill={skill} variant={variant} />
      ))}
    </div>
  );
}

/* ---------- Row ---------- */

function SkillRow({
  skill,
  variant,
}: {
  skill: Skill;
  variant: "list" | "compact";
}) {
  const { name, level, validated } = skill;
  const safeLevel = Math.max(0, Math.min(100, level));

  return (
    <div className={cn("space-y-2", variant === "compact" && "space-y-1.5")}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2.5">
          <span
            className={cn(
              "truncate font-semibold text-slate-900",
              variant === "compact" ? "text-sm" : "text-base sm:text-lg"
            )}
            title={name}
          >
            {name}
          </span>
          {validated ? (
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700">
              <AlertCircle className="mr-1 h-3.5 w-3.5" />
              Unverified
            </Badge>
          )}
        </div>

        <span
          className={cn(
            "shrink-0 tabular-nums",
            validated ? "text-slate-700" : "text-slate-700",
            variant === "compact" ? "text-sm font-semibold" : "text-lg font-bold"
          )}
        >
          {safeLevel}%
        </span>
      </div>

      <GradientProgress value={safeLevel} validated={validated} compact={variant === "compact"} />
    </div>
  );
}

/* ---------- Gradient Progress (bespoke to keep control over look) ---------- */

function GradientProgress({
  value,
  validated,
  compact,
}: {
  value: number; // 0–100
  validated: boolean;
  compact?: boolean;
}) {
  const height = compact ? "h-2.5" : "h-3";
  const track = "w-full rounded-full bg-slate-200/70";
  const fillGradient = validated
    ? "bg-[linear-gradient(90deg,#10b981_0%,#06b6d4_100%)]"
    : "bg-[linear-gradient(90deg,#f59e0b_0%,#ef4444_100%)]";

  return (
    <div
      className={cn("relative overflow-hidden", track, height)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Skill proficiency"
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out",
          fillGradient
        )}
        style={{ width: `${value}%` }}
      />
      {/* soft inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/0 [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.4)]" />
    </div>
  );
}
