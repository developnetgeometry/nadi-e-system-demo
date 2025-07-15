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

  // Images (handled separately from form but included for typing)
  selectedImageFiles: z.array(z.any()).default([]).optional(),
  imagesToDelete: z.array(z.string()).default([]).optional(),
  siteImages: z.array(z.any()).default([]).optional(),

  // Operation Hours
  operationTimes: z.array(z.object({
    day: z.string(),
    openTime: z.string(),
    closeTime: z.string(),
    isClosed: z.boolean(),
    id: z.number().optional(),
  })).default([]).refine((times) => {
    // Check if all 7 days of the week are defined
    const requiredDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const definedDays = times.map(time => time.day);
    const missingDays = requiredDays.filter(day => !definedDays.includes(day));
    return missingDays.length === 0;
  }, {
    message: "All 7 days of the week must be defined for operation hours"
  }).refine((times) => {
    // Validate each day's times
    for (const time of times) {
      if (!time.isClosed) {
        // Check if open time and close time are provided
        if (!time.openTime || !time.closeTime) {
          return false;
        }
        
        // Check if times are in valid format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time.openTime) || !timeRegex.test(time.closeTime)) {
          return false;
        }
        
        // Check if open time is before close time
        const [openHour, openMin] = time.openTime.split(':').map(Number);
        const [closeHour, closeMin] = time.closeTime.split(':').map(Number);
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;
        
        if (openMinutes >= closeMinutes) {
          return false;
        }
      }
    }
    return true;
  }, {
    message: "Invalid operation times: Open time must be before close time, and times must be in HH:MM format"
  }),
  
  // Internal state tracking
  hasLoadedOperationData: z.boolean().default(false).optional(),
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
