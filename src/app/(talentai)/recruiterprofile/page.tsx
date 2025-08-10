"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Star,
  Trophy,
  CheckCircle,
  Users,
  Clock,
  TrendingUp,
  Mail,
  LinkedinIcon,
  Globe,
  Heart,
  HeartOff,
  BriefcaseIcon,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────── */

function RecruiterProfileContent() {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"overview" | "jobs">("overview");

  // SSR-safe query param
  const params = useSearchParams();
  const recruiterId = params.get("id") ?? "1";

  // Mock data (replace with hook/useSWR by id)
  const recruiter = {
    id: recruiterId,
    full_name: "Sarah Mitchell",
    company: "TechCorp Inc",
    position: "Senior Technical Recruiter",
    location: "San Francisco, CA",
    bio:
      "Passionate technical recruiter with 8+ years connecting top talent with innovative companies. Specialized in full-stack, AI/ML, and fintech roles.",
    recruiter_score: 892,
    industry_focus: ["Technology", "Fintech", "AI/ML", "Full-Stack Development"],
    hiring_stats: {
      roles_posted: 45,
      roles_filled: 38,
      success_rate: 84.4,
      avg_time_to_fill: 18,
      avg_response_time: 4.2,
      candidate_satisfaction: 4.8,
    },
    developer_rating: 4.8,
    badges: [
      { title: "Top Hirer", description: "Filled 30+ roles this year", icon: "trophy" },
      { title: "Fast Response", description: "Avg response under 6 hours", icon: "clock" },
      { title: "Quality First", description: "95%+ candidate satisfaction", icon: "star" },
    ],
    contact_links: [
      "mailto:sarah@techcorp.com",
      "https://linkedin.com/in/sarahmitchell",
      "https://techcorp.com/careers",
    ],
    verified: true,
    is_active: true,
    follower_count: 1247,
  };

  const recentJobs = [
    {
      id: "1",
      title: "Senior Full-Stack Engineer",
      location: "San Francisco, CA",
      job_type: "full_time",
      salary_range: { min: 140000, max: 180000, currency: "USD" },
      required_skills: ["React", "Node.js", "TypeScript", "AWS"],
      posted_date: "2024-01-15",
      applications_count: 23,
      status: "active",
    },
    {
      id: "2",
      title: "AI/ML Engineer",
      location: "Remote",
      job_type: "remote",
      salary_range: { min: 160000, max: 200000, currency: "USD" },
      required_skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
      posted_date: "2024-01-18",
      applications_count: 31,
      status: "active",
    },
  ];

  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header Card */}
        <Card className="mb-6 border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Avatar + Follow */}
              <div className="w-full max-w-[9rem] shrink-0">
                <div className="mb-4 grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                  <Building2 className="h-10 w-10" />
                </div>
                <Button
                  onClick={() => setIsFollowing((v) => !v)}
                  className={cn(
                    "w-full gap-2 rounded-lg",
                    isFollowing ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  {isFollowing ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <p className="mt-2 text-center text-xs text-slate-600">
                  {recruiter.follower_count.toLocaleString()} followers
                </p>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="mb-4 flex flex-col items-start justify-between gap-4 lg:flex-row">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        {recruiter.full_name}
                      </h1>
                      {recruiter.verified && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{recruiter.position}</p>
                    <p className="text-sm font-medium text-indigo-700">{recruiter.company}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{recruiter.location}</span>
                    </div>
                  </div>

                  {/* Score & Rating */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <StatChip
                      label="Recruiter Score"
                      value={recruiter.recruiter_score}
                      tone="emerald"
                    />
                    <StatChip
                      label="Developer Rating"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                          {recruiter.developer_rating}
                        </span>
                      }
                      tone="amber"
                    />
                  </div>
                </div>

                {/* Bio */}
                <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-700">
                  {recruiter.bio}
                </p>

                {/* Industry Focus */}
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Industry Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {recruiter.industry_focus.map((industry) => (
                      <Badge
                        key={industry}
                        className="rounded-md border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700"
                        variant="secondary"
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Achievements</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {recruiter.badges.map((b) => {
                      const Icon = getBadgeIcon(b.icon);
                      return (
                        <div
                          key={b.title}
                          className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-slate-900">{b.title}</span>
                          </div>
                          <p className="text-xs text-slate-600">{b.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <LinkedinIcon className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
          <TabsList className="w-full justify-start gap-1 rounded-xl border border-slate-200 bg-white/70 p-1 backdrop-blur">
            <TabsTrigger value="overview" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Active Jobs
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MiniStat title="Roles Filled" value={recruiter.hiring_stats.roles_filled} sub={`of ${recruiter.hiring_stats.roles_posted} posted`} />
              <MiniStat title="Success Rate" value={<span className="text-emerald-600">{recruiter.hiring_stats.success_rate}%</span>} sub={<span className="inline-flex items-center text-emerald-600"><TrendingUp className="mr-1 h-4 w-4" /> Above average</span>} />
              <MiniStat title="Avg Time to Fill" value={<>{recruiter.hiring_stats.avg_time_to_fill} days</>} sub="Industry avg: 28 days" />
              <MiniStat title="Response Time" value={<>{recruiter.hiring_stats.avg_response_time}h</>} sub="Average response time" />
            </div>
          </TabsContent>

          {/* Jobs */}
          <TabsContent value="jobs">
            <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
              <CardHeader className="rounded-b-none border-b border-slate-200/70 bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-white">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BriefcaseIcon className="h-5 w-5" />
                  Active Job Postings <span className="opacity-80">({recentJobs.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5 sm:p-6">
                {recentJobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">
                          {job.title}
                        </h3>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Posted {new Date(job.posted_date).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications_count} applications
                          </span>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {job.required_skills.map((s) => (
                            <Badge key={s} className="rounded-md border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700" variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-sm font-semibold text-emerald-700">
                          {formatCurrency(job.salary_range.min, job.salary_range.currency)} –{" "}
                          {formatCurrency(job.salary_range.max, job.salary_range.currency)}
                        </div>
                      </div>

                      <div className="flex w-full flex-row items-center justify-between gap-2 border-t border-slate-100 pt-4 lg:w-auto lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                        <Badge className="self-start rounded-md border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          {capitalize(job.status)}
                        </Badge>
                        <Button className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function RecruiterProfile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruiterProfileContent />
    </Suspense>
  );
}

/* ───────────────────────── helpers ───────────────────────── */

function getBadgeIcon(iconName: string) {
  const map = { trophy: Trophy, clock: Clock, star: Star } as const;
  return (map as any)[iconName] ?? Star;
}

function StatChip({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "emerald" | "amber" | "slate";
}) {
  const toneMap = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
  } as const;
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-center shadow-sm",
        toneMap[tone]
      )}
    >
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

function MiniStat({
  title,
  value,
  sub,
}: {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-2xl font-semibold text-slate-900">{value}</div>
        {sub && <div className="text-sm text-slate-600">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function formatCurrency(n: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
