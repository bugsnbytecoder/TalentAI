import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RankBadge({ rank }: { rank: number }) {
  const tone =
    rank === 1
      ? "from-yellow-400 to-amber-500 text-yellow-900"
      : rank === 2
        ? "from-slate-300 to-slate-400 text-slate-800"
        : rank === 3
          ? "from-orange-300 to-orange-400 text-orange-900"
          : "from-slate-100 to-slate-200 text-slate-700";

  return (
    <div
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br text-xs font-semibold tabular-nums",
        tone
      )}
      title={`Rank #${rank}`}
    >
      #{rank}
    </div>
  );
}

export function StatusBadge({
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

export function AvailabilityBadge({
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


