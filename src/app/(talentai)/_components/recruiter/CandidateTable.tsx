"use client";

import * as React from "react";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users, Eye, Send, Star, CheckCircle, AlertCircle, XCircle, User as UserIcon, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Candidate {
  id: string;
  full_name: string;
  dev_score: number;
  fit_score: number;
  skills: string[];
  validation_status: "fully_validated" | "partially_validated" | "not_validated";
  availability: "available" | "open_to_offers" | "not_available";
}

type InviteOpts = {
  /** Optional free-form note to include with the invite */
  message?: string;
  /** Optional challenge id to attach to the invite */
  challengeId?: number;
};

export default function CandidateTable({
  candidates,
  onInvite,
  busyIds = [],
}: {
  candidates: Candidate[];
  /** Called when user clicks “Invite”. If not provided, the button is disabled. */
  onInvite?: (developerId: string, opts?: InviteOpts) => void | Promise<void>;
  /** Show spinner/disable Invite for these candidate ids while requests are in flight */
  busyIds?: Array<string | number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  const count = candidates.length;

  const busySet = useMemo(() => new Set(busyIds.map(String)), [busyIds]);

  return (
    <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
      <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="h-4 w-4" />
          Candidate Pool <span className="opacity-80">({count} available)</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>DevScore</TableHead>
                <TableHead>Fit</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {count === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-slate-500">
                    No candidates yet. Adjust filters or try again later.
                  </TableCell>
                </TableRow>
              )}

              {candidates.map((c) => {
                const isBusy = busySet.has(String(c.id));
                return (
                  <TableRow key={c.id} className="hover:bg-slate-50/70">
                    {/* Candidate */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-slate-900">{c.full_name}</div>
                          <div className="text-xs text-slate-500">ID: {c.id}</div>
                        </div>
                      </div>
                    </TableCell>

                    {/* DevScore */}
                    <TableCell>
                      <Badge className="rounded-md border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                        <span className="tabular-nums font-semibold">{c.dev_score}</span>
                      </Badge>
                    </TableCell>

                    {/* Fit */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5">
                        <Badge className="rounded-md border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
                          <span className="tabular-nums font-semibold">{c.fit_score}%</span>
                        </Badge>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </TableCell>

                    {/* Skills */}
                    <TableCell>
                      <div className="flex max-w-[320px] flex-wrap gap-1.5">
                        {Array.from(new Set(c.skills)).map((s, index) => (
                          <Badge
                            key={`${c.id}-${s}-${index}`}
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
                      <StatusBadge status={c.validation_status} />
                    </TableCell>

                    {/* Availability */}
                    <TableCell>
                      <AvailabilityBadge availability={c.availability} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            router.push(`/developer?id=${c.id}&role=${role}`);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>

                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                          disabled={!onInvite || isBusy}
                          onClick={() => onInvite?.(c.id)}
                          title={!onInvite ? "Select a project first" : "Invite to challenge"}
                        >
                          {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          Invite
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────── badges ────────────── */

function StatusBadge({
  status,
}: {
  status: "fully_validated" | "partially_validated" | "not_validated";
}) {
  const map = {
    fully_validated: {
      Icon: CheckCircle,
      cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
      label: "Fully validated",
    },
    partially_validated: {
      Icon: AlertCircle,
      cls: "border-amber-200 bg-amber-50 text-amber-700",
      label: "Partially validated",
    },
    not_validated: {
      Icon: XCircle,
      cls: "border-rose-200 bg-rose-50 text-rose-700",
      label: "Not validated",
    },
  } as const;

  const m = map[status];
  return (
    <Badge className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1", m.cls)}>
      <m.Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{m.label}</span>
    </Badge>
  );
}

function AvailabilityBadge({
  availability,
}: {
  availability: "available" | "open_to_offers" | "not_available";
}) {
  const map = {
    available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    open_to_offers: "border-indigo-200 bg-indigo-50 text-indigo-700",
    not_available: "border-slate-200 bg-slate-50 text-slate-600",
  } as const;

  return (
    <Badge className={cn("rounded-md px-2.5 py-1", map[availability])}>
      <span className="text-xs font-medium capitalize">
        {availability.replace(/_/g, " ")}
      </span>
    </Badge>
  );
}
