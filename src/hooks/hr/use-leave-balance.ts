
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useStaffID from "@/hooks/use-staff-id";

export type LeaveBalance = {
  id: number;
  staff_id: string;
  leave_type_id: number;
  balance: number;
  used: number;
  carried_forward: number;
  year: number;
  nd_leave_type: {
    id: number;
    name: string;
  };
};

export function useLeaveBalance() {
  const { staffID } = useStaffID();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["leave-balances", staffID],
    queryFn: async () => {
      if (!staffID) return [];

      const { data, error } = await supabase
        .from("nd_leave_balance")
        .select(`
          *,
          nd_leave_type (
            id,
            name
          )
        `)
        .eq("staff_id", staffID)
        .eq("year", new Date().getFullYear());

      if (error) throw error;
      return data as LeaveBalance[];
    },
    enabled: !!staffID,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching leave balances:", err);
        toast({
          title: "Error",
          description: "Failed to load leave balances",
          variant: "destructive",
        });
      },
    },
  });

  return {
    leaveBalances: data || [],
    isLoading,
    error,
  };
}
