// React Query hooks for phase management
import { supabase, SUPABASE_BUCKET_URL, BUCKET_NAME_SITE_AGREEMENT } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';


export interface Agreement {
    id: number;
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
    file_path: string[] | null;
    remark: string | null;
    created_at: string;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
}

// Query keys
const AGREEMENT_KEY = 'agreements';
const AGREEMENT_DETAILS_KEY = 'agreement-details';
const ORGANIZATIONS_KEY = 'organizations';

// Database functions
export async function fetchSiteAgreement(siteProfileIds?: number[]): Promise<Agreement[]> {
    try {
        // Build the query once with all conditions
        let query = supabase
            .from('nd_site_agreement')
            .select(`
                id,
                site_profile_id(
                    id,
                    sitename,
                    refid_tp,
                    refid_mcmc,
                    phase_id(
                        id,
                        name
                    )
                ),
                file_path,
                remark,
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
        const { data: agreement, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching site agreement:', error);
            throw new Error(error.message);
        }

        // Update file paths with full URLs
        const updatedFilePath = (agreement || []).map((data) => ({
            ...data,
            file_path: Array.isArray(data.file_path)
                ? data.file_path.map((path: string) =>
                    path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_AGREEMENT}/${path}`
                )
                : data.file_path
        }));

        return updatedFilePath as Agreement[];

    } catch (error: any) {
        console.error('Error in site agreement:', error);
        throw new Error(error.message);
    }
}

