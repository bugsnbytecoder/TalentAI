"use client";

import * as React from "react";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/services";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Loader2,
  Activity,
  Bug,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

import ChallengeCard from "../_components/developer/ChallengeCard";
import { fetchSubmissions, listDevelopers } from "@/services/hireme.api";

/** Server difficulty strings */
type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
type DifficultyOrAll = "all" | Difficulty;

/** Helper to format % safely */
const fmtPct = (n?: number | null) =>
  typeof n === "number" ? `${Math.round(n)}%` : "—";

/** Map server status -> UI chips */
function SubmissionStatusBadge({
  status,
  hasScore,
}: {
  status: "pending" | "evaluating" | "completed";
  hasScore: boolean;
}) {
  if (status === "completed") {
    return (
      <Badge className="rounded-md px-2.5 py-1 text-xs font-medium border-emerald-200 bg-emerald-50 text-emerald-700">
        Completed{hasScore ? " • Graded" : ""}
      </Badge>
    );
  }
  if (status === "evaluating") {
    return (
      <Badge className="rounded-md px-2.5 py-1 text-xs font-medium border-blue-200 bg-blue-50 text-blue-700">
        Evaluating
      </Badge>
    );
  }
  return (
    <Badge className="rounded-md px-2.5 py-1 text-xs font-medium border-slate-200 bg-slate-50 text-slate-700">
      Pending
    </Badge>
  );
}

/** Score pill when completed */
function ScorePill({
  score,
  max,
  accuracy,
}: {
  score?: number | null;
  max?: number | null;
  accuracy?: number | null;
}) {
  if (score == null || max == null) return null;
  const pct = Math.round((score / Math.max(1, max)) * 100);
  const tone =
    pct >= 80
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : pct >= 60
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className={cn("rounded-md px-2.5 py-1 text-xs font-medium", tone)}>
        Score {score}/{max} ({pct}%)
      </Badge>
      {typeof accuracy === "number" && (
        <Badge className="rounded-md px-2.5 py-1 text-xs font-medium border-indigo-200 bg-indigo-50 text-indigo-700">
          <Target className="mr-1 h-3.5 w-3.5" />
          Accuracy {fmtPct(accuracy)}
        </Badge>
      )}
    </div>
  );
}

function ChallengesContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  const { developers, activeDeveloper, status, submissions } = useSelector(
    (s: RootState) => s.hireme
  );

  // Load a developer and their submissions
  useEffect(() => {
    if (!developers.length) {
      dispatch(listDevelopers());
    }
    // always pull latest submissions for the active developer
    dispatch(fetchSubmissions());
  }, [dispatch, developers.length]);

  const dev = activeDeveloper ?? developers[0];

  // Flatten and de-duplicate challenges from dev.skills[].challenge
  const challenges = useMemo(() => {
    if (!dev?.skills?.length) return [];
    const map = new Map<any, any>();
    for (const s of dev.skills as any[]) {
      const c = s?.challenge;
      if (c?.id != null && !map.has(c.id)) {
        map.set(c.id, {
          ...c,
          skills_tested: [s.name].filter(Boolean),
        });
      }
    }
    return Array.from(map.values());
  }, [dev]);

  // Local filters
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyOrAll>("all");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return challenges.filter((c: any) => {
      const matchesSearch =
        !term ||
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        (c.skills_tested || []).some((s: string) =>
          s?.toLowerCase().includes(term)
        );
      const matchesDiff = difficulty === "all" || c.difficulty === difficulty;
      return matchesSearch && matchesDiff;
    });
  }, [challenges, searchTerm, difficulty]);

  const loading = status === "loading" && !dev;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Challenge Center
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Validate your skills and level up your public ranking.
              </p>
            </div>

            <Button
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              disabled
              title="Coming soon"
            >
              <Plus className="h-4 w-4" />
              Create Challenge
            </Button>
          </div>
        </div>

        {loading && (
          <Card className="mb-6 border-slate-200/70 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading challenges…
            </div>
          </Card>
        )}

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="flex w-full justify-start gap-1 rounded-xl border border-slate-200 bg-white/80 p-1 backdrop-blur">
            <TabsTrigger
              value="available"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Available
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              My Submissions
            </TabsTrigger>
          </TabsList>

          {/* AVAILABLE */}
          <TabsContent value="available" className="space-y-6">
            {/* Search + Difficulty */}
            <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search challenges…"
                      className="pl-9"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["all", "beginner", "intermediate", "advanced", "expert"] as const).map(
                      (d) => (
                        <Button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          variant={difficulty === d ? "default" : "outline"}
                          className={cn(
                            "h-9 rounded-lg",
                            difficulty === d
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "border-slate-200"
                          )}
                        >
                          {d[0].toUpperCase() + d.slice(1)}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid */}
            {filtered.length === 0 ? (
              <Card className="border-slate-200/70 bg-white/80 p-10 text-center text-slate-500">
                {dev?.skills?.length
                  ? "No challenges match your filters."
                  : "No challenges yet. Add skills via your profile to get AI-recommended challenges."}
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((challenge: any) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} role={role} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* SUBMISSIONS */}
          <TabsContent value="submissions">
            <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-white">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Brain className="h-4 w-4" />
                  My Challenge Submissions
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                <div className="space-y-4">
                  {Array.isArray(submissions) && submissions.length > 0 ? (
                    submissions.map((s: any) => {
                      const ch = s.challenge || {};
                      const isCompleted = s.status === "completed";
                      return (
                        <div
                          key={s.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-5"
                        >
                          {/* Header row */}
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">
                                {ch.title || "Challenge"}
                              </h3>
                              <p className="text-xs text-slate-500">
                                Submitted on{" "}
                                {s.created_at
                                  ? new Date(s.created_at).toLocaleString()
                                  : "-"}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {ch.time_limit ? `${ch.time_limit} min` : "—"}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Activity className="h-3.5 w-3.5" />
                                  {ch.difficulty ?? "—"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <SubmissionStatusBadge
                                status={s.status as "pending" | "evaluating" | "completed"}
                                hasScore={typeof s.score === "number"}
                              />
                              {isCompleted && (
                                <ScorePill
                                  score={s.score}
                                  max={ch.max_score}
                                  accuracy={s.accuracy_rate}
                                />
                              )}
                            </div>
                          </div>

                          {/* Metrics row (only if completed or evaluating with partials) */}
                          {(isCompleted ||
                            s.bugs_found != null ||
                            s.false_positives != null) && (
                            <div className="mb-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                              <StatPill
                                icon={Bug}
                                label="Bugs Found"
                                value={s.bugs_found}
                                tone="emerald"
                              />
                              <StatPill
                                icon={Bug}
                                label="Bugs Missed"
                                value={s.bugs_missed}
                                tone="rose"
                              />
                              <StatPill
                                icon={Bug}
                                label="False Positives"
                                value={s.false_positives}
                                tone="amber"
                              />
                              <StatPill
                                icon={Target}
                                label="Accuracy"
                                value={fmtPct(s.accuracy_rate)}
                                tone="indigo"
                              />
                            </div>
                          )}

                          {/* AI feedback */}
                          {s.ai_feedback && (
                            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/70 p-4">
                              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                                <Brain className="h-4 w-4 text-blue-600" />
                                AI Feedback
                              </div>
                              <p className="text-sm text-slate-700">{s.ai_feedback}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="gap-2" disabled>
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                            {isCompleted && (
                              <Button
                                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                                disabled
                              >
                                <CheckCircle className="h-4 w-4" />
                                View Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                      You haven’t submitted any challenges yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Challenges() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChallengesContent />
    </Suspense>
  );
}

/* ---- small UI helpers ---- */
function StatPill({
  icon: Icon,
  label,
  value,
  tone = "slate",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: number | string | null;
  tone?: "emerald" | "rose" | "amber" | "indigo" | "slate";
}) {
  const tones: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  };
  return (
    <div className={cn("rounded-lg border p-2", tones[tone])}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold">
        {value == null || value === "" ? "—" : value}
      </div>
    </div>
  );
}
