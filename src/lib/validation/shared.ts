import { z } from "zod";

// Checkbox inputs only submit a value ("on") when checked, and are absent from
// FormData entirely when unchecked — this normalizes both cases to a boolean.
export const checkboxField = z.preprocess((value) => value === "on", z.boolean());

export const slugField = z
  .string()
  .min(2, { error: "Slug must be at least 2 characters." })
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    error: "Use lowercase letters, numbers, and hyphens only (e.g. bsc-software-engineering).",
  });

export const optionalUrlField = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined));

export const optionalTextField = z
  .string()
  .optional()
  .transform((value) => (value && value.trim() ? value.trim() : undefined));

// A textarea where each non-empty line becomes one bullet point, stored as a JSON string[].
export const bulletListField = z
  .string()
  .optional()
  .transform((value) =>
    value
      ? value
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [],
  );