export async function fetchSiteAgreementById(id: number): Promise<Agreement> {
    const { data, error } = await supabase
        .from('nd_site_agreement').select(`
            id,
            site_profile_id(
                id,
                sitename,
                refid_tp,
                refid_mcmc,
                phase_id(
                    id,
                    name
                )
            ),
            file_path,
            remark,
            created_at,
            created_by, 
            updated_at,
            updated_by  
        `)
        .eq('id', id)
        .single();    if (error) {
        console.error(`Error fetching site agreement ${id}:`, error);
        throw new Error(error.message);
    }
    if (!data) {
        throw new Error(`Site agreement with ID ${id} not found`);
    }

    // Update file paths with full URLs for single item
    const updatedData = {
        ...data,
        file_path: Array.isArray(data.file_path)
            ? data.file_path.map((path: string) =>
                path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_AGREEMENT}/${path}`
            )
            : data.file_path
    };

    return updatedData as Agreement;
}

// Delete function for site agreement
export async function deleteSiteAgreement(id: number): Promise<void> {
    try {
        // First, fetch the agreement to get file paths and site profile ID
        const { data: agreement, error: fetchError } = await supabase
            .from('nd_site_agreement')
            .select(`
                file_path,
                site_profile_id(id)
            `)
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching site agreement for deletion:', fetchError);
            throw new Error(fetchError.message);
        }        // Delete files from Supabase bucket if they exist
        if (agreement?.file_path && Array.isArray(agreement.file_path) && agreement.file_path.length > 0) {
            const siteId = agreement.site_profile_id?.id;
            
            if (siteId) {
                // Extract filenames from file paths and construct bucket file paths
                const filesToDelete = agreement.file_path.map((filePath: string) => {
                    // Extract the relative file path from the full URL
                    let relativeFilePath = filePath.split(
                        `${BUCKET_NAME_SITE_AGREEMENT}/`
                    )[1];

                    // Decode URL-encoded characters (like %20 -> space)
                    if (relativeFilePath) {
                        relativeFilePath = decodeURIComponent(relativeFilePath);
                    }

                    return relativeFilePath;
                });

                // Delete files from bucket
                const { error: storageError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_AGREEMENT)
                    .remove(filesToDelete);

                if (storageError) {
                    console.error('Error deleting files from bucket:', storageError);
                    // Continue with database deletion even if file deletion fails
                }
            }
        }        // Delete the database record
        const { error } = await supabase
            .from('nd_site_agreement')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting site agreement:', error);
            throw new Error(error.message);
        }

    } catch (error: any) {
        console.error('Error in deleteSiteAgreement:', error);
        throw new Error(error.message);
    }
}

// Create function for site agreement
export async function createSiteAgreement(
    siteProfileId: number,
    remark: string,
    files: File[]
): Promise<Agreement> {
    try {
        // Step 1: Insert into database first
        const { data: agreement, error: insertError } = await supabase
            .from('nd_site_agreement')
            .insert([
                {
                    site_profile_id: siteProfileId,
                    remark: remark,
                    file_path: null, // Will be updated after file upload
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error creating site agreement:', insertError);
            throw new Error(insertError.message);
        }

        // Step 2: Upload files to bucket if provided
        let filePaths: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${agreement.id}_${Date.now()}_${file.name}`;
                const bucketPath = `site-agreement/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_AGREEMENT)
                    .upload(bucketPath, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }

                filePaths.push(bucketPath);
            }

            // Step 3: Update the agreement with file paths
            const { error: updateError } = await supabase
                .from('nd_site_agreement')
                .update({ file_path: filePaths })
                .eq('id', agreement.id);

            if (updateError) {
                console.error('Error updating file paths:', updateError);
                throw new Error('Failed to update file paths');
            }
        }

        // Return the created agreement with file paths
        return { ...agreement, file_path: filePaths };

    } catch (error: any) {
        console.error('Error in createSiteAgreement:', error);
        throw new Error(error.message);
    }
}

// Update function for site agreement
export async function updateSiteAgreement(
    id: number,
    remark: string,
    files?: File[],
    keepExistingFiles?: string[]
): Promise<Agreement> {
    try {
        // Get the current agreement to get site_profile_id and existing files
        const { data: currentAgreement, error: fetchError } = await supabase
            .from('nd_site_agreement')
            .select('site_profile_id, file_path')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching current agreement:', fetchError);
            throw new Error(fetchError.message);
        }

        const siteProfileId = currentAgreement.site_profile_id;
        let existingFilePaths = currentAgreement.file_path || [];        // Step 1: Handle file removal - delete files that are not in keepExistingFiles
        if (Array.isArray(existingFilePaths)) {
            const keepFiles = keepExistingFiles || [];
            
            // Convert keepFiles from full URLs back to bucket paths for consistent storage
            const keepFilesBucketPaths = keepFiles.map((filePath: string) => {
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_AGREEMENT}/`)[1];
                    return bucketPathMatch ? decodeURIComponent(bucketPathMatch) : filePath;
                }
                return filePath; // Already a bucket path
            });
            
            const filesToDelete = existingFilePaths.filter(filePath => !keepFilesBucketPaths.includes(filePath));
            
            if (filesToDelete.length > 0) {
                // Delete files from storage bucket
                // The file paths are already stored as the bucket path (e.g., "site-agreement/123/filename.pdf")
                const bucketFilesToDelete = filesToDelete.map((filePath: string) => {
                    // Remove any leading slash and decode URI components
                    let cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                    return decodeURIComponent(cleanPath);
                }).filter(Boolean);

                if (bucketFilesToDelete.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from(BUCKET_NAME_SITE_AGREEMENT)
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
                const bucketPath = `site-agreement/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_AGREEMENT)
                    .upload(bucketPath, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }

                newFilePaths.push(bucketPath);
            }

            // Combine kept existing files and new files
            finalFilePaths = [...existingFilePaths, ...newFilePaths];
        }        // Step 3: Update the agreement
        const { data: updatedAgreement, error: updateError } = await supabase
            .from('nd_site_agreement')
            .update({
                remark: remark,
                file_path: finalFilePaths.length > 0 ? finalFilePaths : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating site agreement:', updateError);
            throw new Error(updateError.message);
        }

        return updatedAgreement;

    } catch (error: any) {
        console.error('Error in updateSiteAgreement:', error);
        throw new Error(error.message);
    }
}

// # React Query hooks
export function useGetSiteAgreement(siteProfileIds?: number[]) {
    return useQuery({
        queryKey: [AGREEMENT_KEY, siteProfileIds],
        queryFn: () => fetchSiteAgreement(siteProfileIds),
        enabled: !!(siteProfileIds && siteProfileIds.length > 0) // Only fetch when we have site profile IDs
    });
}

export function useGetSiteAgreementById(id: number) {
    return useQuery({
        queryKey: [AGREEMENT_DETAILS_KEY, id],
        queryFn: () => fetchSiteAgreementById(id),
        enabled: !!id
    });
}

// Delete hook for site agreement
export function useDeleteSiteAgreement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSiteAgreement,
        onSuccess: (_, deletedAgreementId) => {
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_KEY] });
        }
    });
}

// Create hook for site agreement
export function useCreateSiteAgreement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ siteProfileId, remark, files }: {
            siteProfileId: number;
            remark: string;
            files: File[];
        }) => createSiteAgreement(siteProfileId, remark, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_KEY] });
        }
    });
}

// Update hook for site agreement
export function useUpdateSiteAgreement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, remark, files, keepExistingFiles }: {
            id: number;
            remark: string;
            files?: File[];
            keepExistingFiles?: string[];
        }) => updateSiteAgreement(id, remark, files, keepExistingFiles),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_KEY] });
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_DETAILS_KEY, variables.id] });
        }
    });
}


