import { saveAs } from "file-saver";

/**
 * Utility function to export database content as SQL file
 * @param filename The name to save the file as
 * @param content The SQL content to save
 */
export const downloadSqlBackup = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "application/sql" });
  saveAs(blob, filename);
};

/**
 * Format size in bytes to human-readable format
 * @param bytes Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Get status of a backup request
 * @param requestId The backup request ID
 * @returns Promise resolving to the current status
 */
export const checkBackupStatus = async (requestId: string) => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase
    .from("backup_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
