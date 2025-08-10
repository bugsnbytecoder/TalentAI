import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ProjectDTO,
  DeveloperDTO,
  CandidateRecommendationDTO,
  InvitationDTO,
  ProjectCreateResponse,
  ChallengeDTO,
  SubmissionDTO,
} from "./hireme.types";
import {
  listProjects,
  createProject,
  retrieveProject,
  updateProject,
  partialUpdateProject,
  destroyProject,
  recommendationsProject,
  inviteProject,
  listDevelopers,
  createDeveloper,
  retrieveDeveloper,
  updateDeveloper,
  partialUpdateDeveloper,
  destroyDeveloper,
  createDeveloperWithResume,
  developerInvites,
  acceptInvite,
  declineInvite,
  submitChallenge,
  fetchSubmissions,
} from "./hireme.api";

type Status = "idle" | "loading" | "success" | "error";

export interface HireMeState {
  status: Status;
  error: string | null;

  // Projects
  projects: ProjectDTO[];
  activeProject: ProjectDTO | null;
  recommendations: Record<string | number, CandidateRecommendationDTO[]>; // keyed by project id

  // Developers
  developers: DeveloperDTO[];
  activeDeveloper: DeveloperDTO | null;
  invites: Record<string | number, InvitationDTO[]>; // keyed by developer id

  // Extra AI suggestion cache (from createProject response)
  aiSuggestions: Record<string | number, any>;

  // Submissions
  submissions: SubmissionDTO[];
}

const initialState: HireMeState = {
  status: "idle",
  error: null,

  projects: [],
  activeProject: null,
  recommendations: {},

  developers: [],
  activeDeveloper: null,
  invites: {},

  aiSuggestions: {},

  submissions: [],
};

