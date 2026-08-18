import type { TeamCategory } from "@/generated/prisma/enums";

export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  BOARD_OF_GOVERNORS: "Board of Governors",
  ACADEMIC_BOARD: "Academic Board",
  INTERNATIONAL_REPRESENTATIVE: "International Representatives",
};
