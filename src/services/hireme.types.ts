/* ==== OpenAPI-derived types (simplified + optional helpers) ==== */

export type ExperienceLevel = "junior" | "mid" | "senior" | "lead" | "principal";
export type Availability = "available" | "open_to_offers" | "not_available";

export interface ProjectSkillDTO {
  id?: number;
  name: string;
  required_level?: number; // default 70
}

export type ProjectStatus = "draft" | "matching" | "challenging" | "closed";

export interface ProjectDTO {
  id?: number;
  project_name: string;
  description?: string;
  status?: ProjectStatus;
  automation_enabled?: boolean;
  created_at?: string;
  target_count?: number;
  required_skills: ProjectSkillDTO[];
}

export interface ChallengeDTO {
  id?: number;
  name: string;
  description?: string;
  difficulty: string;
  time_limit: number;
  challenge_type: string;
  max_score: number;
  challenge_question: string;
}

export interface SkillDTO {
  id?: number;
  name: string;
  level: number;
  validated: boolean;
  challenge?: ChallengeDTO;
}

export interface DeveloperDTO {
  id?: number;
  full_name: string;
  email: string;
  bio?: string;
  location?: string;
  experience_level?: ExperienceLevel;
  availability?: Availability;
  resume?: string | null; // NOTE: in create_developer we send PDF -> text base64 server-side
  dev_score?: number;
  validation_status?: string;
  portfolio_links?: Record<string, any> | null;
  skills?: SkillDTO[]; // backend returns ids for this field
}

/* Responses returned by your custom endpoints (as described earlier) */
export interface ProjectCreateResponse {
  success: boolean;
  message: string;
  body: {
    project: ProjectDTO;
    recommendations: CandidateRecommendationDTO[];
    ai_suggestions?: any;
  };
}

export interface CandidateRecommendationDTO {
  id?: number;
  fit_score: number;
  rationale?: string;
  created_at?: string;
  developer: DeveloperDTO;
  project?: number;
}

export interface InvitationDTO {
  id?: number;
  project: number;
  developer: DeveloperDTO;
  challenge?: any; // keep loose for now
  status: "Sent" | "Accepted" | "Declined" | "Expired" | "Completed" | string;
  message?: string;
  sent_at?: string;
  responded_at?: string | null;
}

/* payloads */

export interface CreateProjectPayload {
  project_name: string;
  description?: string;
  automation_enabled?: boolean;
  required_skills: { name: string; required_level?: number }[];
}

export interface InvitePayload {
  developer_id: number;
  challenge_id?: number;
  message?: string;
}

export interface CreateDeveloperFormPayload {
  full_name: string;
  email: string;
  bio?: string;
  location?: string;
  experience_level?: ExperienceLevel;
  availability?: Availability;
  portfolio_links?: Record<string, any>;
  resumeFile: File; // PDF
}

export interface SubmitChallengePayload {
  developer: number;
  challenge: number;
  bug_analysis?: string;
  answer?: string;
}

export interface SubmissionDTO {
  developer: number;
  challenge: number;
  bug_analysis: string;
  answer: string;
  score: number | null;
  accuracy_rate: number | null;
  bugs_found: number | null;
  bugs_missed: number | null;
  false_positives: number | null;
  status: string;
  ai_feedback: string;
  evaluation_details: any;
  created_at: string;
}