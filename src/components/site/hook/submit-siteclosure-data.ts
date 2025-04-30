import { useState } from "react";
import { BUCKET_NAME_SITE_CLOSURE, supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { userInfo } from "os";

// Define interfaces to match the database schema
interface SiteClosureData {
  site_id: string;
  remark: string;
  close_start: string | null;
  close_end: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  session: string | null;
  status: number | null;
  start_time: string | null;
  end_time: string | null;
  requester_id: string | null;
  duration: number | null; // Added duration field
  request_datetime: string | null; // Added request_datetime field
}

// Add a new interface for the attachment data
interface SiteClosureAttachmentData {
  site_closure_id: number;
  file_path: string[] | string;  // Support both string[] and string for flexibility
}

export const useInsertSiteClosureData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const insertSiteClosureData = async (closureData: any, selectedFiles: File[] | File | null, siteCode: string) => {
    setLoading(true);
    try {
      // Exclude affectArea from closureData
      const { affectArea, ...dataToInsert } = closureData;
      
      // Calculate duration in days
      let duration: number | null = null;
      if (dataToInsert.close_start && dataToInsert.close_end) {
        // Create Date objects for start and end dates with their respective times
        const startDateTime = new Date(
          `${dataToInsert.close_start}T${dataToInsert.start_time || '00:00:00'}`
        );
        const endDateTime = new Date(
          `${dataToInsert.close_end}T${dataToInsert.end_time || '00:00:00'}`
        );
        
        // Calculate difference in milliseconds
        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        console.log("Duration in milliseconds:", diffMs);
        
        // Convert to days (as a float)
        duration = diffMs / (1000 * 60 * 60 * 24);
      }
      
      // Only add requester_id and request_datetime when status is 2 (submit)
      // For drafts (status 1), leave them as null
      const isSubmitting = dataToInsert.status === "2";
      const currentDateTime = isSubmitting ? new Date().toISOString() : null;
      const requesterId = isSubmitting ? user?.id : null;
      
      // Clean up data before insertion to prevent database errors
      const cleanedData = {
        site_id: dataToInsert.site_id || "",
        remark: dataToInsert.remark || "",
        close_start: dataToInsert.close_start || null,
        close_end: dataToInsert.close_end || null,
        
        // Handle numeric fields - convert empty strings/invalid values to null
        category_id: dataToInsert.category_id ? parseInt(dataToInsert.category_id, 10) || null : null,
        subcategory_id: dataToInsert.subcategory_id ? parseInt(dataToInsert.subcategory_id, 10) || null : null,
        
        // Keep session as string
        session: dataToInsert.session || null,
        status: dataToInsert.status ? parseInt(dataToInsert.status, 10) || null : null,
        
        // Time fields
        start_time: dataToInsert.start_time || null,
        end_time: dataToInsert.end_time || null,
        
        // Only add requester_id for actual submissions (status 2)
        requester_id: requesterId,
        
        // Add calculated duration
        duration: duration,
        
        // Only add request_datetime for actual submissions (status 2)
        request_datetime: currentDateTime,
      };

      // console.log("Cleaned data for submission:", cleanedData);

      // Step 1: Insert closure data into the database - wrap cleanedData in array
      const { data: insertedClosure, error: closureError } = await supabase
        .from("nd_site_closure")
        .insert([cleanedData as any]) // Wrapping in array and using type assertion
        .select("id")
        .single();

      if (closureError) {
        console.error("Error inserting site closure data:", closureError);
        throw new Error(`Failed to insert site closure data: ${closureError.message}`);
      }

      if (!insertedClosure?.id) {
        throw new Error("Failed to get inserted closure ID");
      }

      const closureId = insertedClosure.id;
      // console.log("Inserted closure ID:", closureId);

      // Step 2: Insert affect areas into the bridge table
      if (affectArea && Array.isArray(affectArea) && affectArea.length > 0) {
        try {
          const affectAreaData = affectArea.map((areaId: string) => ({
            site_closure_id: closureId,
            site_affect_area: parseInt(areaId, 10) || null,
          })).filter(item => item.site_affect_area !== null);

          if (affectAreaData.length > 0) {
            const { error: affectAreaError } = await supabase
              .from("nd_site_closure_affect_area")
              .insert(affectAreaData);

            if (affectAreaError) {
              console.error("Error inserting affect areas:", affectAreaError);
              // Continue execution instead of throwing error
            }
          }
        } catch (affectAreaErr) {
          console.error("Error processing affect areas:", affectAreaErr);
          // Continue execution
        }
      }

      // Step 3: Upload files to Supabase Storage if files are selected
      const filesToUpload = selectedFiles 
        ? Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles] 
        : [];
      
      if (filesToUpload.length > 0) {
        try {
          // Create an array to hold all file paths
          const filePaths: string[] = [];
          
          // Process each file
          for (let fileIndex = 0; fileIndex < filesToUpload.length; fileIndex++) {
            const file = filesToUpload[fileIndex];
            const originalFilename = file.name; // Store original filename
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const fileName = `${siteCode}_${closureId}_${Date.now()}_${fileIndex}_${originalFilename}`;
            const filePath = `site-closure/${siteCode}/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
              .from(BUCKET_NAME_SITE_CLOSURE)
              .upload(filePath, file);

            if (uploadError) {
              console.error(`Error uploading file ${file.name}:`, uploadError);
            } else {
              // Store the path without SUPABASE_URL, will add it when displaying
              const storagePath = `/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/${filePath}`;
              filePaths.push(storagePath);
            }
          }
          
          // console.log("Uploaded file paths:", filePaths);
          if (filePaths.length > 0) {
            const attachmentData: SiteClosureAttachmentData = {
              site_closure_id: closureId,
              file_path: filePaths
            };
            
            const { error: attachmentError } = await supabase
              .from("nd_site_closure_attachment")
              .insert([attachmentData] as any);

            if (attachmentError) {
              console.error("Error inserting attachments:", attachmentError);
            }
          }
        } catch (fileErr) {
          console.error("Error handling file uploads:", fileErr);
        }
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error inserting site closure data:", error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { insertSiteClosureData, loading, error };
};
