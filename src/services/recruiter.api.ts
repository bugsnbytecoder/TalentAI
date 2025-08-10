// services/recruiter.api.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axios-instance";

/** ---------- Types (lightweight) ---------- */
export type ProjectSkillIn = { name: string; required_level: number };
export type ProjectDTO = {
  id?: number;
  project_name: string;
  description?: string;
  status?: "draft" | "matching" | "challenging" | "closed";
  automation_enabled?: boolean;
  created_at?: string;
  target_count?: number;
  required_skills?: ProjectSkillIn[]; // for POST/PUT
};

export type DeveloperLite = {
  id: number;
  full_name: string;
  dev_score: number;
  validation_status?: string;
  availability?: string;
  skills?: any[];
};

export type CandidateRecommendationDTO = {
  id?: number;
  project?: number;
  developer?: DeveloperLite;
  developer_id?: number;
  fit_score: number; // 0-100
  rationale?: string;
  created_at?: string;
};

export type InvitationPayload = {
  projectId: number;
  developerId: number | string;
  challengeId?: number;
  message?: string;
};

/** ---------- Helpers ---------- */
function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Some endpoints may return either raw arrays OR {success, body}.
// Normalize to the useful payload.
function unwrap<T = any>(data: any): T {
  if (data && typeof data === "object" && "success" in data) {
    // your create_response wrapper
    return (data.body ?? data) as T;
  }
  return data as T;
}

/** ---------- Thunks ---------- */

// GET /api/Recruiter/projects/
export const listProjects = createAsyncThunk("recruiter/listProjects", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/api/Recruiter/projects/`, { headers: authHeaders() });
    const payload = unwrap<ProjectDTO[] | any>(res.data);
    // If wrapper, sometimes body may be array; if not, res.data is array.
    const projects: ProjectDTO[] = Array.isArray(payload?.projects) ? payload.projects : Array.isArray(payload) ? payload : [];
    return projects;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data ?? "Failed to load projects");
  }
});

// POST /api/Recruiter/projects/
export const createProject = createAsyncThunk(
  "recruiter/createProject",
  async (project: Omit<ProjectDTO, "id">, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/Recruiter/projects/`, project, { headers: authHeaders() });
      const payload = unwrap<any>(res.data);
      // Your backend returns { success, body: { project, recommendations, ai_suggestions } }
      // Fallback to direct model if not wrapped.
      const createdProject: ProjectDTO =
        payload?.project ?? payload; // if not wrapped, payload is the Project
      const recommendations: CandidateRecommendationDTO[] = payload?.recommendations ?? [];
      return { project: createdProject, recommendations };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? "Failed to create project");
    }
  }
);

// GET /api/Recruiter/projects/{id}/recommendations/
export const fetchRecommendations = createAsyncThunk(
  "recruiter/fetchRecommendations",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/Recruiter/projects/${projectId}/recommendations/`, {
        headers: authHeaders(),
      });
      const payload = unwrap<CandidateRecommendationDTO[] | any>(res.data);
      const list: CandidateRecommendationDTO[] = Array.isArray(payload) ? payload : payload?.recommendations ?? [];
      return { projectId, recommendations: list };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? "Failed to load recommendations");
    }
  }
);

// POST /api/Recruiter/projects/{id}/invite/
export const inviteToProject = createAsyncThunk(
  "recruiter/inviteToProject",
  async ({ projectId, developerId, message, challengeId }: InvitationPayload, { rejectWithValue }) => {
    try {
      const body: any = { developer_id: developerId, message };
      if (challengeId) body.challenge_id = challengeId;

      const res = await axiosInstance.post(`/api/Recruiter/projects/${projectId}/invite/`, body, {
        headers: authHeaders(),
      });
      const invitation = unwrap<any>(res.data); // DRF serializer for Invitation
      return { projectId, invitation };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? "Failed to send invite");
    }
  }
);
