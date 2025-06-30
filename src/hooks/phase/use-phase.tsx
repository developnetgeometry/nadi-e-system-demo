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
    organization_id: string | null; // Simplified to just string ID
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
    }[] | null; // Updated to handle array or null
}



export type CreatePhaseData = Omit<Phase, 'id' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by' | 'nd_phases_contract'> & {
  organization_id: string | null;
};

// Query keys
const PHASES_KEY = 'phases';
const PHASE_DETAILS_KEY = 'phase-details';

// Database functions
export async function fetchPhases(): Promise<Phase[]> {
    try {
        const { data, error } = await supabase
            .from('nd_phases')
            .select(`
                id,
                name,
                remark,
                is_active,
                organization_id,
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
            .eq('nd_phases_contract.is_active', true)
            .order('created_at', { ascending: false });

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
            organization_id,
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



// # React Query hooks
export function useGetPhases() {
    return useQuery({
        queryKey: [PHASES_KEY],
        queryFn: () => fetchPhases()
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

