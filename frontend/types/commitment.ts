export type Priority = "low" | "medium" | "high" | "critical";

export type Category =
  | "work"
  | "personal"
  | "health"
  | "finance"
  | "study"
  | "shopping"
  | "other";

export type Source =
  | "manual"
  | "text"
  | "voice"
  | "image"
  | "pdf";

export type Status =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Commitment {
  id: string;

  title: string;

  description: string | null;

  category: Category;

  source: Source;

  priority: Priority;

  status: Status;

  deadline: string | null;

  estimated_duration: number | null;

  ai_confidence: number | null;

  is_ai_generated: boolean;

  created_at: string;

  updated_at: string;
}