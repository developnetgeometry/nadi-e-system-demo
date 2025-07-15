import { UseFormReturn } from "react-hook-form";
import { SiteFormData } from "../schemas/schema";
import { Site } from "@/types/site";

interface SiteImage {
  id: number;
  site_profile_id: string | number;
  file_url: string;
  file_urls?: string[];
}

// Base props for all tab components using React Hook Form
export interface SiteFormTabProps {
  form: UseFormReturn<SiteFormData>;
}

// Extended props for BasicInfoTab
export interface BasicInfoTabProps extends SiteFormTabProps {
  isSuperAdmin: boolean;
}

// Extended props for LocationTab
export interface LocationTabProps extends SiteFormTabProps {}

// Extended props for SiteImagesTab (self-contained)
export interface SiteImagesTabProps {
  site?: Site | null;
  open: boolean;
  onImagesChange: (selectedFiles: File[], imagesToDelete: string[], siteImages: SiteImage[]) => void;
}
