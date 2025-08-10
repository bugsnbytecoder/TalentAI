"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Play,
  Pause,
  Settings,
  Zap,
  Brain,
  Target,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationPanelProps {
  automationEnabled: boolean;
  onToggle: () => void;
}

export default function AutomationPanel({
  automationEnabled,
  onToggle,
}: AutomationPanelProps) {
  const workflowSteps = [
    { id: 1, name: "Shortlist", status: "completed" as const, progress: 100 },
    { id: 2, name: "Challenge", status: "active" as const, progress: 65 },
    { id: 3, name: "Review", status: "pending" as const, progress: 0 },
    { id: 4, name: "Ranking", status: "pending" as const, progress: 0 },
  ];

  const recentEvents = [
    { id: 1, message: "AI generated custom challenge for Marcus Chen", time: "2 min ago" },
    { id: 2, message: "Sarah Johnson completed React optimization challenge", time: "5 min ago" },
    { id: 3, message: "Automated ranking updated for Senior Full-Stack role", time: "8 min ago" },
    { id: 4, message: "3 new candidates automatically shortlisted", time: "12 min ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-white">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bot className="h-5 w-5" />
            AI Automation Control Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Automation Status</h3>
              <p className="mt-1 text-sm text-slate-600">
                AI is{" "}
                <span className="font-medium">
                  {automationEnabled ? "actively managing" : "standing by for"}
                </span>{" "}
                your hiring pipeline.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onToggle}
                className={cn(
                  "gap-2 text-white",
                  automationEnabled
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {automationEnabled ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause AI
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start AI
                  </>
                )}
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>

          {/* Workflow Progress */}
          <section aria-label="Current workflow" className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Current Workflow
            </h4>

            <div className="space-y-3">
              {workflowSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex w-40 min-w-[9rem] items-center gap-2">
                    <StepIcon status={step.status} />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        step.status === "completed" && "text-emerald-700",
                        step.status === "active" && "text-indigo-700",
                        step.status === "pending" && "text-slate-600"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>

                  <div className="flex-1">
                    <Progress
                      value={step.progress}
                      className={cn(
                        "h-2",
                        step.status === "completed" && "[--progress-bg:theme(colors.emerald.500)]",
                        step.status === "active" && "[--progress-bg:theme(colors.indigo.500)]",
                        step.status === "pending" && "[--progress-bg:theme(colors.slate.300)]"
                      )}
                      aria-label={`${step.name} progress`}
                    />
                  </div>

                  <span className="w-12 text-right text-sm tabular-nums text-slate-700">
                    {step.progress}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader className="border-b border-slate-200/70 bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-white">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Brain className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <ul className="space-y-3">
            {recentEvents.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{e.message}</p>
                  <p className="text-xs text-slate-500">{e.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          gradient="from-indigo-600 to-violet-600"
          title="AI Efficiency"
          value="97%"
          caption="Automation success rate"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          gradient="from-emerald-600 to-teal-600"
          title="Time Saved"
          value="23.4"
          caption="Hours this week"
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          gradient="from-pink-500 to-rose-600"
          title="Accuracy"
          value="94%"
          caption="Candidate match rate"
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

/* ───────────── helpers ───────────── */

function StepIcon({ status }: { status: "completed" | "active" | "pending" }) {
  if (status === "completed") return <CheckCircle className="h-5 w-5 text-emerald-600" />;
  if (status === "active") return <Zap className="h-5 w-5 text-indigo-600" />;
  return <Clock className="h-5 w-5 text-slate-400" />;
}

function MetricCard({
  gradient,
  title,
  value,
  caption,
  icon,
}: {
  gradient: string;
  title: string;
  value: string;
  caption: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <CardHeader className={cn("border-b border-slate-200/70 bg-gradient-to-r py-3 text-white", gradient)}>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="mb-1 text-3xl font-semibold text-slate-900">{value}</div>
          <p className="text-sm text-slate-600">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}
