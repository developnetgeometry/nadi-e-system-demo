import { z } from "zod";

// Define the form schema using Zod
export const siteFormSchema = z.object({
  // Basic Info
  code: z.string().min(1, "Site code is required"),
  name: z.string().min(1, "Site name is required"),
  phase: z.string().min(1, "Phase is required"),
  region: z.string().optional(),
  parliament: z.string().optional(),
  dun: z.string().optional(),
  mukim: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().optional(),
  website_last_updated: z.string().optional(),
  is_mini: z.boolean().default(false),
  status: z.string().min(1, "Site status is required"),
  dusp_tp_id: z.string().optional(),

  // Location
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postCode: z.string().min(1, "Postcode is required"),
  district: z.string().optional(),
  state: z.string().min(1, "State is required"),
  coordinates: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const coords = val.split(",").map(coord => coord.trim());
      return coords.length === 2 && 
             !isNaN(Number(coords[0])) && 
             !isNaN(Number(coords[1]));
    }, "Invalid coordinate format. Please use 'longitude, latitude' with valid numbers."),
  longitude: z.string().optional(),
  latitude: z.string().optional(),

  // Building
  building_type: z.string().min(1, "Building type is required"),
  building_area: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Building area must be a valid number"),
  building_rental: z.boolean().default(false),
  zone: z.string().optional(),
  category_area: z.string().optional(),
  building_level: z.string().optional(),
  oku: z.boolean().default(false),

  // Connectivity
  technology: z.string().min(1, "Internet technology is required"),
  bandwidth: z.string().optional(),

  // Facilities
  socio_economic: z.array(z.string()).default([]),
  space: z.array(z.string()).default([]),

  // Additional
  operate_date: z.string().optional(),
});

export type SiteFormData = z.infer<typeof siteFormSchema>;

// Helper function to create conditional validation for super admin
export const createSiteFormSchema = (isSuperAdmin: boolean) => {
  return isSuperAdmin 
    ? siteFormSchema.extend({
        dusp_tp_id: z.string().min(1, "Organization is required"),
      })
    : siteFormSchema;
};
