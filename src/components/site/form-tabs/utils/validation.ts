import { FieldErrors } from "react-hook-form";
import { SiteFormData } from "../schemas/schema";

/**
 * Helper function to check if a specific tab has validation errors
 * @param tabName - The name of the tab to check
 * @param errors - Form validation errors from react-hook-form
 * @returns boolean indicating if the tab has errors
 */
export const hasTabErrors = (tabName: string, errors: FieldErrors<SiteFormData>): boolean => {
  switch (tabName) {
    case "basic-info":
      return !!(
        errors.code ||
        errors.name ||
        errors.phase ||
        errors.status ||
        errors.email ||
        errors.dusp_tp_id
      );
    
    case "location":
      return !!(
        errors.address ||
        errors.city ||
        errors.postCode ||
        errors.state ||
        errors.coordinates ||
        errors.longitude ||
        errors.latitude ||
        errors.district
      );
    
    case "building":
      return !!(
        errors.building_type ||
        errors.building_area ||
        errors.building_rental ||
        errors.zone ||
        errors.category_area ||
        errors.building_level ||
        errors.oku
      );
    
    case "connectivity":
      return !!(
        errors.technology ||
        errors.bandwidth
      );
    
    case "facilities":
      return !!(
        errors.socio_economic ||
        errors.space
      );
    
    default:
      return false;
  }
};

/**
 * Helper function to find the first tab that contains validation errors
 * @param errors - Form validation errors from react-hook-form
 * @returns string representing the tab name with the first error
 */
export const getFirstTabWithError = (errors: FieldErrors<SiteFormData>): string => {
  // Basic Info tab fields - highest priority
  if (
    errors.code ||
    errors.name ||
    errors.phase ||
    errors.status ||
    errors.email ||
    errors.dusp_tp_id
  ) {
    return "basic-info";
  }
  
  // Location tab fields - second priority
  if (
    errors.address ||
    errors.city ||
    errors.postCode ||
    errors.state ||
    errors.coordinates ||
    errors.longitude ||
    errors.latitude ||
    errors.district
  ) {
    return "location";
  }
  
  // Building tab fields - third priority
  if (
    errors.building_type ||
    errors.building_area ||
    errors.building_rental ||
    errors.zone ||
    errors.category_area ||
    errors.building_level ||
    errors.oku
  ) {
    return "building";
  }
  
  // Connectivity tab fields - fourth priority
  if (errors.technology || errors.bandwidth) {
    return "connectivity";
  }
  
  // Facilities tab fields - fifth priority
  if (errors.socio_economic || errors.space) {
    return "facilities";
  }
  
  // Default fallback to basic-info if no specific errors found
  return "basic-info";
};

/**
 * Tab error checking configuration
 * Maps tab names to their respective field names for easier maintenance
 */
export const TAB_FIELD_MAPPING = {
  "basic-info": [
    "code",
    "name", 
    "phase",
    "status",
    "email",
    "dusp_tp_id"
  ] as const,
  
  "location": [
    "address",
    "city",
    "postCode", 
    "state",
    "coordinates",
    "longitude",
    "latitude",
    "district"
  ] as const,
  
  "building": [
    "building_type",
    "building_area",
    "building_rental",
    "zone",
    "category_area", 
    "building_level",
    "oku"
  ] as const,
  
  "connectivity": [
    "technology",
    "bandwidth"
  ] as const,
  
  "facilities": [
    "socio_economic",
    "space"
  ] as const,
} as const;

/**
 * Alternative implementation using the mapping configuration
 * This provides a more maintainable approach for future field additions
 */
export const hasTabErrorsFromMapping = (
  tabName: keyof typeof TAB_FIELD_MAPPING,
  errors: FieldErrors<SiteFormData>
): boolean => {
  const fields = TAB_FIELD_MAPPING[tabName];
  return fields.some(field => errors[field]);
};

/**
 * Get all tabs that currently have validation errors
 * @param errors - Form validation errors from react-hook-form
 * @returns Array of tab names that have errors
 */
export const getTabsWithErrors = (errors: FieldErrors<SiteFormData>): string[] => {
  const tabsWithErrors: string[] = [];
  
  Object.keys(TAB_FIELD_MAPPING).forEach(tabName => {
    if (hasTabErrors(tabName, errors)) {
      tabsWithErrors.push(tabName);
    }
  });
  
  return tabsWithErrors;
};
