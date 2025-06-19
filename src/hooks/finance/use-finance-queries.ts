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
        perPage: number
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
                perPage
            ],
            queryFn: () => financeClient.getFinanceReportWithFilterAndPagination(
                year, 
                month, 
                search, 
                status, 
                phase, 
                region,
                page,
                perPage
            )
    });
    
    const useAllFinanceReports = (dusp_tp_id?: string) =>
        useQuery({
            queryKey: ["allSites", dusp_tp_id],
            queryFn: () => financeClient.getAllFinanceReports(dusp_tp_id)
        });

    return {
        useSiteReportStatusQuery,
        useTwelveMonthNamesQuery,
        useYearsFromTwentyTwenty,
        useAllRegion,
        useAllPhases,
        useFinanceReportWithFilterAndPagination,
        useAllFinanceReports
    };
};