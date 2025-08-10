"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TabItem<T extends string> = { id: T; label: string; icon?: any };

const pillBtn = cva(
  "relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
  {
    variants: {
      active: {
        true: "bg-white text-indigo-700 shadow-sm",
        false: "text-slate-600 hover:bg-white/60",
      },
    },
    defaultVariants: { active: false },
  }
);

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  className,
  variant = "pill", // "pill" | "underline"
  role,
}: {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: "pill" | "underline";
  role?: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number }>({ left: 0, width: 0 });
  if (role === "recruiter") {
    tabs = tabs.filter((t) => t.id !== "challenges");
  }

  // animate underline indicator
  React.useLayoutEffect(() => {
    if (variant !== "underline") return;
    const root = listRef.current;
    if (!root) return;
    const activeEl = root.querySelector<HTMLButtonElement>(`button[data-tab="${active}"]`);
    if (activeEl) {
      const { left, width } = activeEl.getBoundingClientRect();
      const parentLeft = root.getBoundingClientRect().left;
      setIndicator({ left: left - parentLeft, width });
    }
  }, [active, variant, tabs]);

  // arrow-key navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight") onChange(tabs[(idx + 1) % tabs.length].id);
    if (e.key === "ArrowLeft") onChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
    if (e.key === "Home") onChange(tabs[0].id);
    if (e.key === "End") onChange(tabs[tabs.length - 1].id);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Sections"
      onKeyDown={onKeyDown}
      className={cn(
        "mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-1 backdrop-blur",
        "no-scrollbar", // optional: hide scrollbar via global css
        className
      )}
    >
      <div className={cn("relative flex min-w-max gap-1")}>
        {tabs.map((t) =>
          variant === "pill" ? (
            <button
              key={t.id}
              data-tab={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => onChange(t.id)}
              className={pillBtn({ active: active === t.id })}
            >
              {t.icon && <t.icon className="h-4 w-4" />}
              {t.label}
            </button>
          ) : (
            <button
              key={t.id}
              data-tab={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900",
                active === t.id && "text-slate-900"
              )}
            >
              {t.icon && <t.icon className="h-4 w-4" />}
              {t.label}
            </button>
          )
        )}

        {variant === "underline" && (
          <>
            <div className="absolute bottom-0 left-0 h-px w-full bg-slate-200" />
            <div
              className="absolute bottom-0 h-[2px] rounded-full bg-indigo-600 transition-all duration-200"
              style={{ left: indicator.left, width: indicator.width }}
            />
          </>
        )}
      </div>
    </div>
  );
}
