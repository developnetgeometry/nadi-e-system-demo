import { useState } from "react";
import { BUCKET_NAME_SITE_CLOSURE, supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { SiteClosureAttachment } from "../types/site-closure";

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
  file_path: string[] | string | null;  // Support both string[] and string for flexibility
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
            
            // Convert to string if needed by your database schema
            const finalAttachmentData = {
              ...attachmentData,
              // Use this conversion if your database expects a JSON string
              // file_path: JSON.stringify(filePaths)
              
              // Or keep as array if your database supports arrays or JSONB
              file_path: filePaths as any // Use type assertion to bypass TypeScript error
            };
            
            const { error: attachmentError } = await supabase
              .from("nd_site_closure_attachment")
              .insert([finalAttachmentData]);

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

export const useUpdateSiteClosureData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Utility function to extract original filename part from a file path
  const extractFileNameBase = (path: string): string => {
    // Extract filename from path
    const fileName = path.split('/').pop() || '';
    
    // Extract the original filename part after all the prefixes
    // Format: ${siteCode}_${id}_${Date.now()}_${fileIndex}_${originalFilename}
    const parts = fileName.split('_');
    
    if (parts.length <= 4) return fileName; // Safety check
    
    // Skip the first 4 parts (siteCode, id, timestamp, fileIndex)
    return parts.slice(4).join('_');
  };

  // Utility function to extract path from storage URL
  const extractStoragePath = (path: string): string => {
    // Extract the bucket path from the full storage URL
    if (!path) return '';
    
    // Remove /storage/v1/object/public/BUCKET_NAME/ from the path
    const parts = path.split(`/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/`);
    if (parts.length > 1) {
      return parts[1];
    }
    
    // If not found, try to extract just the filename
    return path.split('/').pop() || '';
  };

  const updateSiteClosureData = async (closureData: any, selectedFiles: File[] | File | null, siteCode: string) => {
    setLoading(true);
    try {
      // Extract data from closureData including wasFormCleared flag
      const { 
        affectArea, 
        id, 
        existingAttachments, 
        originalAttachments, 
        wasFormCleared,  // New flag to check if form was cleared
        ...dataToUpdate 
      } = closureData;
      
      // Calculate duration similar to insert function
      let duration: number | null = null;
      if (dataToUpdate.close_start && dataToUpdate.close_end) {
        // Create Date objects for start and end dates with their respective times
        const startDateTime = new Date(
          `${dataToUpdate.close_start}T${dataToUpdate.start_time || '00:00:00'}`
        );
        const endDateTime = new Date(
          `${dataToUpdate.close_end}T${dataToUpdate.end_time || '00:00:00'}`
        );
        
        // Calculate difference in milliseconds
        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        console.log("Duration in milliseconds:", diffMs);
        
        // Convert to days (as a float)
        duration = diffMs / (1000 * 60 * 60 * 24);
      }
      
      // Status-based fields like in insert function
      const isSubmitting = dataToUpdate.status === "2";
      const currentDateTime = isSubmitting ? new Date().toISOString() : null;
      const requesterId = isSubmitting ? user?.id : null;
      
      // Clean up data similar to insert function
      const cleanedData = {
        site_id: dataToUpdate.site_id || "",
        remark: dataToUpdate.remark || "",
        close_start: dataToUpdate.close_start || null,
        close_end: dataToUpdate.close_end || null,
        
        // Handle numeric fields - convert empty strings/invalid values to null
        category_id: dataToUpdate.category_id ? parseInt(dataToUpdate.category_id, 10) || null : null,
        subcategory_id: dataToUpdate.subcategory_id ? parseInt(dataToUpdate.subcategory_id, 10) || null : null,
        
        // Keep session as string
        session: dataToUpdate.session || null,
        status: dataToUpdate.status ? parseInt(dataToUpdate.status, 10) || null : null,
        
        // Time fields
        start_time: dataToUpdate.start_time || null,
        end_time: dataToUpdate.end_time || null,
        
        // Only add requester_id for actual submissions (status 2)
        requester_id: isSubmitting ? requesterId : dataToUpdate.requester_id,
        
        // Add calculated duration
        duration: duration,
        
        // Only add request_datetime for actual submissions (status 2)
        request_datetime: isSubmitting ? currentDateTime : dataToUpdate.request_datetime,
      };

      // Update closure data
      const { error: updateError } = await supabase
        .from("nd_site_closure")
        .update(cleanedData)
        .eq("id", id);

      if (updateError) throw new Error(`Failed to update closure: ${updateError.message}`);

      // Update affect areas - first delete existing ones
      await supabase
        .from("nd_site_closure_affect_area")
        .delete()
        .eq("site_closure_id", id);
        
      // Then insert new ones if provided
      if (affectArea && Array.isArray(affectArea) && affectArea.length > 0) {
        try {
          const affectAreaData = affectArea.map((areaId: string) => ({
            site_closure_id: id,
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
      
      // IMPROVED ATTACHMENT HANDLING LOGIC
      
      // Step 1: Get existing attachment records directly from the database
      const { data: existingAttachmentRecords, error: fetchAttachmentError } = await supabase
        .from("nd_site_closure_attachment")
        .select("id, file_path")
        .eq("site_closure_id", id);
      
      if (fetchAttachmentError) {
        console.error("Error fetching existing attachments:", fetchAttachmentError);
      }
      
      // Step 2: Find files that need to be deleted
      let filesToDelete: string[] = [];
      
      if (wasFormCleared) {
        // If form was cleared, ALL original files should be deleted
        filesToDelete = [...(originalAttachments || [])];
        console.log("Form was cleared - deleting ALL files:", filesToDelete);
      } else {
        // Otherwise, only delete files removed by the user
        filesToDelete = originalAttachments 
          ? originalAttachments.filter((path: string) => !existingAttachments?.includes(path))
          : [];
        console.log("Deleting only removed files:", filesToDelete);
      }

      console.log("Files to delete:", filesToDelete);
      
      // Step 3: Delete removed files from storage if any
      if (filesToDelete.length > 0) {
        for (const filePath of filesToDelete) {
          // Extract the storage path for the file
          const storagePath = extractStoragePath(filePath);
          
          if (storagePath) {
            try {
              console.log(`Attempting to delete file: ${storagePath}`);
              const { error: deleteError } = await supabase.storage
                .from(BUCKET_NAME_SITE_CLOSURE)
                .remove([storagePath]);
                
              if (deleteError) {
                console.error(`Error deleting file ${storagePath}:`, deleteError);
              } else {
                console.log(`Successfully deleted file ${storagePath}`);
              }
            } catch (delErr) {
              console.error(`Error in delete operation for ${storagePath}:`, delErr);
            }
          }
        }
      }
      
      // Step 4: Process files to upload and update database records
      const filesToUpload = selectedFiles 
        ? Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles] 
        : [];
        
      let newlyUploadedPaths: string[] = [];
      
      // Extract file name bases from existing paths for duplicate check
      const existingFileNameBases = new Set(
        (existingAttachments || []).map(path => {
          const fileName = path.split('/').pop() || '';
          return extractFileNameBase(fileName);
        })
      );
      
      console.log("Existing file name bases:", Array.from(existingFileNameBases));
      
      if (filesToUpload.length > 0) {
        try {
          // Process each new file and check for duplicates
          for (let fileIndex = 0; fileIndex < filesToUpload.length; fileIndex++) {
            const file = filesToUpload[fileIndex];
            const originalFilename = file.name;
            
            // Check if file already exists in the collection (by original filename)
            if (existingFileNameBases.has(originalFilename)) {
              console.log(`File ${originalFilename} already exists, skipping upload`);
              continue;
            }
            
            const fileName = `${siteCode}_${id}_${Date.now()}_${fileIndex}_${originalFilename}`;
            const filePath = `site-closure/${siteCode}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from(BUCKET_NAME_SITE_CLOSURE)
              .upload(filePath, file);

            if (uploadError) {
              console.error(`Error uploading file ${file.name}:`, uploadError);
            } else {
              const storagePath = `/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/${filePath}`;
              newlyUploadedPaths.push(storagePath);
              console.log(`Uploaded new file: ${originalFilename}`);
            }
          }
        } catch (fileErr) {
          console.error("Error handling file uploads:", fileErr);
        }
      }
      
      // Step 5: Update database records with new file paths
      if (existingAttachmentRecords && existingAttachmentRecords.length > 0) {
        const attachmentRecord = existingAttachmentRecords[0] as SiteClosureAttachment;
        const recordId = attachmentRecord.id;
        
        if (wasFormCleared && !selectedFiles) {
          // If form was cleared and no new files selected,
          // set file_path to null or empty array in the database
          console.log("Clearing file_path in database record");
          const { error: updateError } = await supabase
            .from("nd_site_closure_attachment")
            .update({ file_path: null })
            .eq("id", recordId);
            
          if (updateError) {
            console.error("Error clearing attachment record:", updateError);
          }
        } else {
          // Normal update with remaining files + new uploads
          const updatedPaths = [...(existingAttachments || []), ...newlyUploadedPaths];
          
          console.log(`Updating attachment record ${recordId} with ${updatedPaths.length} paths`);
          
          const { error: updateError } = await supabase
            .from("nd_site_closure_attachment")
            .update({ 
              // Use type assertion to bypass TypeScript error
              file_path: updatedPaths.length > 0 ? (updatedPaths as any) : null 
            })
            .eq("id", recordId);
            
          if (updateError) {
            console.error("Error updating attachment record:", updateError);
          }
        }
      }
      // If no existing record but we have new files, create a new record
      else if (newlyUploadedPaths.length > 0) {
        const attachmentData = {
          site_closure_id: id,
          file_path: newlyUploadedPaths
        };
        
        const { error: insertError } = await supabase
          .from("nd_site_closure_attachment")
          .insert([attachmentData] as any);
          
        if (insertError) {
          console.error("Error creating new attachment record:", insertError);
        }
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error updating site closure:", error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { updateSiteClosureData, loading, error };
};

// Add a new hook for fetching draft data
export const useDraftClosure = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define interfaces for the draft data structure
  interface DraftAffectArea {
    site_affect_area: number;
  }

  interface DraftAttachment {
    id: number;
    file_path: string | string[];
  }

  interface DraftData {
    id: number;
    remark?: string | null;
    close_start?: string | null;
    close_end?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    category_id?: number | null;
    subcategory_id?: number | null;
    session?: string | null;
    site_id?: string | null;
    nd_site_closure_affect_area?: DraftAffectArea[] | null;
    nd_site_closure_attachment?: DraftAttachment[] | null;
    // Add other properties as needed
  }

  const fetchDraftData = async (closureId: number) => {
    setLoading(true);
    try {
      // Fetch the draft closure data first to pre-fill the form
      const { data, error } = await supabase
        .from("nd_site_closure")
        .select(`
          id,
          remark,
          close_start,
          close_end,
          start_time,
          end_time,
          category_id,
          subcategory_id,
          session,
          site_id,
          nd_site_closure_affect_area!site_closure_id(
            site_affect_area
          ),
          nd_site_closure_attachment(
            id, 
            file_path
          )
        `)
        .eq("id", closureId)
        .single();

      if (error) {
        setError(error.message);
        throw error;
      }

      console.log("Draft data fetched:", data);

      // Cast data to our DraftData interface
      const draftData = data as unknown as DraftData;

      // Handle potentially missing data safely
      let affectAreas: string[] = [];
      if (draftData.nd_site_closure_affect_area && 
          Array.isArray(draftData.nd_site_closure_affect_area)) {
        affectAreas = draftData.nd_site_closure_affect_area.map(area => 
          String(area.site_affect_area)
        );
      }

      // Process attachments if available
      const existingAttachments: string[] = [];
      if (draftData.nd_site_closure_attachment && 
          Array.isArray(draftData.nd_site_closure_attachment) &&
          draftData.nd_site_closure_attachment.length > 0) {
        
        const attachment = draftData.nd_site_closure_attachment[0]; // Get first attachment record
        
        // Handle both array and string types for file_path
        if (attachment) {
          if (Array.isArray(attachment.file_path)) {
            existingAttachments.push(...attachment.file_path);
          } else if (typeof attachment.file_path === 'string') {
            try {
              // Try to parse if it's a JSON string
              const parsed = JSON.parse(attachment.file_path);
              if (Array.isArray(parsed)) {
                existingAttachments.push(...parsed);
              } else {
                existingAttachments.push(attachment.file_path);
              }
            } catch (e) {
              // If parsing fails, treat it as a regular string
              existingAttachments.push(attachment.file_path);
            }
          }
        }
      }
      
      console.log("Processed existing attachments:", existingAttachments);

      // Create a new object instead of spreading to avoid TypeScript errors
      const formData = {
        id: draftData.id,
        remark: draftData.remark || "",
        close_start: draftData.close_start || "",
        close_end: draftData.close_end || "",
        start_time: draftData.start_time || "",
        end_time: draftData.end_time || "",
        category_id: draftData.category_id ? String(draftData.category_id) : "",
        subcategory_id: draftData.subcategory_id ? String(draftData.subcategory_id) : "",
        session: draftData.session ? String(draftData.session) : "",
        affectArea: affectAreas,
        site_id: draftData.site_id || "",
        status: "1", // Keep as draft
        existingAttachments: existingAttachments // Add existing attachments
      };

      console.log("Transformed form data:", formData);
      
      setLoading(false);
      return formData;
    } catch (err) {
      console.error("Failed to fetch draft data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
      
      // Return an empty form in case of error to avoid runtime errors
      return {
        id: closureId,
        remark: "",
        close_start: "",
        close_end: "",
        start_time: "",
        end_time: "",
        category_id: "",
        subcategory_id: "",
        session: "",
        affectArea: [],
        site_id: "",
        status: "1",
        existingAttachments: []
      };
    }
  };

  return { fetchDraftData, loading, error };
};
