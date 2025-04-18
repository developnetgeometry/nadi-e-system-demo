import { useState } from "react";
import { BUCKET_NAME_SITE_CLOSURE, supabase, SUPABASE_URL } from "@/integrations/supabase/client";


export const useInsertSiteClosureData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertSiteClosureData = async (closureData: any, selectedFile: File | null, siteCode: string) => {
    setLoading(true);
    try {

      // Step 1: Insert closure data into the database
      const { data: insertedClosure, error: closureError } = await supabase
        .from("nd_site_closure")
        .insert([closureData])
        .select("id")
        .single();

      if (closureError || !insertedClosure?.id) {
        throw new Error("Failed to insert site closure data.");
      }

      const closureId = insertedClosure.id;
      console.log("Inserted closure ID:", closureId);

      // Step 2: Upload file to Supabase Storage if a file is selected
      if (selectedFile) {

        const fileName = `${siteCode}_${Date.now()}.pdf`;
        const filePath = `site-closure/${siteCode}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME_SITE_CLOSURE)
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Step 3: Get the public URL of the uploaded file
        // const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/${filePath}`;
        // const publicUrl = `/storage/v1/object/public/${BUCKET_NAME_SITE_CLOSURE}/${filePath}`;

        // Step 4: Insert into nd_site_closure_attachment
        // const { error: attachmentError } = await supabase
        //   .from("nd_site_closure_attachment")
        //   .insert([{ 
        //     // site_closure_id: closureId, 
        //     file_path: publicUrl 
        //   }]);

        // if (attachmentError) throw attachmentError;
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.log("Error inserting site closure data:", error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return { insertSiteClosureData, loading, error };
};
