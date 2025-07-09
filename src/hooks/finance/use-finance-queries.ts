import { useQuery } from "@tanstack/react-query";
import { financeClient } from "./finance-client";


export const useFinanceQueries = () => {
    const useSiteReportStatusQuery = () =>
        useQuery({
            queryKey: ["site-report-status"],
            queryFn: () => financeClient.getAllSiteReportStatus()
    });

    const useTwelveMonthNamesQuery = () =>
        useQuery({
            queryKey: ["twelve-month-names"],
            queryFn: () => financeClient.getAllMonthName()
    });

    const useYearsFromTwentyTwenty = () =>
        useQuery({
            queryKey: ["years-from-2020"],
            queryFn: () => financeClient.getAllYearFromTwentyTwenty()
    });

    const useAllRegion = () => 
        useQuery({
            queryKey: ["allRegion"],
            queryFn: () => financeClient.getAllRegion()
    });

    const useAllPhases = () => 
        useQuery({
            queryKey: ["allPhases"],
            queryFn: () => financeClient.getAllPhases()
    });

    const useFinanceReportWithFilterAndPagination = (
        year: string, 
        month: string, 
        search: string, 
        status: string, 
        phase: string, 
        region: string,
        page: number,
        perPage: number,
        tpAdminSiteIds?: number[],
        duspTpSiteId?: number
    ) => 
        useQuery({
            queryKey: [
                "financeReportWithFilterAndPagination",
                year,
                month,
                search,
                status,
                phase,
                region,
                page,
                perPage,
                ...tpAdminSiteIds,
                duspTpSiteId
            ],
            queryFn: () => financeClient.getFinanceReportWithFilterAndPagination(
                year, 
                month, 
                search, 
                status, 
                phase, 
                region,
                page,
                perPage,
                tpAdminSiteIds,
                duspTpSiteId
            )
    });
    
    const useAllFinanceReports = (tpAdminSiteIds?: number[], duspTpSiteId?: number) =>
        useQuery({
            queryKey: ["allSites", ...tpAdminSiteIds, duspTpSiteId],
            queryFn: () => financeClient.getAllFinanceReports(tpAdminSiteIds, duspTpSiteId)
        });

    const useFinanceReportItemByReportId = (
        reportId: string,
        page: number, 
        perPage: number
    ) =>
        useQuery({
            queryKey: ["financeReportItemByReportId", reportId, page, perPage],
            queryFn: () => financeClient.getFinanceReportItemByReportId(reportId, page, perPage),
            enabled: !!reportId
    });

    const useSiteNameByReportId = (reportId: string) =>
        useQuery({
            queryKey: ["siteNameByReportId", reportId],
            queryFn: () => financeClient.getSiteNameByReportId(reportId),
            enabled: !!reportId
    });

    const useAllFinanceIncomeTypes = () =>
        useQuery({
            queryKey: ["allFinanceIncomeTypes"],
            queryFn: () => financeClient.getAllFinanceIncomeTypes()
    });

    const useAllFinanceExpenseTypes = () =>
        useQuery({
            queryKey: ["allFinanceExpenseTypes"],
            queryFn: () => financeClient.getAllFinanceExpenseTypes()
    });

    const useAllSiteReport = (siteId: number, siteIds?: number[]) =>
        useQuery({
            queryKey: ["allSiteReportStatus", siteId, ...siteIds],
            queryFn: () => financeClient.getAllSiteReports(siteId, siteIds)
    });

    const usePosTransactionItemByTransactionId = (transactionId: string) =>
        useQuery({
            queryKey: ["posTransactionItemByTransactionId", transactionId],
            queryFn: () => financeClient.getPosTransactionItemByTransactionId(transactionId)
    });

    const useMemberProfileById = (memberId: number) =>
        useQuery({
            queryKey: ["memberProfileById", memberId],
            queryFn: () => financeClient.getMemberProfileById(memberId)
    });

    const useInventoryById = (inventoryId: number) =>
        useQuery({
            queryKey: ["inventoryById", inventoryId],
            queryFn: () => financeClient.getInventoryById(inventoryId),
            enabled: !!inventoryId
    });

    return {
        useSiteReportStatusQuery,
        useTwelveMonthNamesQuery,
        useYearsFromTwentyTwenty,
        useAllRegion,
        useAllPhases,
        useFinanceReportWithFilterAndPagination,
        useAllFinanceReports,
        useFinanceReportItemByReportId,
        useSiteNameByReportId,
        useAllFinanceIncomeTypes,
        useAllFinanceExpenseTypes,
        useAllSiteReport,
        usePosTransactionItemByTransactionId,
        useMemberProfileById,
        useInventoryById
    };
};