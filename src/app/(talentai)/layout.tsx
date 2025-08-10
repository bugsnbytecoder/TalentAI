"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Brain, Trophy, Users, Code, Zap, User, Menu, Bell, Settings, Crown, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { title: string; url: string; icon: any; role?: "recruiter" | "developer" };

const navigationItems: NavItem[] = [
  { title: "Developer Portal", url: "/developer", icon: Code, role: "developer" },
  { title: "Global Ranking", url: "/devranking", icon: Trophy },
  { title: "Recruiter Dashboard", url: "/recruiter", icon: Users, role: "recruiter" },
  { title: "Recruiter Rankings", url: "/recrutranking", icon: Crown, role: "developer" },
  { title: "Challenges", url: "/challenges", icon: Brain, role: "developer" },
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined; // role from ?role=developer or recruiter

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  useMemo(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  // Filter nav items based on role
  const filteredNavItems = navigationItems.filter((item) => {
    if (!item.role) return true; // public item
    return item.role === role;
  });

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(60%_60%_at_50%_-10%,#eef2ff_0%,#f8fafc_35%,#ffffff_100%)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-1.5 focus:text-white"
      >
        Skip to content
      </a>

      <div className="grid h-full grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] min-h-0">
        {/* Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex lg:flex-col lg:border-r lg:border-slate-200/70 lg:bg-white/85 lg:backdrop-blur",
            "lg:static lg:translate-x-0",
            "fixed inset-y-0 left-0 z-50 w-72 translate-x-[-100%] bg-white/90 shadow-sm transition-transform duration-300 ease-in-out",
            sidebarOpen && "translate-x-0",
            "overflow-hidden"
          )}
          aria-label="Primary"
        >
          {/* Sidebar header */}
          <div className="flex-shrink-0 border-b border-slate-200/70 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold leading-tight">TalentAI</h2>
                  <p className="text-xs text-white/80">AI Talent Platform</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-white hover:bg-white/15 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar nav */}
          <div className="flex flex-1 flex-col px-3 py-4">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Navigation
            </p>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const ActiveIcon = item.icon;
                const active = isActive(item.url);
                return (
                  <Link
                    key={item.title}
                    href={`${item.url}${role ? `?role=${role}` : ""}`}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                      active
                        ? "bg-white text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <ActiveIcon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-700"
                      )}
                    />
                    <span className="truncate font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Stats */}
            <div className="mt-6 space-y-3">
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quick stats
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Developers online</span>
                  <span className="tabular-nums text-lg font-semibold text-emerald-700">1,247</span>
                </div>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Active recruiters</span>
                  <span className="tabular-nums text-lg font-semibold text-violet-700">342</span>
                </div>
              </div>
            </div>

            {/* User */}
            <div className="mt-auto rounded-xl border border-slate-200 bg-white/70 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">Alex Thompson</p>
                  <p className="truncate text-xs text-slate-500">Senior Developer</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Account settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <button
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main content */}
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-base font-semibold text-slate-900">TalentAI</h1>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main id="main" className="min-h-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
