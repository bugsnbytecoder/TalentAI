"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { User, Zap, Star, TrendingUp } from "lucide-react";

import ProfileForm from "../_components/developer/ProfileForm";
import ChallengeCard from "../_components/developer/ChallengeCard";
import TopRecruiters from "../_components/developer/TopRecruiters";
import SkillsGraph from "../_components/developer/SkillGraphs";
import {
  PageShell,
  PortalHeader,
  MetricCard,
  StatusBadge,
  ValidationStatus,
  MetricPanel,
  TabId,
} from "../_components/developer/uis";
import { SectionCard } from "../_components/developer/SectionCard";
import { KPI } from "../_components/developer/kpi";
import { Tabs } from "../_components/developer/Tabs";
import { useSearchParams } from "next/navigation";

/* state + thunks */
import { useAppDispatch } from "@/services";
import {
  listDevelopers,
  createDeveloperWithResume,
  partialUpdateDeveloper,
} from "@/services/hireme.api";
import type { DeveloperDTO } from "@/services/hireme.types";
import { useSelector } from "react-redux";
import { RootState } from "@/services";

const isPdf = (file?: File | null) => !!file && file.type === "application/pdf";

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? undefined;

  const dispatch = useAppDispatch();
  const { status, error, developers, activeDeveloper } = useSelector(
    (s: RootState) => s.hireme
  );

  useEffect(() => {
    if (!developers.length) {
      dispatch(listDevelopers());
    }
  }, [dispatch, developers.length]);

  const developerFromApi = activeDeveloper ?? developers[0];

  // fallback demo data
  const developerFallback = useMemo(
    () => ({
      full_name: "Alex Chen",
      email: "alex@example.com",
      bio: "Full-stack developer passionate about AI and blockchain",
      location: "San Francisco, CA",
      experience_level: "senior",
      dev_score: 847,
      validation_status: "partially_validated" as ValidationStatus,
      skills: [
        { name: "React", level: 95, validated: true },
        { name: "Node.js", level: 88, validated: true },
        { name: "Python", level: 82, validated: false },
        { name: "TypeScript", level: 90, validated: true },
        { name: "GraphQL", level: 75, validated: false },
      ],
      portfolio_links: ["https://github.com/alexchen", "https://alexchen.dev"],
      availability: "open_to_offers",
    }),
    []
  );

  // normalize API → UI
  const devSkills =
    (developerFromApi as any)?.skills ??
    (developerFromApi as any)?.skills_details ??
    developerFallback.skills;

  // Deduplicate skills by name to prevent React key conflicts
  const deduplicatedSkills = useMemo(() => {
    if (!devSkills || !Array.isArray(devSkills)) return devSkills;
    
    const skillMap = new Map();
    devSkills.forEach((skill: any) => {
      if (skill?.name && !skillMap.has(skill.name)) {
        skillMap.set(skill.name, skill);
      }
    });
    
    return Array.from(skillMap.values());
  }, [devSkills]);

  const developer =
    developerFromApi
      ? ({
          ...developerFromApi,
          skills: deduplicatedSkills,
          validation_status:
            (developerFromApi.validation_status as ValidationStatus) ??
            "not_validated",
          experience_level:
            (developerFromApi.experience_level as any) ?? "junior",
          dev_score: developerFromApi.dev_score ?? 0,
          location: developerFromApi.location ?? "",
          portfolio_links:
            (developerFromApi.portfolio_links as any) ??
            developerFallback.portfolio_links,
        } as any)
      : developerFallback;

  /**
   * Build Recommended Challenges from skills[].challenge
   * - dedupe by challenge.id (falls back to title if id missing)
   * - add skills_tested = [skill.name] (aggregates if multiple skills point to same challenge)
   */
  const recommendedChallenges = useMemo(() => {
    const map = new Map<string, any>();

    (devSkills || []).forEach((s: any) => {
      const ch = s?.challenge;
      if (!ch) return;

      const key = ch.id ? String(ch.id) : `title:${(ch.title || "").toLowerCase()}`;
      const existing = map.get(key);

      if (existing) {
        // aggregate skills tested
        const set = new Set(existing.skills_tested || []);
        if (s?.name) set.add(s.name);
        existing.skills_tested = Array.from(set);
        map.set(key, existing);
      } else {
        map.set(key, {
          id: ch.id ?? key,
          title: ch.title,
          description: ch.description,
          difficulty: ch.difficulty,
          time_limit: ch.time_limit,
          challenge_type: ch.challenge_type,
          max_score: ch.max_score,
          // enrich with a skill tag for the UI
          skills_tested: s?.name ? [s.name] : [],
          // optional: pass challenge_question down if your card uses it
          challenge_question: ch.challenge_question,
        });
      }
    });

    // fallback (only if nothing came from API)
    if (map.size === 0) {
      return [
        {
          id: "fallback-1",
          title: "React Performance Optimization",
          description: "Optimize a slow React application using modern techniques",
          difficulty: "intermediate",
          skills_tested: ["React", "JavaScript", "Performance"],
          time_limit: 90,
          challenge_type: "coding",
          max_score: 100,
        },
      ];
    }

    return Array.from(map.values());
  }, [devSkills]);

  const handleSaveProfile = useCallback(
    async (data: any) => {
      try {
        if (isPdf(data.resume)) {
          await dispatch(
            createDeveloperWithResume({
              full_name: data.full_name,
              email: data.email,
              bio: data.bio,
              location: data.location,
              experience_level: data.experience_level,
              availability: data.availability,
              portfolio_links: Array.isArray(data.portfolio_links)
                ? { links: data.portfolio_links }
                : data.portfolio_links,
              resumeFile: data.resume as File,
            })
          ).unwrap();

          // jump to challenges to showcase AI suggestions
          setActiveTab("challenges");
          // refresh list (if thunk didn’t update store active)
          dispatch(listDevelopers());
        } else if (developerFromApi?.id) {
          const patch: Partial<DeveloperDTO> = {
            full_name: data.full_name,
            email: data.email,
            bio: data.bio,
            location: data.location,
            experience_level: data.experience_level,
            availability: data.availability,
            portfolio_links: Array.isArray(data.portfolio_links)
              ? { links: data.portfolio_links }
              : data.portfolio_links,
          };
          await dispatch(
            partialUpdateDeveloper({ id: developerFromApi.id, patch })
          ).unwrap();
        } else {
          console.warn("No developer exists yet. Please upload a resume (PDF) to initialize.");
        }
        setShowProfileForm(false);
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, developerFromApi?.id]
  );

  const isLoading = status === "loading";

  return (
    <PageShell>
      <PortalHeader
        developer={developer}
        onEdit={() => setShowProfileForm(true)}
        role={role}
      />

      {isLoading && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading your profile…
        </div>
      )}
      {!!error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {typeof error === "string" ? error : "Something went wrong."}
        </div>
      )}

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "profile", label: "Profile", icon: User },
          { id: "challenges", label: "Challenges", icon: Zap },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
        ]}
        role={role}
      />

      {activeTab === "profile" && (
        <div className="space-y-4 md:space-y-6">
          <SectionCard titleIcon={User} title="Profile Summary">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-balance text-xl font-bold text-slate-900">
                {developer.full_name}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {developer.location}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetricCard
                title="Dev Score"
                value={developer.dev_score}
                trend="+12 this week"
                gradient="from-emerald-50 to-green-50"
                valueClass="text-emerald-600"
              />

              <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 shadow-sm transition-colors hover:bg-violet-50/80 hover:shadow-md">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Experience Level
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-violet-600" />
                  <span className="capitalize font-bold text-violet-700">
                    {developer.experience_level}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={developer.validation_status} />
            </div>
          </SectionCard>

          <SectionCard titleIcon={TrendingUp} title="Skills Overview">
            <SkillsGraph skills={developer.skills} />
          </SectionCard>

          {role === "developer" && <TopRecruiters />}
        </div>
      )}

      {activeTab === "challenges" && role === "developer" && (
        <SectionCard
          gradient="from-purple-600 to-pink-600"
          titleIcon={Zap}
          title="Recommended Challenges"
        >
          {recommendedChallenges.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No recommended challenges yet. Upload a resume or complete a skill
              validation to get tailored challenges.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} role={role} />
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricPanel gradient="from-blue-500 to-cyan-600" title="Completion Rate">
            <KPI
              value="78%"
              caption="Challenge completion rate"
              delta={{ label: "+6.2% vs last week", tone: "up" }}
              spark={[62, 64, 66, 70, 69, 73, 78]}
            >
              <Progress value={78} className="h-2 mt-3" />
            </KPI>
          </MetricPanel>

          <MetricPanel gradient="from-emerald-500 to-green-600" title="Average Score">
            <KPI
              value="89.2"
              caption="Average across last 5 challenges"
              delta={{ label: "+1.8", tone: "up" }}
              spark={[84, 86, 87, 88, 89, 90, 89.2]}
            />
          </MetricPanel>

          <MetricPanel gradient="from-violet-500 to-purple-600" title="Global Rank">
            <KPI
              value="#247"
              caption="Out of 12,847 developers"
              delta={{ label: "↑ 31 places", tone: "up" }}
              spark={[410, 380, 352, 310, 295, 268, 247]}
              invert
            />
          </MetricPanel>
        </div>
      )}

      {showProfileForm && (
        <ProfileForm
          developer={developer}
          onClose={() => setShowProfileForm(false)}
          onSave={handleSaveProfile}
          isLoading={isLoading}
        />
      )}
    </PageShell>
  );
}
