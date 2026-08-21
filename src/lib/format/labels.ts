import type { TeamCategory, ApplicationStatus, AdminRole } from "@/generated/prisma/enums";

export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  BOARD_OF_GOVERNORS: "Board of Governors",
  ACADEMIC_BOARD: "Academic Board",
  INTERNATIONAL_REPRESENTATIVE: "International Representatives",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  ADMIN: "Administrator",
  ADMISSIONS_OFFICER: "Admissions Officer",
};
