// colorUtils.ts
// Default colors for charts based on the images provided
export const DEFAULT_COLORS = ['#0000FF', '#FFA500', '#008000', '#FF0000', '#800080'];

// Specific colors for the salary bar chart (matching the first image)
export const SALARY_CHART_COLORS: Record<string, string> = {
  'Manager': '#0000FF',       // Blue for Manager 
  'Assistant Manager': '#FFA500', // Orange for Assistant Manager
  'Part-timer': '#008000'     // Green for Part-timer
};

export const getDefaultColor = (index: number): string => {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};
