"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/services";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Download,
  User,
  Bot,
  Target,
  RefreshCw,
  Filter,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import ProjectCard, { Project as ProjectCardType } from "../_components/recruiter/ProjectCard";
import AutomationPanel from "../_components/recruiter/AutomationPanel";
import CandidateTable, { Candidate as CandidateRow } from "../_components/recruiter/CandidateTable";

import {
  listProjects,
  createProject,
  fetchRecommendations,
  inviteToProject,
} from "@/services/recruiter.api";

/* ───────────────── Tabs ───────────────── */
function PillTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Recruiter dashboard sections"
      className={cn(
        "mb-6 flex w-full flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/70 p-1 backdrop-blur",
        className
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
            active === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-white/60"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────── Create Project Dialog ─────────── */
function CreateProjectDialog({
  open,
  onClose,
  onCreate,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    project_name: string;
    description?: string;
    automation_enabled?: boolean;
    required_skills: { name: string; required_level: number }[];
  }) => void;
  loading?: boolean;
}) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<Array<{ name: string; required_level: number }>>([
    { name: "React", required_level: 80 },
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
          <CardTitle className="text-base font-semibold">New Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Project Name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Senior Full-Stack Developer"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Role, mission, and expectations…"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">Required Skills</label>
              <Button
                variant="outline"
                className="h-8 gap-1"
                onClick={() => setSkills((s) => [...s, { name: "", required_level: 70 }])}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {skills.map((s, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2">
                  <input
                    className="col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={s.name}
                    onChange={(e) =>
                      setSkills((arr) =>
                        arr.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x))
                      )
                    }
                    placeholder="React"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={s.required_level}
                    onChange={(e) =>
                      setSkills((arr) =>
                        arr.map((x, i) =>
                          i === idx ? { ...x, required_level: Number(e.target.value || 0) } : x
                        )
                      )
                    }
                    placeholder="80"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="border-slate-300">
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={!projectName.trim() || loading}
              onClick={() =>
                onCreate({
                  project_name: projectName.trim(),
                  description: description.trim(),
                  automation_enabled: true,
                  required_skills: skills.filter((s) => s.name.trim()),
                })
              }
            >
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────────────── Page ───────────────── */
function RecruiterDashboardContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  const { projects, recommendationsByProject, status, creating } = useSelector(
    (s: RootState) => s.recruiter
  );

  const [activeTab, setActiveTab] = useState<"projects" | "automation" | "analytics">("projects");
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // quick filters/search
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "matching" | "challenging" | "closed">("all");

  // Load projects on mount
  useEffect(() => {
    dispatch(listProjects());
  }, [dispatch]);

  // Auto-select first project & fetch its recommendations
  useEffect(() => {
    if (!projects.length) return;
    const first = selectedProjectId ?? projects[0]?.id ?? null;
    if (first != null) {
      setSelectedProjectId(first);
      dispatch(fetchRecommendations(first));
    }
  }, [projects, selectedProjectId, dispatch]);

  const selectedProject =
    selectedProjectId != null ? projects.find((p) => p.id === selectedProjectId) : undefined;

  const recommendations = useMemo(() => {
    if (!selectedProjectId) return [];
    return recommendationsByProject[selectedProjectId] ?? [];
  }, [recommendationsByProject, selectedProjectId]);

  const candidates = useMemo(() => candidatesFromRecs(recommendations), [recommendations]);

  const activeProjectsCount = projects.length;
  const loading = status === "loading";

  const filteredProjects = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      const byText =
        !term ||
        p.project_name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const byStatus = statusFilter === "all" || p.status === statusFilter;
      return byText && byStatus;
    });
  }, [projects, q, statusFilter]);

  const handleCreateProject = async (payload: {
    project_name: string;
    description?: string;
    automation_enabled?: boolean;
    required_skills: { name: string; required_level: number }[];
  }) => {
    try {
      const res = await dispatch(createProject(payload)).unwrap();
      setShowCreate(false);
      // refresh projects and auto-select the newly created one
      dispatch(listProjects()).then(() => {
        const newId = res?.project?.id;
        if (newId) {
          setSelectedProjectId(newId);
          dispatch(fetchRecommendations(newId));
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleInvite = async (developerId: number | string, message?: string, challengeId?: number) => {
    if (!selectedProjectId) return;
    try {
      await dispatch(
        inviteToProject({
          projectId: selectedProjectId,
          developerId,
          message,
          challengeId,
        })
      ).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Recruiter Command Center
            </h1>
            <p className="mt-1 text-sm text-slate-600">AI-powered talent acquisition</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setAutomationEnabled((v) => !v)}
              className={cn(
                "gap-2 text-white",
                automationEnabled ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              <Bot className="h-4 w-4" />
              {automationEnabled ? "Disable AI" : "Enable AI"}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <PillTabs
          tabs={[
            { id: "projects", label: "Projects" },
            { id: "automation", label: "Automation" },
            { id: "analytics", label: "Analytics" },
          ]}
          active={activeTab}
          onChange={(id) => setActiveTab(id as typeof activeTab)}
        />

        {/* KPI Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Active Projects"
            value={activeProjectsCount}
            Icon={User}
            tone="indigo"
          />
          <KpiCard
            title="Candidates Evaluated"
            value={Object.values(recommendationsByProject).reduce(
              (acc: number, arr: any[]) => acc + (arr?.length || 0),
              0
            )}
            Icon={Users}
            tone="emerald"
          />
          <KpiCard
            title="AI Automation"
            value={
              <span className={cn("font-semibold", automationEnabled ? "text-emerald-700" : "text-slate-700")}>
                {automationEnabled ? "Active" : "Inactive"}
              </span>
            }
            Icon={Bot}
            tone={automationEnabled ? "emerald" : "slate"}
          />
          <KpiCard title="Success Rate" value="94%" Icon={Target} tone="rose" />
        </div>

        {/* Toolbar */}
        {activeTab === "projects" && (
          <Card className="mb-4 border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search projects by name or description…"
                  className="pl-9"
                />
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex items-center gap-2">
                {(["all", "draft", "matching", "challenging", "closed"] as const).map((s) => (
                  <Badge
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium",
                      statusFilter === s
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    )}
                  >
                    {s[0].toUpperCase() + s.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Content */}
        {activeTab === "projects" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
            {/* Left: Projects list */}
            <div className="space-y-4">
              {loading && !projects.length && (
                <SkeletonProjectList />
              )}

              {!loading && filteredProjects.length === 0 && (
                <Card className="border-slate-200/70 bg-white/80 p-8 text-center text-slate-600">
                  No projects match your filters.
                </Card>
              )}

              {filteredProjects.map((p) => {
                const selected = p.id === selectedProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id ?? null);
                      dispatch(fetchRecommendations(p.id as number));
                    }}
                    className={cn("cursor-pointer transition-transform", selected && "translate-x-[2px]")}
                  >
                    <ProjectCard
                      project={
                        {
                          id: String(p.id),
                          project_name: p.project_name,
                          status: p.status,
                          automation_enabled: p.automation_enabled,
                          required_skills: (p.required_skills || []).map((rs: any) =>
                            typeof rs === "string" ? rs : rs.name
                          ),
                          final_ranking: [],
                          target_candidates: [],
                        } as ProjectCardType
                      }
                      role={role}
                    />
                    {selected && (
                      <div className="mt-1 flex items-center gap-1 text-xs font-medium text-indigo-600">
                        Selected <ChevronRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Recommendations */}
            <Card className="h-fit border-slate-200/70 bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-slate-200/70 py-3">
                <CardTitle className="text-base font-semibold">
                  {selectedProject ? (
                    <>
                      Recommendations —{" "}
                      <span className="text-slate-900">{selectedProject.project_name}</span>
                    </>
                  ) : (
                    "Recommendations"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {!selectedProject && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    Select a project to view candidate recommendations.
                  </div>
                )}

                {selectedProject && recommendations.length === 0 && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    No recommendations yet for this project.
                  </div>
                )}

                {!!selectedProject && recommendations.length > 0 && (
                  <CandidateTable candidates={candidates} onInvite={(devId) => handleInvite(devId)} />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "automation" && (
          <AutomationPanel automationEnabled={automationEnabled} onToggle={() => setAutomationEnabled((v) => !v)} />
        )}

        {activeTab === "analytics" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnalyticsCard
              title="Hiring Velocity"
              value="12.5"
              subtitle="Avg days to hire"
              tone="indigo"
            />
            <AnalyticsCard
              title="Quality Score"
              value="92%"
              subtitle="Candidate satisfaction"
              tone="emerald"
            />
            <AnalyticsCard
              title="Cost Efficiency"
              value="-47%"
              subtitle="Reduction in costs"
              tone="rose"
            />
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateProject}
        loading={creating}
      />
    </div>
  );
}

export default function RecruiterDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecruiterDashboardContent />
    </Suspense>
  );
}

/* ────────────── helpers / little components ────────────── */

function candidatesFromRecs(recommendations: any[]): CandidateRow[] {
  return recommendations.map((r: any) => ({
    id: String(r.developer?.id ?? r.developer_id ?? ""),
    full_name: r.developer?.full_name ?? "—",
    dev_score: r.developer?.dev_score ?? 0,
    fit_score: Math.round((r.fit_score ?? 0) * 100) / 100,
    skills:
      (r.developer?.skills || []).map((sidOrObj: any) =>
        typeof sidOrObj === "object" ? sidOrObj.name : String(sidOrObj)
      ) ?? [],
    validation_status: r.developer?.validation_status ?? "not_validated",
    availability: r.developer?.availability ?? "open_to_offers",
  }));
}

function KpiCard({
  title,
  value,
  Icon,
  tone = "slate",
}: {
  title: string;
  value: number | string | React.ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  tone?: "indigo" | "emerald" | "rose" | "slate";
}) {
  const toneMap = {
    indigo: "from-indigo-500 to-violet-600",
    emerald: "from-emerald-500 to-teal-600",
    rose: "from-pink-500 to-rose-600",
    slate: "from-slate-400 to-slate-500",
  } as const;
  return (
    <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
          <div className={cn("grid h-12 w-12 place-items-center rounded-lg text-white bg-gradient-to-br", toneMap[tone])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsCard({
  title,
  value,
  subtitle,
  tone = "indigo",
}: {
  title: string;
  value: string;
  subtitle: string;
  tone?: "indigo" | "emerald" | "rose";
}) {
  const headMap = {
    indigo: "from-indigo-600 to-violet-600",
    emerald: "from-emerald-600 to-teal-600",
    rose: "from-pink-500 to-rose-600",
  } as const;

  return (
    <Card className="border-slate-200/70 bg-white/80 backdrop-blur">
      <CardHeader className={cn("border-b border-slate-200/70 bg-gradient-to-r py-3 text-white", headMap[tone])}>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="mb-1 text-3xl font-semibold text-slate-900">{value}</div>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonProjectList() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white/60 p-5">
          <div className="mb-3 h-4 w-1/3 rounded bg-slate-200" />
          <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}


