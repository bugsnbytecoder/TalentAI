import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axios-instance";
import {
  ProjectDTO,
  DeveloperDTO,
  ProjectCreateResponse,
  CreateProjectPayload,
  CandidateRecommendationDTO,
  InvitationDTO,
  InvitePayload,
  CreateDeveloperFormPayload,
  SubmitChallengePayload,
  ChallengeDTO,
  SubmissionDTO,
} from "./hireme.types";

/* ------------------ Helpers ------------------ */
const toFormData = (payload: CreateDeveloperFormPayload): FormData => {
  const fd = new FormData();
  fd.append("full_name", payload.full_name);
  fd.append("email", payload.email);
  if (payload.bio) fd.append("bio", payload.bio);
  if (payload.location) fd.append("location", payload.location);
  if (payload.experience_level) fd.append("experience_level", payload.experience_level);
  if (payload.availability) fd.append("availability", payload.availability);
  if (payload.portfolio_links)
    fd.append("portfolio_links", JSON.stringify(payload.portfolio_links));
  fd.append("resume", payload.resumeFile); // the backend will extract text
  return fd;
};

/* =========================================================
   Recruiter — Projects
   ========================================================= */

// GET /api/Recruiter/projects/
export const listProjects = createAsyncThunk<ProjectDTO[]>(
  "hireme/listProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<ProjectDTO[]>("/api/Recruiter/projects/");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to fetch projects");
    }
  }
);

// POST /api/Recruiter/projects/  (returns augmented response in your backend)
export const createProject = createAsyncThunk<ProjectCreateResponse, CreateProjectPayload>(
  "hireme/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<ProjectCreateResponse>(
        "/api/Recruiter/projects/",
        payload
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to create project");
    }
  }
);

// GET /api/Recruiter/projects/{id}/
export const retrieveProject = createAsyncThunk<ProjectDTO, number | string>(
  "hireme/retrieveProject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<ProjectDTO>(`/api/Recruiter/projects/${id}/`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to retrieve project");
    }
  }
);

// PUT /api/Recruiter/projects/{id}/
export const updateProject = createAsyncThunk<ProjectDTO, ProjectDTO>(
  "hireme/updateProject",
  async (project, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put<ProjectDTO>(
        `/api/Recruiter/projects/${project.id}/`,
        project
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to update project");
    }
  }
);

// PATCH /api/Recruiter/projects/{id}/
export const partialUpdateProject = createAsyncThunk<ProjectDTO, { id: number | string; patch: Partial<ProjectDTO> }>(
  "hireme/partialUpdateProject",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch<ProjectDTO>(
        `/api/Recruiter/projects/${id}/`,
        patch
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to patch project");
    }
  }
);

// DELETE /api/Recruiter/projects/{id}/
export const destroyProject = createAsyncThunk<{ id: number | string }, number | string>(
  "hireme/destroyProject",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/Recruiter/projects/${id}/`);
      return { id };
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to delete project");
    }
  }
);

// GET /api/Recruiter/projects/{id}/recommendations/
export const recommendationsProject = createAsyncThunk<CandidateRecommendationDTO[], number | string>(
  "hireme/recommendationsProject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<CandidateRecommendationDTO[]>(
        `/api/Recruiter/projects/${id}/recommendations/`
      );
      return res.data as any; // backend returns array of CandidateRecommendation via serializer
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to load recommendations");
    }
  }
);

// POST /api/Recruiter/projects/{id}/invite/
export const inviteProject = createAsyncThunk<InvitationDTO, { id: number | string; data: InvitePayload }>(
  "hireme/inviteProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<InvitationDTO>(
        `/api/Recruiter/projects/${id}/invite/`,
        data
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to invite developer");
    }
  }
);

/* =========================================================
   HireMe — Developers
   ========================================================= */

// GET /api/HireMe/developers/
export const listDevelopers = createAsyncThunk<DeveloperDTO[]>(
  "hireme/listDevelopers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<DeveloperDTO[]>("/api/HireMe/developers/");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to fetch developers");
    }
  }
);

// POST /api/HireMe/developers/
export const createDeveloper = createAsyncThunk<DeveloperDTO, DeveloperDTO>(
  "hireme/createDeveloper",
  async (developer, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<DeveloperDTO>("/api/HireMe/developers/", developer);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to create developer");
    }
  }
);

// GET /api/HireMe/developers/{id}/
export const retrieveDeveloper = createAsyncThunk<DeveloperDTO, number | string>(
  "hireme/retrieveDeveloper",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<DeveloperDTO>(`/api/HireMe/developers/${id}/`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to retrieve developer");
    }
  }
);

// PUT /api/HireMe/developers/{id}/
export const updateDeveloper = createAsyncThunk<DeveloperDTO, DeveloperDTO>(
  "hireme/updateDeveloper",
  async (developer, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put<DeveloperDTO>(
        `/api/HireMe/developers/${developer.id}/`,
        developer
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to update developer");
    }
  }
);

// PATCH /api/HireMe/developers/{id}/
export const partialUpdateDeveloper = createAsyncThunk<
  DeveloperDTO,
  { id: number | string; patch: Partial<DeveloperDTO> }
>("hireme/partialUpdateDeveloper", async ({ id, patch }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.patch<DeveloperDTO>(
      `/api/HireMe/developers/${id}/`,
      patch
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Failed to patch developer");
  }
});

// DELETE /api/HireMe/developers/{id}/
export const destroyDeveloper = createAsyncThunk<{ id: number | string }, number | string>(
  "hireme/destroyDeveloper",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/HireMe/developers/${id}/`);
      return { id };
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to delete developer");
    }
  }
);

// GET /api/HireMe/developers/{id}/invites/
export const developerInvites = createAsyncThunk<InvitationDTO[], number | string>(
  "hireme/developerInvites",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<InvitationDTO[]>(
        `/api/HireMe/developers/${id}/invites/`
      );
      return res.data as any; // serializer returns list of invitations with nested developer/challenge
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to fetch invites");
    }
  }
);

// POST /api/HireMe/developers/create_developer/  (multipart/form-data)
export const createDeveloperWithResume = createAsyncThunk<DeveloperDTO, CreateDeveloperFormPayload>(
  "hireme/createDeveloperWithResume",
  async (payload, { rejectWithValue }) => {
    try {
      const fd = toFormData(payload);
      const res = await axiosInstance.post<DeveloperDTO>(
        `/api/HireMe/developers/create_developer/`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to create developer with resume");
    }
  }
);

// POST /api/HireMe/developers/submit_challenge/
export const submitChallenge = createAsyncThunk<any, SubmitChallengePayload>(
  "hireme/submitChallenge",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/HireMe/developers/submit_challenge/`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to submit challenge");
    }
  }
);

export const fetchSubmissions = createAsyncThunk<SubmissionDTO[], void>(
  "hireme/fetchSubmissions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<SubmissionDTO[]>("/api/HireMe/developers/fetch_submissions/");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to fetch challenges");
    }
  }
);

// POST /api/HireMe/developers/{id}/accept_invite/
export const acceptInvite = createAsyncThunk<any, { id: number | string; invitation_id: number }>(
  "hireme/acceptInvite",
  async ({ id, invitation_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/HireMe/developers/${id}/accept_invite/`, {
        invitation_id,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to accept invite");
    }
  }
);

// POST /api/HireMe/developers/{id}/decline_invite/
export const declineInvite = createAsyncThunk<any, { id: number | string; invitation_id: number }>(
  "hireme/declineInvite",
  async ({ id, invitation_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/HireMe/developers/${id}/decline_invite/`, {
        invitation_id,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? "Failed to decline invite");
    }
  }
);
