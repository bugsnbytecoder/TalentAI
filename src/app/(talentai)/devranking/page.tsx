"use client";

import * as React from "react";
import { useMemo, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Trophy,
  MapPin,
  User,
  Download,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AvailabilityBadge, RankBadge, StatusBadge } from "./_components/uis";
import { useRouter, useSearchParams } from "next/navigation";

type Dev = {
  id: string;
  full_name: string;
  location: string;
  dev_score: number;
  fit_score: number;
  experience_level: "junior" | "mid" | "senior";
  validation_status: "fully_validated" | "partially_validated" | "not_validated";
  skills: string[];
  availability: "available" | "open_to_offers" | "not_available";
};

function GlobalRankingContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  // Mock ranking data
  const developers: Dev[] = [
    {
      id: "1",
      full_name: "Sarah Johnson",
      location: "New York, NY",
      dev_score: 967,
      fit_score: 94,
      experience_level: "senior",
      validation_status: "fully_validated",
      skills: ["React", "Node.js", "TypeScript", "GraphQL"],
      availability: "available",
    },
    {
      id: "2",
      full_name: "Marcus Chen",
      location: "San Francisco, CA",
      dev_score: 943,
      fit_score: 91,
      experience_level: "senior",
      validation_status: "fully_validated",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      availability: "open_to_offers",
    },
    {
      id: "3",
      full_name: "Elena Rodriguez",
      location: "Austin, TX",
      dev_score: 921,
      fit_score: 88,
      experience_level: "mid",
      validation_status: "partially_validated",
      skills: ["Vue.js", "Laravel", "MySQL", "Docker"],
      availability: "available",
    },
    {
      id: "4",
      full_name: "Alex Kim",
      location: "Seattle, WA",
      dev_score: 899,
      fit_score: 85,
      experience_level: "senior",
      validation_status: "fully_validated",
      skills: ["Go", "Kubernetes", "Microservices", "Redis"],
      availability: "not_available",
    },
    {
      id: "5",
      full_name: "Jordan Williams",
      location: "Chicago, IL",
      dev_score: 876,
      fit_score: 82,
      experience_level: "mid",
      validation_status: "partially_validated",
      skills: ["Java", "Spring Boot", "MongoDB", "Kafka"],
      availability: "open_to_offers",
    },
  ];

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return developers.filter((d) => {
      const matchesSearch =
        !q ||
        d.full_name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.skills.some((s) => s.toLowerCase().includes(q));

      const matchesSkill =
        skillFilter === "all" ||
        d.skills.map((s) => s.toLowerCase()).includes(skillFilter);

      const matchesLoc =
        locationFilter === "all" ||
        (locationFilter === "usa" && d.location.toLowerCase().includes("ca") || d.location.toLowerCase().includes("ny") || d.location.toLowerCase().includes("wa") || d.location.toLowerCase().includes("tx") || d.location.toLowerCase().includes("il")) ||
        (locationFilter === "europe" && false) || // stub categories for demo
        (locationFilter === "asia" && false);

      const matchesExp =
        experienceFilter === "all" || d.experience_level === (experienceFilter as Dev["experience_level"]);

      return matchesSearch && matchesSkill && matchesLoc && matchesExp;
    });
  }, [developers, searchTerm, skillFilter, locationFilter, experienceFilter]);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Global Talent Ranking
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Top validated developers worldwide
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-slate-200/70 bg-white/70 backdrop-blur">
          <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Filter className="h-4 w-4" />
                Search & Filter
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search developers, skills, locations…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All skills</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="node.js">Node.js</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All experience</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="mt-6 border-slate-200/70 bg-white/80 backdrop-blur">
          <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-white">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Trophy className="h-4 w-4" />
              Leaderboard <span className="opacity-80">({filtered.length} developers)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">Rank</TableHead>
                    <TableHead>Developer</TableHead>
                    <TableHead>DevScore</TableHead>
                    <TableHead>Fit</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-slate-500">
                        No results. Try different filters.
                      </TableCell>
                    </TableRow>
                  )}

                  {filtered.map((d, idx) => (
                    <TableRow key={d.id} className="hover:bg-slate-50/70">
                      {/* Rank */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <RankBadge rank={idx + 1} />
                        </div>
                      </TableCell>

                      {/* Developer */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-slate-900">
                              {d.full_name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{d.location}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* DevScore */}
                      <TableCell>
                        <Badge className="rounded-md border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          <span className="tabular-nums font-semibold">{d.dev_score}</span>
                        </Badge>
                      </TableCell>

                      {/* Fit */}
                      <TableCell>
                        <Badge className="rounded-md border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
                          <span className="tabular-nums font-semibold">{d.fit_score}%</span>
                        </Badge>
                      </TableCell>

                      {/* Skills */}
                      <TableCell>
                        <div className="flex max-w-[340px] flex-wrap gap-1.5 overflow-hidden text-ellipsis">
                          {d.skills.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="rounded-md border-slate-200 bg-slate-100 px-2 py-0.5 text-slate-700"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={d.validation_status} />
                      </TableCell>

                      {/* Availability */}
                      <TableCell>
                        <AvailabilityBadge availability={d.availability} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                          router.push(`/developer?id=${d.id}&role=${role}`);
                        }}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
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

export default function GlobalRanking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalRankingContent />
    </Suspense>
  );
}

