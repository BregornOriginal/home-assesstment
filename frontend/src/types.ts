export type DocumentStatus = "pending" | "in_review" | "approved" | "rejected";
export type DocumentPriority = "low" | "medium" | "high";

export interface Document {
  id: string;
  title: string;
  submitter_name: string;
  category: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  created_at: string;
  summary: string;
}

export interface CreateDocumentPayload {
  title: string;
  submitter_name: string;
  category: string;
  priority: DocumentPriority;
  summary: string;
}

export interface UpdateDocumentPayload {
  status: DocumentStatus;
}

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const PRIORITY_LABELS: Record<DocumentPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const ALL_STATUSES: DocumentStatus[] = [
  "pending",
  "in_review",
  "approved",
  "rejected",
];

export const ALL_PRIORITIES: DocumentPriority[] = ["low", "medium", "high"];
