"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Code,
  Users,
  Trophy,
  Crown,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const withRole = (url: string, role: "developer" | "recruiter") =>
  `${url}?role=${role}`;

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_40%,#ffffff_100%)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              TalentAI
            </span>
          </div>

          <div className="hidden gap-2 sm:flex">
            <Link href={withRole("/developer", "developer")}>
              <Button variant="ghost" className="rounded-lg">
                Developer
              </Button>
            </Link>
            <Link href={withRole("/recruiter", "recruiter")}>
              <Button variant="ghost" className="rounded-lg">
                Recruiter
              </Button>
            </Link>
            <Link href={withRole("/challenges", "developer")}>
              <Button variant="ghost" className="rounded-lg">
                Challenges
              </Button>
            </Link>
          </div>

          <Link href={withRole("/developer", "developer")}>
            <Button className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-120px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-verified Talent • Recruiter Rankings • Smart Challenges
            </div>

            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build your profile. Validate your skills. Get discovered.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-slate-600 md:text-lg">
              TalentAI pairs developers with recruiters using real challenge
              data, transparent rankings, and elegant tools for both sides.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={withRole("/developer", "developer")}>
                <Button className="h-11 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-700">
                  Enter Developer Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={withRole("/recruiter", "recruiter")}>
                <Button variant="outline" className="h-11 rounded-xl border-slate-300 px-5">
                  Recruiter Command Center
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { k: "12,847", v: "Developers" },
                { k: "842", v: "Active Recruiters" },
                { k: "19.4%", v: "Faster Hires" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-slate-900">{s.k}</div>
                  <div className="text-xs font-medium text-slate-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual / Illustration */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-xl backdrop-blur">
              <div className="grid grid-cols-3 gap-3">
                <Card className="col-span-2 overflow-hidden border-slate-200 bg-white/80">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-800">Top Developers</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      {["Alex Chen", "Sarah Johnson", "Marcus Chen"].map((n, i) => (
                        <div key={n} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-50 text-indigo-600">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-slate-700">{n}</span>
                          </div>
                          <span className="text-sm font-semibold text-emerald-600">{860 - i * 12}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-slate-200 bg-white/80">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-violet-600" />
                      <p className="text-sm font-semibold text-slate-800">Top Recruiters</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      {["TechCorp", "StartupHub", "Global Ltd"].map((n, i) => (
                        <div key={n} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <span className="text-sm font-medium text-slate-700">{n}</span>
                          <span className="text-sm font-semibold text-emerald-600">{890 - i * 11}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3 overflow-hidden border-slate-200 bg-white/80">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-pink-600" />
                        <p className="text-sm font-semibold text-slate-800">Live Challenges</p>
                      </div>
                      <Link href={withRole("/challenges", "developer")} className="text-xs font-medium text-indigo-700 hover:underline">
                        Explore
                      </Link>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        { t: "React Perf", d: "Coding • 90m" },
                        { t: "Microservices", d: "System Design • 120m" },
                        { t: "Algo Opt", d: "Algorithms • 60m" },
                        { t: "AWS Infra", d: "Architecture • 75m" },
                      ].map((c) => (
                        <div key={c.t} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <span className="text-sm font-medium text-slate-700">{c.t}</span>
                          <span className="text-xs font-medium text-slate-500">{c.d}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick entry tiles */}
      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6 lg:pb-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Link href={withRole("/developer", "developer")} className="group">
            <Card className="h-full overflow-hidden border-slate-200 bg-white/80 transition-transform hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold text-slate-800">Developer</p>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  Your Profile & Analytics
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Edit your profile, run challenges, and track global rank.
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-700">
                  Open dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={withRole("/recruiter", "recruiter")} className="group">
            <Card className="h-full overflow-hidden border-slate-200 bg-white/80 transition-transform hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-800">Recruiter</p>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  Command Center
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Automate shortlists, assign challenges, and rank candidates.
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-emerald-700">
                  Manage hiring <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="grid grid-rows-2 gap-5">
            <Link href={withRole("/devranking", "developer")} className="group">
              <Card className="overflow-hidden border-slate-200 bg-white/80 transition-transform hover:-translate-y-0.5">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-600" />
                      <p className="text-sm font-semibold text-slate-800">Developers</p>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Global Ranking
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">View the leaderboard</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                </CardContent>
              </Card>
            </Link>

            <Link href={withRole("/recrutranking", "recruiter")} className="group">
              <Card className="overflow-hidden border-slate-200 bg-white/80 transition-transform hover:-translate-y-0.5">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-violet-600" />
                      <p className="text-sm font-semibold text-slate-800">Recruiters</p>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Top Recruiters
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">Best score & feedback</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TalentAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href={withRole("/challenges", "developer")} className="text-xs font-medium text-slate-600 hover:text-slate-900">
              Challenges
            </Link>
            <Link href={withRole("/developer", "developer")} className="text-xs font-medium text-slate-600 hover:text-slate-900">
              Developer
            </Link>
            <Link href={withRole("/recruiter", "recruiter")} className="text-xs font-medium text-slate-600 hover:text-slate-900">
              Recruiter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
