import { useMutation } from "@tanstack/react-query";
import { financeClient } from "./finance-client";

export const useFinanceMuation = () => {
    const useNewReportItemMutation = () =>
        useMutation({
            mutationFn: (reportItemData: any) => financeClient.postNewFinanceTransactionItem(reportItemData),
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

    const useEditFinanceReportItemMutation = (reportItemId: string) =>
        useMutation({
            mutationFn: (reportItemData: any) => financeClient.editFinanceReportItem(reportItemData, reportItemId),
            onSuccess: () => {
                console.log("Report item updated successfully");
            }
        });

    const useDeleteFinanceItemReport = (reportItemId: string) =>
        useMutation({
            mutationFn: () => financeClient.deleteFinanceItemReport(reportItemId),
            onSuccess: () => {
                console.log("Report item deleted successfully");
            }
        });

    return {
        useNewReportItemMutation,
        useUpdateFinanceReportStatusMutation,
        useEditFinanceReportItemMutation,
        useDeleteFinanceItemReport
    };
}