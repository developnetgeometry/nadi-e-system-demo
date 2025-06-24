// React Query hooks for phase management
import { supabase } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';


export interface Agreement {
    id: string;
    site_profile_id: {
        id: string;
        sitename: string;
        refid_tpn: string;
        refid_mcmc: string;
        phase_id: {
            id: number;
            name: string;
        }
    }
    file_path: string[] | null;
    remark: string | null;
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
}

export interface Organization {
    id: string;
    name: string;
    type: string;
    description: string | null;
}


// Query keys
const AGREEMENT_KEY = 'agreements';
const AGREEMENT_DETAILS_KEY = 'agreement-details';
const ORGANIZATIONS_KEY = 'organizations';

// Database functions
export async function fetchSiteAgreement(organizationId?: string | null): Promise<Agreement[]> {
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

        // Apply filters directly without reassignment
        // if (organizationId) {
        //     // Add eq filter inline without reassignment
        //     query = query.eq('organization_id', organizationId);
        // }

        // Execute the query with ordering by name
        const { data, error } = await query.order('created_at', { ascending: false });

        // Data cleaning for file_path
        // ....

        if (error) {
            console.error('Error fetching site agreement:', error);
            throw new Error(error.message);
        }

        return (data || []) as Agreement[];
    } catch (error: any) {
        console.error('Error insite agreement:', error);
        throw new Error(error.message);
    }
}

export async function fetchSiteAgreementById(id: number): Promise<Agreement> {
    const { data, error } = await supabase
        .from('nd_site_agreement')
        .select(`
            id,
            site_profile_id(
                id,
                sitename,
                refid_tpn,
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
        .single();

    if (error) {
        console.error(`Error fetching site agreement ${id}:`, error);
        throw new Error(error.message);
    }
    if (!data) {
        throw new Error(`Site agreement with ID ${id} not found`);
    }

    return data as Agreement;
}

// New function to fetch organizations with type='dusp'
export async function fetchDuspOrganizations(): Promise<Organization[]> {
    try {
        const { data, error } = await supabase
            .from('organizations')
            .select('id, name, type, description')
            .eq('type', 'dusp')
            .order('name');

        if (error) {
            console.error('Error fetching DUSP organizations:', error);
            throw new Error(error.message);
        }

        return data || [];
    } catch (error: any) {
        console.error('Error in fetchDuspOrganizations:', error);
        throw new Error(error.message);
    }
}

// # React Query hooks
export function useGetSiteAgreement(organizationId?: string | null) {
    return useQuery({
        queryKey: [AGREEMENT_KEY, organizationId],
        queryFn: () => fetchSiteAgreement(organizationId)
    });
}

export function useGetSiteAgreementById(id: number) {
    return useQuery({
        queryKey: [AGREEMENT_DETAILS_KEY, id],
        queryFn: () => fetchSiteAgreementById(id),
        enabled: !!id
    });
}

// New hook for fetching DUSP organizations
export function useGetDuspOrganizations() {
    return useQuery({
        queryKey: [ORGANIZATIONS_KEY, 'dusp'],
        queryFn: fetchDuspOrganizations
    });
}


