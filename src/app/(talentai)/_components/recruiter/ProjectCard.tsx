"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Settings,
  Users,
  Trophy,
  Bot,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface Project {
  id: string;
  project_name: string;
  status: "idle" | "shortlisting" | "challenging" | "reviewing" | "completed";
  target_candidates: string[];
  automation_enabled: boolean;
  required_skills: string[];
  final_ranking: { developer_id: string; fit_score: number; rank: number }[];
}

export default function ProjectCard({ project, role }: { project: Project, role?: string }) {
  const status = getStatusMeta(project.status);
  const router = useRouter();
  return (
    <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <CardHeader className="rounded-b-none border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold leading-6">
            {project.project_name}
          </CardTitle>

          <Badge
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium",
              status.badgeCls
            )}
            title={`Status: ${status.label}`}
          >
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-5 sm:p-6">
        {/* Required skills */}
        <section>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.required_skills?.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-md border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700"
              >
                {s}
              </Badge>
            ))}
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatTile
            label="Candidates"
            value={project.target_candidates.length}
            icon={<Users className="h-4 w-4 text-indigo-600" />}
          />
          <StatTile
            label="Ranked"
            value={project.final_ranking.length}
            icon={<Trophy className="h-4 w-4 text-amber-600" />}
          />
        </section>

        {/* Automation */}
        <section className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-200/70">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-semibold">AI Automation</span>
          </div>
          <Badge
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium",
              project.automation_enabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            {project.automation_enabled ? "Enabled" : "Disabled"}
          </Badge>
        </section>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={() => {
            router.push(`/recruiter/projects/candidates?projectId=${project.id}${role ? `&role=${role}` : ""}`);
          }}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button className="flex-1 gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
            <Play className="h-4 w-4" />
            Start
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────────────── helpers ───────────────── */

function getStatusMeta(status: Project["status"]) {
  const map = {
    idle: {
      label: "Idle",
      badgeCls: "border-slate-200 bg-slate-50 text-slate-700",
    },
    shortlisting: {
      label: "Shortlisting",
      badgeCls: "border-blue-200 bg-blue-50 text-blue-700",
    },
    challenging: {
      label: "Challenges Running",
      badgeCls: "border-orange-200 bg-orange-50 text-orange-700",
    },
    reviewing: {
      label: "Reviewing",
      badgeCls: "border-violet-200 bg-violet-50 text-violet-700",
    },
    completed: {
      label: "Completed",
      badgeCls: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  } as const;

  return map[status] ?? map.idle;
}

function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-600">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
