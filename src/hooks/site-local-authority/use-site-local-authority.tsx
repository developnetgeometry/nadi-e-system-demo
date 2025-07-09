// React Query hooks for site local authority management
import { supabase, SUPABASE_BUCKET_URL, BUCKET_NAME_SITE_LOCAL_AUTHORITY } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';

export interface LocalAuthority {
    id: number;
    start_date: string | null;
    end_date: string | null;
    file_path: string[] | null;
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

const LOCAL_AUTHORITY_KEY = 'local-authority';
const LOCAL_AUTHORITY_DETAILS_KEY = 'local-authority-details';

// Custom hook to fetch site local authorities
export async function fetchSiteLocalAuthority(siteProfileIds: number[]): Promise<LocalAuthority[]> {
    try {
        let query = supabase
            .from('nd_site_local_authority')
            .select(`
            id,
            start_date,
            end_date,
            file_path,
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
        const { data: localAuthority, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching site local authority:', error);
            throw new Error(error.message);
        }

        // Update file paths with full URLs
        const updatedFilePath = (localAuthority || []).map((data) => ({
            ...data,
            file_path: Array.isArray(data.file_path)
                ? data.file_path.map((path: string) =>
                    path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_LOCAL_AUTHORITY}/${path}`
                )
                : data.file_path
        }));

        return updatedFilePath as LocalAuthority[];
    } catch (error: any) {
        console.error('Error in fetchSiteLocalAuthority:', error);
        throw new Error('Failed to fetch site local authority data');
    }
}

export async function fetchSiteLocalAuthorityDetails(localAuthorityId: number): Promise<LocalAuthority | null> {
    try {
        const { data: localAuthority, error } = await supabase
            .from('nd_site_local_authority')
            .select(`
                id,
                start_date,
                end_date,
                file_path,
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
            .eq('id', localAuthorityId)
            .single();

        if (error) {
            console.error('Error fetching site local authority details:', error);
            throw new Error(error.message);
        }

        const updatedData = {
            ...localAuthority,
            file_path: Array.isArray(localAuthority.file_path)
                ? localAuthority.file_path.map((path: string) =>
                    path.startsWith('http') ? path : `${SUPABASE_BUCKET_URL}/${BUCKET_NAME_SITE_LOCAL_AUTHORITY}/${path}`
                )
                : localAuthority.file_path
        };

        return updatedData as LocalAuthority;

    } catch (error: any) {
        console.error('Error in fetchSiteLocalAuthorityDetails:', error);
        throw new Error('Failed to fetch site local authority details');
    }
}

// Delete function for site local authority
export async function deleteSiteLocalAuthority(id: number): Promise<void> {
    try {
        // First, fetch the local authority to get file paths and site profile ID
        const { data: localAuthority, error: fetchError } = await supabase
            .from('nd_site_local_authority')
            .select(`
                file_path,
                site_profile_id(id)
            `)
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching site local authority for deletion:', fetchError);
            throw new Error(fetchError.message);
        }

        console.log('Local Authority data for deletion:', localAuthority);
        console.log('File paths from database:', localAuthority?.file_path);

        // Delete files from Supabase bucket if they exist
        if (localAuthority?.file_path && Array.isArray(localAuthority.file_path) && localAuthority.file_path.length > 0) {
            // Process file paths to get correct bucket paths
            const filesToDelete = localAuthority.file_path.map((filePath: string) => {
                console.log('Processing file path:', filePath);
                // Check if it's already a bucket path or a full URL
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    console.log('Detected full URL, extracting bucket path...');
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_LOCAL_AUTHORITY}/`)[1];
                    const decodedPath = bucketPathMatch ? decodeURIComponent(bucketPathMatch) : null;
                    console.log('Extracted bucket path:', decodedPath);
                    return decodedPath;
                } else if (filePath.includes('/')) {
                    // It's likely already a bucket path (e.g., "site-local-authority/123/filename.pdf")
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
                        .from(BUCKET_NAME_SITE_LOCAL_AUTHORITY)
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
            .from('nd_site_local_authority')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting site local authority:', error);
            throw new Error(error.message);
        }

    } catch (error: any) {
        console.error('Error in deleteSiteLocalAuthority:', error);
        throw new Error(error.message);
    }
}

