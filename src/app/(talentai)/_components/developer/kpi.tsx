import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Compact KPI block with optional delta + sparkline */
export function KPI({
  value,
  caption,
  delta,
  spark,
  invert = false,
  children,
}: {
  value: string | number;
  caption?: string;
  delta?: { label: string; tone: "up" | "down" };
  spark?: number[];     // simple series for inline sparkline
  invert?: boolean;     // when lower is better (e.g., rank)
  children?: React.ReactNode;
}) {
  const Up = TrendingUp;
  const Down = TrendingDown;
  const isUp = delta?.tone === "up";
  const good = invert ? !isUp : isUp; // color logic when lower is better

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {caption && <div className="mt-1 text-sm text-slate-600">{caption}</div>}
        </div>

        {delta && (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
              good
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            )}
            title={delta.label}
          >
            {isUp ? (
              <Up className="h-3.5 w-3.5" />
            ) : (
              <Down className="h-3.5 w-3.5" />
            )}
            {delta.label}
          </div>
        )}
      </div>

      {spark && <Sparkline data={spark} className="h-10 w-full text-indigo-500" />}

      {children}
    </div>
  );
}

/** Minimal inline SVG sparkline (auto scales) */
export function Sparkline({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const norm = (v: number) => (max === min ? 50 : ((v - min) / (max - min)) * 100);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - norm(v);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("overflow-visible", className)}>
      {/* area fill */}
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="currentColor"
        opacity="0.1"
      />
      {/* stroke */}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
