// React Query hooks for phase management
import { supabase } from "@/integrations/supabase/client";
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';

// Phase data structure matching database schema
export interface Phase {
    id: number;
    name: string;
    contract_start: string | null;
    contract_end: string | null;
    is_active: boolean;
    remark: string | null;
    organization_id: {
        id: string;
        name: string;
        type: string;
        description: string | null;
    } | null; // Updated to handle object or null
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
    nd_phases_contract: {
        id: number;
        start_date: string | null;
        end_date: string | null;
        is_active: boolean;
        file_path: string[] | null;
    } | null; // Updated to handle object or null
}

// Organization interface for dropdown selection
export interface Organization {
    id: string;
    name: string;
    type: string;
    description: string | null;
}

export type CreatePhaseData = Omit<Phase, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;

// Query keys
const PHASES_KEY = 'phases';
const PHASE_DETAILS_KEY = 'phase-details';
const ORGANIZATIONS_KEY = 'organizations';

// Database functions
export async function fetchPhases(organizationId: string | null): Promise<Phase[]> {
    try {
        // Build the query once with all conditions
        let query = supabase.from('nd_phases').select(`
            id,
            name,
            remark,
            is_active,
            organization_id(
                id,
                name,
                type,
                description
            ),
            created_at,
            created_by,
            updated_at,
            updated_by,
            nd_phases_contract(
                id,
                start_date,
                end_date,
                is_active,
                file_path
            )            
        `).eq('nd_phases_contract.is_active', true);

        // Apply filters directly without reassignment
        if (organizationId) {
            // Add eq filter inline without reassignment
            query = query.eq('organization_id', organizationId);
        }

        // Execute the query with ordering by name
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching phases:', error);
            throw new Error(error.message);
        }

        return (data || []) as Phase[];
    } catch (error: any) {
        console.error('Error in fetchPhases:', error);
        throw new Error(error.message);
    }
}

export async function fetchPhaseById(id: number): Promise<Phase> {
    const { data, error } = await supabase
        .from('nd_phases')
        .select(`
            id,
            name,
            remark,
            is_active,
            contract_start,
            contract_end,
            organization_id(
                id,
                name,
                type,
                description
            ),
            created_at,
            created_by,
            updated_at,
            updated_by,
            nd_phases_contract(
                id,
                start_date,
                end_date,
                is_active,
                file_path
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching phase ${id}:`, error);
        throw new Error(error.message);
    }
    if (!data) {
        throw new Error(`Phase with ID ${id} not found`);
    }

    return data as Phase;
}

export async function createPhase(phaseData: CreatePhaseData): Promise<Phase> {
    const { data, error } = await supabase
        .from('nd_phases')
        .insert(phaseData)
        .select();

    if (error) {
        console.error('Error creating phase:', error);
        throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        throw new Error('No data returned after creating phase');
    }

    return data[0] as Phase;
}

export async function updatePhase(id: number, data: Partial<Omit<Phase, 'id'>>): Promise<Phase> {
    const { data: updatedData, error } = await supabase
        .from('nd_phases')
        .update(data)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating phase:', error);
        throw new Error(error.message);
    }
    if (!updatedData || updatedData.length === 0) {
        throw new Error(`No data returned after updating phase with ID ${id}`);
    }

    return updatedData[0] as Phase;
}

export async function deletePhase(id: number): Promise<void> {
    const { error } = await supabase
        .from('nd_phases')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting phase:', error);
        throw new Error(error.message);
    }
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
export function useGetPhases(organizationId: string | null) {
    return useQuery({
        queryKey: [PHASES_KEY, organizationId],
        queryFn: () => fetchPhases(organizationId)
    });
}

export function useGetPhaseById(id: number) {
    return useQuery({
        queryKey: [PHASE_DETAILS_KEY, id],
        queryFn: () => fetchPhaseById(id),
        enabled: !!id
    });
}

export function useCreatePhase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPhase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PHASES_KEY] });
        }
    });
}

export function useUpdatePhase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Phase, 'id'>> }) =>
            updatePhase(id, data),
        onSuccess: (updatedPhase) => {
            queryClient.invalidateQueries({ queryKey: [PHASES_KEY] });
            queryClient.invalidateQueries({
                queryKey: [PHASE_DETAILS_KEY, updatedPhase.id]
            });
        }
    });
}

export function useDeletePhase() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePhase,
        onSuccess: (_, deletedPhaseId) => {
            queryClient.invalidateQueries({ queryKey: [PHASES_KEY] });
        }
    });
}

// New hook for fetching DUSP organizations
export function useGetDuspOrganizations() {
    return useQuery({
        queryKey: [ORGANIZATIONS_KEY, 'dusp'],
        queryFn: fetchDuspOrganizations
    });
}


