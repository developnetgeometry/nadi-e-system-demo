
import * as z from "zod";

/**
 * Schema for validating organization form data
 */
export const organizationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["dusp", "tp"] as const),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  parent_id: z.string().optional().nullable().transform(val => val === "null" ? null : val),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
