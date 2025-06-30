import { useMutation } from "@tanstack/react-query";
import { financeClient } from "./finance-client";
import { FinanceReportItem } from "@/types/finance";

export const useFinanceMuation = () => {
    const useNewReportItemMutation = () =>
        useMutation({
            mutationFn: (reportItemData: FinanceReportItem) => financeClient.postNewFinanceTransactionItem(reportItemData),
            onSuccess: () => {
                console.log("Report item created successfully");
            }
        });

    const useUpdateFinanceReportStatusMutation = () =>
        useMutation({
            mutationFn: async (variables: { reportId: string; status: string; balanceForward?: number }) => {
                const { reportId, status, balanceForward } = variables;
                return financeClient.updateFinanceReportStatus(reportId, status, balanceForward);
            },
            onSuccess: () => {
                console.log("Report status updated successfully");
            }
        });

    const useEditFinanceReportItemMutation = (reportItemId: string) =>
        useMutation({
            mutationFn: (reportItemData: FinanceReportItem) => financeClient.editFinanceReportItem(reportItemData, reportItemId),
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