const hiremeSlice = createSlice({
  name: "hireme",
  initialState,
  reducers: {
    resetHireMeState: () => initialState,
  },
  extraReducers: (builder) => {
    /* ---------------- Projects ---------------- */
    builder.addCase(listProjects.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    builder.addCase(listProjects.fulfilled, (s, a: PayloadAction<ProjectDTO[]>) => {
      s.status = "success";
      s.projects = a.payload;
    });
    builder.addCase(listProjects.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to load projects";
    });

    builder.addCase(createProject.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    builder.addCase(createProject.fulfilled, (s, a: PayloadAction<ProjectCreateResponse>) => {
      s.status = "success";
      const p = a.payload.body.project;
      s.projects.push(p);
      s.activeProject = p;
      s.recommendations[p.id!] = a.payload.body.recommendations ?? [];
      s.aiSuggestions[p.id!] = a.payload.body.ai_suggestions ?? {};
    });
    builder.addCase(createProject.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to create project";
    });

    builder.addCase(retrieveProject.fulfilled, (s, a: PayloadAction<ProjectDTO>) => {
      s.activeProject = a.payload;
      // keep projects in sync if exists
      const idx = s.projects.findIndex((p) => p.id === a.payload.id);
      if (idx >= 0) s.projects[idx] = a.payload;
    });

    builder.addCase(updateProject.fulfilled, (s, a: PayloadAction<ProjectDTO>) => {
      const idx = s.projects.findIndex((p) => p.id === a.payload.id);
      if (idx >= 0) s.projects[idx] = a.payload;
      if (s.activeProject?.id === a.payload.id) s.activeProject = a.payload;
    });

    builder.addCase(partialUpdateProject.fulfilled, (s, a: PayloadAction<ProjectDTO>) => {
      const idx = s.projects.findIndex((p) => p.id === a.payload.id);
      if (idx >= 0) s.projects[idx] = a.payload;
      if (s.activeProject?.id === a.payload.id) s.activeProject = a.payload;
    });

    builder.addCase(destroyProject.fulfilled, (s, a: PayloadAction<{ id: number | string }>) => {
      s.projects = s.projects.filter((p) => p.id !== Number(a.payload.id));
      if (s.activeProject?.id === Number(a.payload.id)) s.activeProject = null;
      delete s.recommendations[a.payload.id];
      delete s.aiSuggestions[a.payload.id];
    });

    builder.addCase(recommendationsProject.pending, (s) => {
      s.status = "loading";
    });
    builder.addCase(
      recommendationsProject.fulfilled,
      (s, a: PayloadAction<CandidateRecommendationDTO[]>) => {
        s.status = "success";
        const pid = s.activeProject?.id;
        if (pid) s.recommendations[pid] = a.payload ?? [];
      }
    );
    builder.addCase(recommendationsProject.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to fetch recommendations";
    });

    builder.addCase(inviteProject.fulfilled, (s, a: PayloadAction<any>) => {
      // You can push invite into a project-invites map if you keep one
      // or refresh developer invites later.
    });

    /* ---------------- Developers ---------------- */
    builder.addCase(listDevelopers.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    builder.addCase(listDevelopers.fulfilled, (s, a: PayloadAction<DeveloperDTO[]>) => {
      s.status = "success";
      s.developers = a.payload;
    });
    builder.addCase(listDevelopers.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to load developers";
    });

    builder.addCase(createDeveloper.fulfilled, (s, a: PayloadAction<any>) => {
      s.developers.push(a.payload.body);
      s.activeDeveloper = a.payload.body;
    });

    builder.addCase(createDeveloperWithResume.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    builder.addCase(createDeveloperWithResume.fulfilled, (s, a: PayloadAction<any>) => {
      s.status = "success";
      s.developers.push(a.payload.body);
      s.activeDeveloper = a.payload.body;
    });
    builder.addCase(createDeveloperWithResume.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to create developer";
    });

    builder.addCase(retrieveDeveloper.fulfilled, (s, a: PayloadAction<DeveloperDTO>) => {
      s.activeDeveloper = a.payload;
      const idx = s.developers.findIndex((d) => d.id === a.payload.id);
      if (idx >= 0) s.developers[idx] = a.payload;
    });

    builder.addCase(updateDeveloper.fulfilled, (s, a: PayloadAction<DeveloperDTO>) => {
      const idx = s.developers.findIndex((d) => d.id === a.payload.id);
      if (idx >= 0) s.developers[idx] = a.payload;
      if (s.activeDeveloper?.id === a.payload.id) s.activeDeveloper = a.payload;
    });

    builder.addCase(partialUpdateDeveloper.fulfilled, (s, a: PayloadAction<DeveloperDTO>) => {
      const idx = s.developers.findIndex((d) => d.id === a.payload.id);
      if (idx >= 0) s.developers[idx] = a.payload;
      if (s.activeDeveloper?.id === a.payload.id) s.activeDeveloper = a.payload;
    });

    builder.addCase(destroyDeveloper.fulfilled, (s, a: PayloadAction<{ id: number | string }>) => {
      s.developers = s.developers.filter((d) => d.id !== Number(a.payload.id));
      if (s.activeDeveloper?.id === Number(a.payload.id)) s.activeDeveloper = null;
      delete s.invites[a.payload.id];
    });

    builder.addCase(developerInvites.pending, (s) => {
      s.status = "loading";
    });
    builder.addCase(developerInvites.fulfilled, (s, a: PayloadAction<InvitationDTO[]>) => {
      s.status = "success";
      const devId = s.activeDeveloper?.id;
      if (devId) s.invites[devId] = a.payload ?? [];
    });
    builder.addCase(developerInvites.rejected, (s, a) => {
      s.status = "error";
      s.error = (a.payload as any)?.message ?? "Failed to fetch invites";
    });

    builder.addCase(acceptInvite.fulfilled, (s) => {
      // you can optimistically patch s.invites[devId] status to Accepted
    });
    builder.addCase(declineInvite.fulfilled, (s) => {
      // update to Declined similarly
    });

    builder.addCase(submitChallenge.fulfilled, (s) => {
      // challenge submission result can be handled here if needed
    });

    builder.addCase(fetchSubmissions.fulfilled, (s, a: PayloadAction<SubmissionDTO[]>) => {
      s.status = "success";
      s.submissions = a.payload;
    });
  },
});

export const { resetHireMeState } = hiremeSlice.actions;
export default hiremeSlice.reducer;
