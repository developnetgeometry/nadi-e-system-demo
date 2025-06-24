// React Query hooks for phase management
import { supabase, SUPABASE_BUCKET_URL, BUCKET_NAME_SITE_AGREEMENT } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';


export interface Agreement {
    id: number;
    owner_name: string;
    start_date: string | null;
    end_date: string | null
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
        let query = (supabase as any)
            .from('nd_site_agreement')
            .select(`
                id,
                owner_name,
                start_date,
                end_date,
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
    const { data, error } = await (supabase as any)
        .from('nd_site_agreement').select(`
            id,
            owner_name,
            start_date,
            end_date,
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
        .single(); if (error) {
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
        const { data: agreement, error: fetchError } = await (supabase as any)
            .from('nd_site_agreement')
            .select(`
                file_path,
                site_profile_id(id)
            `)
            .eq('id', id)
            .single();        if (fetchError) {
            console.error('Error fetching site agreement for deletion:', fetchError);
            throw new Error(fetchError.message);
        }

        console.log('Agreement data for deletion:', agreement);
        console.log('File paths from database:', agreement?.file_path);        // Delete files from Supabase bucket if they exist
        if (agreement?.file_path && Array.isArray(agreement.file_path) && agreement.file_path.length > 0) {
            // Process file paths to get correct bucket paths
            const filesToDelete = agreement.file_path.map((filePath: string) => {
                console.log('Processing file path:', filePath);
                
                // Check if it's already a bucket path or a full URL
                if (filePath.startsWith('http')) {
                    // Extract bucket path from full URL
                    console.log('Detected full URL, extracting bucket path...');
                    const bucketPathMatch = filePath.split(`${BUCKET_NAME_SITE_AGREEMENT}/`)[1];
                    const decodedPath = bucketPathMatch ? decodeURIComponent(bucketPathMatch) : null;
                    console.log('Extracted bucket path:', decodedPath);
                    return decodedPath;
                } else if (filePath.includes('/')) {
                    // It's likely already a bucket path (e.g., "site-agreement/123/filename.pdf")
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
                        .from(BUCKET_NAME_SITE_AGREEMENT)
                        .remove([fileToDelete]);

                    if (singleFileError) {
                        console.error(`Error deleting file ${fileToDelete}:`, singleFileError);
                    } else {
                        console.log(`Successfully deleted file: ${fileToDelete}`);
                    }
                }
            }
        }// Delete the database record
        const { error } = await (supabase as any)
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
    ownerName: string,
    startDate: string,
    endDate: string,
    remark: string,
    files: File[]
): Promise<Agreement> {
    try {
        // Step 1: Check if site already has an agreement
        const hasExistingAgreement = await checkSiteHasAgreement(siteProfileId);
        if (hasExistingAgreement) {
            throw new Error('This site already has an existing agreement. Each site can only have one agreement.');
        }        // Step 2: Insert into database        
        const { data: agreement, error: insertError } = await supabase
            .from('nd_site_agreement')
            .insert([
                {
                    site_profile_id: siteProfileId,
                    owner_name: ownerName,
                    start_date: startDate || null,
                    end_date: endDate || null,
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

        // Step 3: Upload files to bucket if provided
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
                }                filePaths.push(bucketPath);
            }

            // Step 4: Update the agreement with file paths
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
    ownerName: string,
    startDate: string,
    endDate: string,
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
        let existingFilePaths = currentAgreement.file_path || [];
        // Step 1: Handle file removal - delete files that are not in keepExistingFiles
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
        }
        // Step 3: Update the agreement        
        const { data: updatedAgreement, error: updateError } = await supabase
            .from('nd_site_agreement')
            .update({
                owner_name: ownerName,
                start_date: startDate || null,
                end_date: endDate || null,
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

// Check if site has existing agreement
export async function checkSiteHasAgreement(siteProfileId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('nd_site_agreement')
            .select('id')
            .eq('site_profile_id', siteProfileId)
            .limit(1);

        if (error) {
            console.error('Error checking site agreement:', error);
            throw new Error(error.message);
        }

        return data && data.length > 0;
    } catch (error: any) {
        console.error('Error in checkSiteHasAgreement:', error);
        throw new Error(error.message);
    }
}

// Get all sites that have agreements
export async function getSitesWithAgreements(): Promise<number[]> {
    try {
        const { data, error } = await supabase
            .from('nd_site_agreement')
            .select('site_profile_id');

        if (error) {
            console.error('Error fetching sites with agreements:', error);
            throw new Error(error.message);
        }

        return data ? data.map(item => item.site_profile_id) : [];
    } catch (error: any) {
        console.error('Error in getSitesWithAgreements:', error);
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
            queryClient.invalidateQueries({ queryKey: ['sites-with-agreements'] });
        }
    });
}

// Create hook for site agreement
export function useCreateSiteAgreement() {
    const queryClient = useQueryClient(); return useMutation({
        mutationFn: ({ siteProfileId, ownerName, startDate, endDate, remark, files }: {
            siteProfileId: number;
            ownerName: string;
            startDate: string;
            endDate: string;
            remark: string;
            files: File[];        }) => createSiteAgreement(siteProfileId, ownerName, startDate, endDate, remark, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_KEY] });
            queryClient.invalidateQueries({ queryKey: ['sites-with-agreements'] });
        }
    });
}

// Update hook for site agreement
export function useUpdateSiteAgreement() {
    const queryClient = useQueryClient(); return useMutation({
        mutationFn: ({ id, ownerName, startDate, endDate, remark, files, keepExistingFiles }: {
            id: number;
            ownerName: string;
            startDate: string;
            endDate: string;
            remark: string;
            files?: File[];
            keepExistingFiles?: string[];
        }) => updateSiteAgreement(id, ownerName, startDate, endDate, remark, files, keepExistingFiles),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_KEY] });
            queryClient.invalidateQueries({ queryKey: [AGREEMENT_DETAILS_KEY, variables.id] });
        }
    });
}

// Hook to check if site has existing agreement
export function useCheckSiteHasAgreement(siteProfileId: number | undefined) {
    return useQuery({
        queryKey: ['site-has-agreement', siteProfileId],
        queryFn: () => siteProfileId ? checkSiteHasAgreement(siteProfileId) : Promise.resolve(false),
        enabled: !!siteProfileId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Hook to get all sites with agreements
export function useSitesWithAgreements() {
    return useQuery({
        queryKey: ['sites-with-agreements'],
        queryFn: getSitesWithAgreements,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Debug function to test file deletion (can be removed after testing)
export async function debugDeleteFiles() {
    try {
        // List all files in the bucket to see the structure
        const { data: files, error: listError } = await supabase.storage
            .from(BUCKET_NAME_SITE_AGREEMENT)
            .list('', {
                limit: 100,
                offset: 0,
            });

        if (listError) {
            console.error('Error listing files:', listError);
            return;
        }

        console.log('Files in bucket:', files);

        // Test listing files in site-agreement folder
        const { data: siteFiles, error: siteListError } = await supabase.storage
            .from(BUCKET_NAME_SITE_AGREEMENT)
            .list('site-agreement', {
                limit: 100,
                offset: 0,
            });

        if (siteListError) {
            console.error('Error listing site-agreement files:', siteListError);
        } else {
            console.log('Files in site-agreement folder:', siteFiles);
        }

    } catch (error) {
        console.error('Debug error:', error);
    }
}


