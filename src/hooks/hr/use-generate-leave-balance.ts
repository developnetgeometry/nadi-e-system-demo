import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useGenerateLeaveBalance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateBalancesMutation = useMutation({
    mutationFn: async ({
      year,
      staffIds,
    }: {
      year: number;
      staffIds?: number[];
    }) => {
      console.log(
        "Generating leave balances for year:",
        year,
        "staffIds:",
        staffIds
      );

      // Get all staff contracts or specific staff if provided
      let query = supabase.from("nd_staff_contract").select("staff_tp_id");

      if (staffIds && staffIds.length > 0) {
        query = query.in("staff_tp_id", staffIds);
      }

      const { data: contracts, error: contractError } = await query;

      if (contractError) throw contractError;

      if (!contracts || contracts.length === 0) {
        throw new Error("No staff contracts found");
      }

      // Get all leave types
      const { data: leaveTypes, error: leaveTypesError } = await supabase
        .from("nd_leave_type")
        .select("*");

      if (leaveTypesError) throw leaveTypesError;

      if (!leaveTypes || leaveTypes.length === 0) {
        throw new Error("No leave types found");
      }

      // Generate leave balances for each staff and leave type
      const balancesToInsert = [];

      for (const contract of contracts) {
        for (const leaveType of leaveTypes) {
          // Default balance allocation based on leave type
          let defaultBalance = 0;
          switch (leaveType.name.toLowerCase()) {
            case "annual":
              defaultBalance = 14;
              break;
            case "medical":
              defaultBalance = 14;
              break;
            case "emergency":
              defaultBalance = 7;
              break;
            case "replacement":
              defaultBalance = 0;
              break;
            default:
              defaultBalance = 0;
          }

          balancesToInsert.push({
            staff_id: contract.staff_tp_id.toString(),
            leave_type_id: leaveType.id,
            balance: defaultBalance,
            used: 0,
            carried_forward: 0,
            year: year,
          });
        }
      }

      // Insert balances (with conflict handling)
      const { error: insertError } = await supabase
        .from("nd_leave_balance")
        .upsert(balancesToInsert, {
          onConflict: "staff_id,leave_type_id,year",
          ignoreDuplicates: false,
        });

      if (insertError) throw insertError;

      return balancesToInsert.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
      toast({
        title: "Success",
        description: `Generated ${count} leave balance records successfully`,
      });
    },
    onError: (err) => {
      console.error("Error generating leave balances:", err);
      toast({
        title: "Error",
        description: "Failed to generate leave balances",
        variant: "destructive",
      });
    },
  });

  return {
    generateBalances: generateBalancesMutation.mutateAsync,
    isGenerating: generateBalancesMutation.isPending,
  };
}
