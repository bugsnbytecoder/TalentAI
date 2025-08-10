// services/recruiter.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProjectDTO, CandidateRecommendationDTO } from "./recruiter.api";
import { listProjects, createProject, fetchRecommendations, inviteToProject } from "./recruiter.api";

type Status = "idle" | "loading" | "succeeded" | "failed";

export interface RecruiterState {
  status: Status;
  creating: boolean;
  error: string | null;
  projects: ProjectDTO[];
  // per-project recs cache
  recommendationsByProject: Record<number, CandidateRecommendationDTO[]>;
  // optional last invitation result
  lastInvitation?: any | null;
}

const initialState: RecruiterState = {
  status: "idle",
  creating: false,
  error: null,
  projects: [],
  recommendationsByProject: {},
  lastInvitation: null,
};

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,
  reducers: {
    resetRecruiterState: () => initialState,
  },
  extraReducers: (builder) => {
    /** listProjects */
    builder.addCase(listProjects.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(listProjects.fulfilled, (state, action: PayloadAction<ProjectDTO[]>) => {
      state.status = "succeeded";
      state.error = null;
      state.projects = action.payload ?? [];
    });
    builder.addCase(listProjects.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as any)?.message ?? "Failed to load projects";
    });

    /** createProject */
    builder.addCase(createProject.pending, (state) => {
      state.creating = true;
      state.error = null;
    });
    builder.addCase(
      createProject.fulfilled,
      (
        state,
        action: PayloadAction<{ project: ProjectDTO; recommendations: CandidateRecommendationDTO[] }>
      ) => {
        state.creating = false;
        const created = action.payload?.project;
        if (created?.id != null) {
          // add or replace in list
          const exists = state.projects.some((p) => p.id === created.id);
          state.projects = exists
            ? state.projects.map((p) => (p.id === created.id ? created : p))
            : [created, ...state.projects];
          // seed recs cache if provided
          if (action.payload.recommendations?.length) {
            state.recommendationsByProject[created.id] = action.payload.recommendations;
          }
        }
      }
    );
    builder.addCase(createProject.rejected, (state, action) => {
      state.creating = false;
      state.error = (action.payload as any)?.message ?? "Failed to create project";
    });

    /** fetchRecommendations */
    builder.addCase(
      fetchRecommendations.fulfilled,
      (state, action: PayloadAction<{ projectId: number; recommendations: CandidateRecommendationDTO[] }>) => {
        const { projectId, recommendations } = action.payload;
        state.recommendationsByProject[projectId] = recommendations ?? [];
      }
    );
    builder.addCase(fetchRecommendations.rejected, (state, action) => {
      state.error = (action.payload as any)?.message ?? "Failed to load recommendations";
    });

    /** inviteToProject */
    builder.addCase(inviteToProject.fulfilled, (state, action) => {
      state.lastInvitation = action.payload?.invitation ?? null;
    });
    builder.addCase(inviteToProject.rejected, (state, action) => {
      state.error = (action.payload as any)?.message ?? "Failed to send invite";
    });
  },
});

export const { resetRecruiterState } = recruiterSlice.actions;
export default recruiterSlice.reducer;
