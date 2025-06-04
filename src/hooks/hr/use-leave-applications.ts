
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useStaffID from "@/hooks/use-staff-id";

export type LeaveApplication = {
  id: number;
  staff_id: string;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: string;
  applied_at: string;
  attachment_path?: string;
  nd_leave_type: {
    id: number;
    name: string;
  };
};

export type NewLeaveApplication = {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  attachment_path?: string;
};

export function useLeaveApplications() {
  const { staffID } = useStaffID();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["leave-applications", staffID],
    queryFn: async () => {
      if (!staffID) return [];

      const { data, error } = await supabase
        .from("nd_leave_application")
        .select(`
          *,
          nd_leave_type (
            id,
            name
          )
        `)
        .eq("staff_id", staffID)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data as LeaveApplication[];
    },
    enabled: !!staffID,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching leave applications:", err);
        toast({
          title: "Error",
          description: "Failed to load leave applications",
          variant: "destructive",
        });
      },
    },
  });

  const applyLeaveMutation = useMutation({
    mutationFn: async (application: NewLeaveApplication) => {
      if (!staffID) throw new Error("Staff ID not found");

      const { error } = await supabase
        .from("nd_leave_application")
        .insert([{
          staff_id: staffID,
          ...application,
          status: "pending"
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-applications", staffID] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances", staffID] });
      toast({
        title: "Success",
        description: "Leave application submitted successfully",
      });
    },
    onError: (err) => {
      console.error("Error applying for leave:", err);
      toast({
        title: "Error",
        description: "Failed to submit leave application",
        variant: "destructive",
      });
    },
  });

  const applyLeave = async (application: NewLeaveApplication) => {
    return applyLeaveMutation.mutateAsync(application);
  };

  return {
    leaveApplications: data || [],
    isLoading,
    error,
    applyLeave,
    isApplying: applyLeaveMutation.isPending,
  };
}
