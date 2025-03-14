
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
}).refine((data) => {
  // If the type is TP, parent_id is required
  if (data.type === "tp") {
    return data.parent_id !== null && data.parent_id !== "";
  }
  return true;
}, {
  message: "Parent organization is required for Technology Partners",
  path: ["parent_id"],
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
