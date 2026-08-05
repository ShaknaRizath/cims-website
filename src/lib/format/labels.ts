import type { ProgrammeCategory, TeamCategory } from "@/generated/prisma/enums";

export const PROGRAMME_CATEGORY_LABELS: Record<ProgrammeCategory, string> = {
  ENGINEERING_TECHNOLOGY: "Engineering & Technology",
  BUSINESS_ECONOMICS: "Business & Economics",
  LAW_EDUCATION: "Law & Education",
  STUDY_ABROAD: "Study Abroad",
};

export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  BOARD_OF_GOVERNORS: "Board of Governors",
  ACADEMIC_BOARD: "Academic Board",
  INTERNATIONAL_REPRESENTATIVE: "International Representatives",
};
