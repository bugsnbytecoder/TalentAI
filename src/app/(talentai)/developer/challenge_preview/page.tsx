"use client";

import * as React from "react";
import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Clock, Trophy, Code, Bug, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/services";
import { listDevelopers, submitChallenge } from "@/services/hireme.api"; // <-- add submitChallenge thunk if not present
import { ChallengeDTO } from "@/services/hireme.types";

function getTypeIcon(type: string) {
  const map = {
    coding: Code,
    algorithm: Code,
    debugging: Bug,
    architecture: Boxes,
    system_design: Trophy,
  } as const;
  return (map as any)[type] || Code;
}

function ChallengeAttemptPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;
  const challengeId = searchParams.get("challenge_id") ?? undefined;
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { developers, activeDeveloper, status } = useSelector((s: RootState) => s.hireme);

  useEffect(() => {
    if (!developers.length) dispatch(listDevelopers());
  }, [dispatch, developers.length]);

  const dev = activeDeveloper ?? developers[0];

    // Merge all challenges from developer.skills (your API nests challenge inside each skill)
  const allChallenges: ChallengeDTO[] = useMemo(() => {
    if (!dev) return [];
    const arr = (dev.skills || [])
      .map((s: any) => s?.challenge)
      .filter(Boolean);
    // de-duplicate by id
    const byId = new Map<any, ChallengeDTO>();
    for (const c of arr) {
      if (!byId.has(c.id)) byId.set(c.id, c);
    }
    return Array.from(byId.values());
  }, [dev]);

  const challenge = useMemo(
    () => allChallenges.find((c) => String(c.id) === String(challengeId)),
    [allChallenges, challengeId]
  );

  // Editor state
  const [language, setLanguage] = useState("python");
  const [answer, setAnswer] = useState("");
  const [bugAnalysis, setBugAnalysis] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const TypeIcon = getTypeIcon(challenge?.challenge_type || "coding");

  const handleSubmit = useCallback(async () => {
    if (!dev?.id || !challenge?.id) return;
    try {
      setSubmitting(true);
      await dispatch(
        submitChallenge({
          developer: dev.id,
          challenge: challenge.id,
          bug_analysis: bugAnalysis, // for debugging/system_design it can be prose
          answer,                    // for coding/algorithm, paste code here
        })
      ).unwrap();

      // route back or show toast; here we just send user to profile->analytics
      router.push(`/developer?${role ? `role=${role}` : ""}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, dev?.id, challenge?.id, bugAnalysis, answer, router, role]);

  if (status === "loading" && !dev) {
    return (
      <div className="mx-auto max-w-3xl p-6">Loading challenge…</div>
    );
  }

  if (!dev) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        No developer found. Please create your profile first.
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        Couldn’t find this challenge in your profile. (ID: {String(challengeId)})
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
        <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-white">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                <TypeIcon className="h-4 w-4" />
              </span>
              <span className="text-base sm:text-lg font-semibold">
                  {challenge.name}
              </span>
            </span>
            <span className="flex items-center gap-4 text-xs sm:text-sm">
              <Badge className="bg-white/15 border-white/30">
                {challenge.difficulty}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {challenge.time_limit} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Trophy className="h-4 w-4" /> {challenge.max_score} pts
              </span>
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Description */}
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {challenge.description}
            </p>
          </section>

          {/* Prompt / Question */}
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              Challenge Prompt
            </h3>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              {challenge.challenge_question}
            </pre>
          </section>

          <Separator />

          {/* Simple “editor” area */}
          <section className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Language (optional)
                </label>
                <Input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g., python, typescript"
                  className="bg-white"
                />
              </div>
              <div className="sm:col-span-2" />
            </div>

            {(challenge.challenge_type === "debugging" ||
              challenge.challenge_type === "system_design" ||
              challenge.challenge_type === "architecture") && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Analysis / Reasoning
                </label>
                <Textarea
                  className="min-h-[120px] bg-white"
                  placeholder="Describe your approach, assumptions, and fixes…"
                  value={bugAnalysis}
                  onChange={(e) => setBugAnalysis(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Your Answer {challenge.challenge_type === "coding" ? "(paste code here)" : ""}
              </label>
              <Textarea
                className="min-h-[240px] font-mono text-sm bg-white"
                placeholder={
                  challenge.challenge_type === "coding"
                    ? "# Paste your solution code here…"
                    : "Write your final answer or summary here…"
                }
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                "bg-indigo-600 text-white hover:bg-indigo-700",
                submitting && "opacity-60"
              )}
            >
              {submitting ? "Submitting…" : "Submit Challenge"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChallengeAttemptPage() {
  return (
    <Suspense fallback={<div>Loading challenge…</div>}>
      <ChallengeAttemptPageContent />
    </Suspense>
  );
}
