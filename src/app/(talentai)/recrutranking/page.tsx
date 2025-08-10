"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Trophy,
  MapPin,
  Building2,
  Download,
  Eye,
  Star,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

function RecruiterRankingContent() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [industryFilter, setIndustryFilter] = React.useState("all");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [activityFilter, setActivityFilter] = React.useState("all");

  // Mock data (replace with hook/SWR)
  const recruiters = [
    {
      id: "1",
      full_name: "Sarah Mitchell",
      company: "TechCorp Inc",
      position: "Senior Technical Recruiter",
      location: "San Francisco, CA",
      recruiter_score: 892,
      industry_focus: ["Technology", "Fintech", "AI/ML"],
      hiring_stats: {
        roles_posted: 45,
        roles_filled: 38,
        success_rate: 84.4,
        avg_time_to_fill: 18,
        avg_response_time: 4.2,
      },
      developer_rating: 4.8,
      badges: [
        { title: "Top Hirer", icon: "trophy", earned_date: "2024-01-15" },
        { title: "Fast Response", icon: "zap", earned_date: "2024-01-20" },
      ],
      verified: true,
      is_active: true,
    },
    {
      id: "2",
      full_name: "Michael Rodriguez",
      company: "StartupHub",
      position: "Head of Talent Acquisition",
      location: "Austin, TX",
      recruiter_score: 867,
      industry_focus: ["Startups", "E-commerce", "Mobile"],
      hiring_stats: {
        roles_posted: 32,
        roles_filled: 28,
        success_rate: 87.5,
        avg_time_to_fill: 15,
        avg_response_time: 3.8,
      },
      developer_rating: 4.7,
      badges: [{ title: "Quality First", icon: "star", earned_date: "2024-01-10" }],
      verified: true,
      is_active: true,
    },
    {
      id: "3",
      full_name: "Emily Chen",
      company: "Global Solutions Ltd",
      position: "Technical Recruiter",
      location: "New York, NY",
      recruiter_score: 834,
      industry_focus: ["Enterprise", "Cloud", "DevOps"],
      hiring_stats: {
        roles_posted: 28,
        roles_filled: 22,
        success_rate: 78.6,
        avg_time_to_fill: 22,
        avg_response_time: 5.1,
      },
      developer_rating: 4.6,
      badges: [{ title: "Diversity Champion", icon: "users", earned_date: "2024-01-05" }],
      verified: true,
      is_active: true,
    },
    {
      id: "4",
      full_name: "David Thompson",
      company: "InnovateLabs",
      position: "Principal Recruiter",
      location: "Seattle, WA",
      recruiter_score: 811,
      industry_focus: ["Healthcare Tech", "Biotech", "AI"],
      hiring_stats: {
        roles_posted: 25,
        roles_filled: 19,
        success_rate: 76.0,
        avg_time_to_fill: 25,
        avg_response_time: 6.2,
      },
      developer_rating: 4.5,
      badges: [{ title: "Industry Expert", icon: "brain", earned_date: "2024-01-12" }],
      verified: true,
      is_active: true,
    },
  ];

  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Recruiter Rankings
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Top-rated recruiters ranked by performance and developer feedback.
              </p>
            </div>
            <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader className="rounded-b-none border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Filter className="h-4 w-4" />
              Search & Filter Recruiters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recruiters…"
                  className="pl-9"
                />
              </div>

              {/* Industry */}
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="startup">Startups</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                </SelectContent>
              </Select>

              {/* Activity */}
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All activity</SelectItem>
                  <SelectItem value="high">High activity</SelectItem>
                  <SelectItem value="medium">Medium activity</SelectItem>
                  <SelectItem value="low">Low activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rankings Table */}
        <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader className="rounded-b-none border-b border-slate-200/70 bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-white">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="h-4 w-4" />
              Top Recruiters <span className="opacity-80">({recruiters.length} total)</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Recruiter</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Roles Filled</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recruiters.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-slate-500">
                        No recruiters to display. Try different filters.
                      </TableCell>
                    </TableRow>
                  )}

                  {recruiters.map((r, idx) => (
                    <TableRow key={r.id} className="hover:bg-slate-50/70">
                      {/* Rank */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Medal index={idx} />
                          {idx < 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </TableCell>

                      {/* Recruiter */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-medium text-slate-900">
                                {r.full_name}
                              </span>
                              {r.verified && <CheckCircle className="h-4 w-4 text-indigo-600" />}
                            </div>
                            <div className="text-xs text-slate-600">{r.company}</div>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              {r.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Score */}
                      <TableCell>
                        <Badge className="rounded-md border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          <span className="tabular-nums font-semibold">{r.recruiter_score}</span>
                        </Badge>
                      </TableCell>

                      {/* Roles filled */}
                      <TableCell>
                        <div className="text-center">
                          <div className="tabular-nums font-semibold text-slate-900">
                            {r.hiring_stats.roles_filled}
                          </div>
                          <div className="text-xs text-slate-500">
                            of {r.hiring_stats.roles_posted} posted
                          </div>
                        </div>
                      </TableCell>

                      {/* Success rate */}
                      <TableCell>
                        <Badge className="rounded-md border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
                          {r.hiring_stats.success_rate}%
                        </Badge>
                      </TableCell>

                      {/* Response time */}
                      <TableCell>
                        <div className="text-center">
                          <div className="tabular-nums font-semibold text-slate-900">
                            {r.hiring_stats.avg_response_time}h
                          </div>
                          <div className="text-xs text-slate-500">avg response</div>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell>
                        <div className="inline-flex items-center gap-1 text-slate-900">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                          <span className="tabular-nums font-semibold">
                            {r.developer_rating}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Link href={`/recruiterprofile?id=${r.id}&role=${role}`}>
                          <Button size="sm" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RecruiterRanking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruiterRankingContent />
    </Suspense>
  );
}

/* ───────────── helpers ───────────── */

function Medal({ index }: { index: number }) {
  const map = [
    "bg-yellow-400 text-yellow-900",
    "bg-slate-300 text-slate-700",
    "bg-orange-400 text-orange-900",
  ] as const;
  const cls = index < 3 ? map[index] : "bg-slate-100 text-slate-600";
  return (
    <div
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold",
        cls
      )}
      title={`Rank ${index + 1}`}
    >
      #{index + 1}
    </div>
  );
}