// Create function for site local authority
export async function createSiteLocalAuthority(
    siteProfileId: number,
    startDate: string,
    endDate: string,
    files: File[]
): Promise<void> {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Step 1: Insert into database        
        const { data: localAuthority, error: insertError } = await supabase
            .from('nd_site_local_authority')
            .insert([
                {
                    site_profile_id: siteProfileId,
                    start_date: startDate || null,
                    end_date: endDate || null,
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
            console.error('Error creating site local authority:', insertError);
            throw new Error(insertError.message);
        }

        // Step 2: Upload files to bucket if provided
        let filePaths: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${localAuthority.id}_${Date.now()}_${file.name}`;
                const bucketPath = `site-local-authority/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_LOCAL_AUTHORITY)
                    .upload(bucketPath, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }                

                filePaths.push(bucketPath);
            }

            // Step 3: Update the local authority with file paths
            const { error: updateError } = await supabase
                .from('nd_site_local_authority')
                .update({ file_path: filePaths })
                .eq('id', localAuthority.id);

            if (updateError) {
                console.error('Error updating file paths:', updateError);
                throw new Error('Failed to update file paths');
            }        
        }

        // File upload and database update completed successfully

    } catch (error: any) {
        console.error('Error in createSiteLocalAuthority:', error);
        throw new Error(error.message);
    }
}

// Update function for site local authority
export async function updateSiteLocalAuthority(
    id: number,
    startDate: string,
    endDate: string,
    files?: File[],
    keepExistingFiles?: string[]
): Promise<void> {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Get the current local authority to get site_profile_id and existing files
        const { data: currentLocalAuthority, error: fetchError } = await supabase
            .from('nd_site_local_authority')
            .select('site_profile_id, file_path')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching current local authority:', fetchError);
            throw new Error(fetchError.message);
        }

        const siteProfileId = currentLocalAuthority.site_profile_id;
        let existingFilePaths = currentLocalAuthority.file_path || [];

        // Step 1: Handle file removal - delete files that are not in keepExistingFiles
        if (Array.isArray(existingFilePaths)) {
            const keepFiles = keepExistingFiles || [];

            // Convert keepFiles from full URLs back to bucket paths for consistent storage
            const keepFilesBucketPaths = keepFiles.map((filePath: string) => {
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_LOCAL_AUTHORITY}/`)[1];
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
                        .from(BUCKET_NAME_SITE_LOCAL_AUTHORITY)
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
                const bucketPath = `site-local-authority/${siteProfileId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME_SITE_LOCAL_AUTHORITY)
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
        
        // Step 3: Update the local authority        
        const { data: updatedLocalAuthority, error: updateError } = await supabase
            .from('nd_site_local_authority')
            .update({
                start_date: startDate || null,
                end_date: endDate || null,
                file_path: finalFilePaths.length > 0 ? finalFilePaths : null,
                updated_by: user?.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating site local authority:', updateError);            
            throw new Error(updateError.message);
        }

        // Local authority updated successfully

    } catch (error: any) {
        console.error('Error in updateSiteLocalAuthority:', error);
        throw new Error(error.message);
    }
}

// React Query hooks for site local authority management

export function useGetSiteLocalAuthority(siteProfileIds: number[]) {
    return useQuery({
        queryKey: [LOCAL_AUTHORITY_KEY, siteProfileIds],
        queryFn: () => fetchSiteLocalAuthority(siteProfileIds),
        enabled: !!( siteProfileIds && siteProfileIds.length > 0)
    });
}

export function useGetSiteLocalAuthorityById(localAuthorityId: number) {
    return useQuery({
        queryKey: [LOCAL_AUTHORITY_DETAILS_KEY, localAuthorityId],
        queryFn: () => fetchSiteLocalAuthorityDetails(localAuthorityId),
        enabled: !!localAuthorityId
    });
}

export function useDeleteSiteLocalAuthority() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSiteLocalAuthority,
        onSuccess: (_, deletedLocalAuthorityId) => {
            queryClient.invalidateQueries({ queryKey: [LOCAL_AUTHORITY_KEY] });
        },
    });
}

// Create hook for site local authority
export function useCreateSiteLocalAuthority() {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: ({ siteProfileId, startDate, endDate, files }: {
            siteProfileId: number;
            startDate: string;
            endDate: string;
            files: File[];        
        }) => createSiteLocalAuthority(siteProfileId, startDate, endDate, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LOCAL_AUTHORITY_KEY] });
        }
    });
}

// Update hook for site local authority
export function useUpdateSiteLocalAuthority() {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: ({ id, startDate, endDate, files, keepExistingFiles }: {
            id: number;
            startDate: string;
            endDate: string;
            files?: File[];
            keepExistingFiles?: string[];
        }) => updateSiteLocalAuthority(id, startDate, endDate, files, keepExistingFiles),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [LOCAL_AUTHORITY_KEY] });
            queryClient.invalidateQueries({ queryKey: [LOCAL_AUTHORITY_DETAILS_KEY, variables.id] });
        }
    });
}
