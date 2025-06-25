// React Query hooks for phase management
import { supabase, SUPABASE_BUCKET_URL, BUCKET_NAME_SITE_AUDIT } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';

export interface Audit {
    id: number;
    audit_date: string;
    purpose: string;
    audit_party: string;
    rectification_status: boolean;
    file_path: string[] | null;
    remark: string | null;
    site_profile_id: {
        id: number;
        sitename: string;
        refid_tp: string;
        refid_mcmc: string;
        phase_id: {
            id: number;
            name: string;
        } | null;
    } | null;
    created_at: string;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
}

const AUDIT_KEY = 'audit';
const AUDIT_DETAILS_KEY = 'audit-details';

// Custom hook to fetch site audits

export async function fetchSiteAudit(siteProfileIds: number[]): Promise<Audit[]> {
    try {
        let query = supabase
            .from('nd_site_audit')
            .select(`
            id,
            audit_date,
            purpose,
            audit_party,
            rectification_status,
            file_path,
            remark,
            site_profile_id (
                id,
                sitename,
                refid_tp,
                refid_mcmc,
                phase_id (
                    id,
                    name
                )
            ),
            created_at,
            created_by,
            updated_at,
            updated_by
        `);

        // Apply filters for site profile IDs if provided
        if (siteProfileIds && siteProfileIds.length > 0) {
            query = query.in('site_profile_id', siteProfileIds);
        }

        // Execute the query with ordering by creation date
        const { data: audit, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching site agreement:', error);
            throw new Error(error.message);
        }

        // Update file paths with full URLs
        const updatedFilePath = (audit || []).map((data) => ({
            ...data,
            file_path: Array.isArray(data.file_path)
                ? data.file_path.map((path: string) =>
                    path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_AUDIT}/${path}`
                )
                : data.file_path
        }));

        return updatedFilePath as Audit[];
    } catch (error: any) {
        console.error('Error in fetchSiteAudit:', error);
        throw new Error('Failed to fetch site audit data');
    }

}

export async function fetchSiteAuditDetails(auditId: number): Promise<Audit | null> {
    try {
        const { data: audit, error } = await supabase
            .from('nd_site_audit')
            .select(`
                id,
                audit_date,
                purpose,
                audit_party,
                rectification_status,
                file_path,
                remark,
                site_profile_id (
                    id,
                    sitename,
                    refid_tp,
                    refid_mcmc,
                    phase_id (
                        id,
                        name
                    )
                ),
                created_at,
                created_by,
                updated_at,
                updated_by
            `)
            .eq('id', auditId)
            .single();

        if (error) {
            console.error('Error fetching site audit details:', error);
            throw new Error(error.message);
        }

        const updatedData = {
            ...audit,
            file_path: Array.isArray(audit.file_path)
                ? audit.file_path.map((path: string) =>
                    path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_AUDIT}/${path}`
                )
                : audit.file_path
        };

        return updatedData as Audit;

    } catch (error: any) {
        console.error('Error in fetchSiteAuditDetails:', error);
        throw new Error('Failed to fetch site audit details');
    }
}

// Delete function for site audit
export async function deleteSiteAudit(id: number): Promise<void> {
    try {
        // First, fetch the audit to get file paths and site profile ID
        const { data: audit, error: fetchError } = await supabase
            .from('nd_site_audit')
            .select(`
                file_path,
                site_profile_id(id)
            `)
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching site audit for deletion:', fetchError);
            throw new Error(fetchError.message);
        }

        console.log('Audit data for deletion:', audit);
        console.log('File paths from database:', audit?.file_path);

        // Delete files from Supabase bucket if they exist
        if (audit?.file_path && Array.isArray(audit.file_path) && audit.file_path.length > 0) {
            // Process file paths to get correct bucket paths
            const filesToDelete = audit.file_path.map((filePath: string) => {
                console.log('Processing file path:', filePath);
                
                // Check if it's already a bucket path or a full URL
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    console.log('Detected full URL, extracting bucket path...');
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_AUDIT}/`)[1];
                    const decodedPath = bucketPathMatch ? decodeURIComponent(bucketPathMatch) : null;
                    console.log('Extracted bucket path:', decodedPath);
                    return decodedPath;
                } else if (filePath.includes('/')) {
                    // It's likely already a bucket path (e.g., "site-audit/123/filename.pdf")
                    console.log('Detected bucket path format');
                    const decodedPath = decodeURIComponent(filePath);
                    console.log('Decoded bucket path:', decodedPath);
                    return decodedPath;
                } else {
                    // It might be just a filename, need to construct full path
                    console.log('Detected filename only, might need full path construction');
                    return decodeURIComponent(filePath);
                }
            }).filter(Boolean); // Remove null values

            console.log('Final files to delete from bucket:', filesToDelete);

            if (filesToDelete.length > 0) {
                // Try to delete files one by one to see which ones fail
                for (const fileToDelete of filesToDelete) {
                    console.log(`Attempting to delete: ${fileToDelete}`);
                    
                    const { error: singleFileError } = await supabase.storage
                        .from(BUCKET_NAME_SITE_AUDIT)
                        .remove([fileToDelete]);

                    if (singleFileError) {
                        console.error(`Error deleting file ${fileToDelete}:`, singleFileError);
                    } else {
                        console.log(`Successfully deleted file: ${fileToDelete}`);
                    }
                }
            }
        }

        // Delete the database record
        const { error } = await supabase
            .from('nd_site_audit')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting site audit:', error);
            throw new Error(error.message);
        }

    } catch (error: any) {
        console.error('Error in deleteSiteAudit:', error);
        throw new Error(error.message);
    }
}

// Create function for site audit
export async function createSiteAudit(
    siteProfileId: number,
    auditDate: string,
    auditParty: string,
    purpose: string,
    rectificationStatus: boolean | null,
    remark: string,
    files: File[]
): Promise<void> {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Step 1: Insert into database        
        const { data: audit, error: insertError } = await supabase
            .from('nd_site_audit')
            .insert([
                {
                    site_profile_id: siteProfileId,
                    audit_date: auditDate || null,
                    audit_party: auditParty,
                    purpose: purpose,
                    rectification_status: rectificationStatus,
                    remark: remark,
                    file_path: null, // Will be updated after file upload
                    created_by: user?.id,
                    updated_by: user?.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error creating site audit:', insertError);
            throw new Error(insertError.message);
        }

        // Step 2: Upload files to bucket if provided
        let filePaths: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${audit.id}_${Date.now()}_${file.name}`;
                const bucketPath = `site-audit/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_AUDIT)
                    .upload(bucketPath, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }                

                filePaths.push(bucketPath);
            }

            // Step 3: Update the audit with file paths
            const { error: updateError } = await supabase
                .from('nd_site_audit')
                .update({ file_path: filePaths })
                .eq('id', audit.id);

            if (updateError) {
                console.error('Error updating file paths:', updateError);
                throw new Error('Failed to update file paths');
            }        
        }

        // File upload and database update completed successfully

    } catch (error: any) {
        console.error('Error in createSiteAudit:', error);
        throw new Error(error.message);
    }
}

// Update function for site audit
export async function updateSiteAudit(
    id: number,
    auditDate: string,
    auditParty: string,
    purpose: string,
    rectificationStatus: boolean | null,
    remark: string,
    files?: File[],
    keepExistingFiles?: string[]
): Promise<void> {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Get the current audit to get site_profile_id and existing files
        const { data: currentAudit, error: fetchError } = await supabase
            .from('nd_site_audit')
            .select('site_profile_id, file_path')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching current audit:', fetchError);
            throw new Error(fetchError.message);
        }

        const siteProfileId = currentAudit.site_profile_id;
        let existingFilePaths = currentAudit.file_path || [];
        
        // Step 1: Handle file removal - delete files that are not in keepExistingFiles
        if (Array.isArray(existingFilePaths)) {
            const keepFiles = keepExistingFiles || [];

            // Convert keepFiles from full URLs back to bucket paths for consistent storage
            const keepFilesBucketPaths = keepFiles.map((filePath: string) => {
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_AUDIT}/`)[1];
                    return bucketPathMatch ? decodeURIComponent(bucketPathMatch) : filePath;
                }
                return filePath; // Already a bucket path
            });

            const filesToDelete = existingFilePaths.filter(filePath => !keepFilesBucketPaths.includes(filePath));

            if (filesToDelete.length > 0) {
                // Delete files from storage bucket
                const bucketFilesToDelete = filesToDelete.map((filePath: string) => {
                    // Remove any leading slash and decode URI components
                    let cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                    return decodeURIComponent(cleanPath);
                }).filter(Boolean);

                if (bucketFilesToDelete.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from(BUCKET_NAME_SITE_AUDIT)
                        .remove(bucketFilesToDelete);

                    if (storageError) {
                        console.error('Error deleting files from bucket:', storageError);
                        // Continue with update even if file deletion fails
                    }
                }
            }

            // Update existing file paths to only include kept files (as bucket paths)
            existingFilePaths = keepFilesBucketPaths;
        }

        // Step 2: Upload new files if provided
        let finalFilePaths = [...existingFilePaths];
        if (files && files.length > 0) {
            const newFilePaths: string[] = [];

            for (const file of files) {
                const fileName = `${id}_${Date.now()}_${file.name}`;
                const bucketPath = `site-audit/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_AUDIT)
                    .upload(bucketPath, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }

                newFilePaths.push(bucketPath);
            }

            // Combine kept existing files and new files
            finalFilePaths = [...existingFilePaths, ...newFilePaths];
        }
        
        // Step 3: Update the audit        
        const { data: updatedAudit, error: updateError } = await supabase
            .from('nd_site_audit')
            .update({
                audit_date: auditDate || null,
                audit_party: auditParty,
                purpose: purpose,
                rectification_status: rectificationStatus,
                remark: remark,
                file_path: finalFilePaths.length > 0 ? finalFilePaths : null,
                updated_by: user?.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating site audit:', updateError);            
            throw new Error(updateError.message);
        }

        // Audit updated successfully

    } catch (error: any) {
        console.error('Error in updateSiteAudit:', error);
        throw new Error(error.message);
    }
}

// React Query hooks for site audit management

export function useGetSiteAudit(siteProfileIds: number[]) {
    return useQuery({
        queryKey: [AUDIT_KEY, siteProfileIds],
        queryFn: () => fetchSiteAudit(siteProfileIds),
        enabled: !!( siteProfileIds && siteProfileIds.length > 0)
    });
}

export function useGetSiteAuditById(auditId: number) {
    return useQuery({
        queryKey: [AUDIT_DETAILS_KEY, auditId],
        queryFn: () => fetchSiteAuditDetails(auditId),
        enabled: !!auditId
    });
}

export function useDeleteSiteAudit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSiteAudit,
        onSuccess: (_, deletedAuditId) => {
            queryClient.invalidateQueries({ queryKey: [AUDIT_KEY] });
        },
    });
}

// Create hook for site audit
export function useCreateSiteAudit() {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: ({ siteProfileId, auditDate, auditParty, purpose, rectificationStatus, remark, files }: {
            siteProfileId: number;
            auditDate: string;
            auditParty: string;
            purpose: string;
            rectificationStatus: boolean | null;
            remark: string;
            files: File[];        
        }) => createSiteAudit(siteProfileId, auditDate, auditParty, purpose, rectificationStatus, remark, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [AUDIT_KEY] });
        }
    });
}

// Update hook for site audit
export function useUpdateSiteAudit() {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: ({ id, auditDate, auditParty, purpose, rectificationStatus, remark, files, keepExistingFiles }: {
            id: number;
            auditDate: string;
            auditParty: string;
            purpose: string;
            rectificationStatus: boolean | null;
            remark: string;
            files?: File[];
            keepExistingFiles?: string[];
        }) => updateSiteAudit(id, auditDate, auditParty, purpose, rectificationStatus, remark, files, keepExistingFiles),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [AUDIT_KEY] });
            queryClient.invalidateQueries({ queryKey: [AUDIT_DETAILS_KEY, variables.id] });
        }
    });
}