"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import CandidateTable, { Candidate } from "../../../_components/recruiter/CandidateTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProjectCandidatesPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;
  const projectId = searchParams.get("projectId") ?? undefined;

  // Mock: fetch candidates for this projectId (replace with real fetch)
  const candidates: Candidate[] = [
    {
      id: "1",
      full_name: "Sarah Johnson",
      dev_score: 967,
      fit_score: 94,
      skills: ["React", "Node.js", "TypeScript", "GraphQL"],
      validation_status: "fully_validated",
      availability: "available",
    },
    {
      id: "2",
      full_name: "Marcus Chen",
      dev_score: 943,
      fit_score: 91,
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      validation_status: "fully_validated",
      availability: "open_to_offers",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Card className="mb-6 border-slate-200/70 bg-white/80 backdrop-blur">
        <CardHeader className="border-b border-slate-200/70 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Project #{projectId} — Candidates
            </CardTitle>
            <Link href={`/recruiter${role ? `?role=${role}` : ""}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="py-3 text-sm text-slate-600">
          View and manage candidates shortlisted for this project.
        </CardContent>
      </Card>

      <CandidateTable candidates={candidates} />
    </div>
  );
}
