import { useMutation } from "@tanstack/react-query";
import { financeClient } from "./finance-client";

export const useFinanceMuation = () => {
    const useNewReportItemMutation = () =>
        useMutation({
            mutationFn: (reportId: string) => financeClient.postNewFinanceTransactionItem(reportId),
            onSuccess: () => {
                console.log("Report item created successfully");
            }
        });
    
    const useUpdateFinanceReportStatusMutation = () =>
        useMutation({
            mutationFn: (status: string) => financeClient.updateFinanceReportStatus(status),
            onSuccess: () => {
                console.log("Report status updated successfully");
            }
        });

    return {
        useNewReportItemMutation,
        useUpdateFinanceReportStatusMutation
    };
}