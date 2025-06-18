import { supabase } from "@/lib/supabase";

export const financeClient = {
    getAllSiteReportStatus: async () => {
        const { data, error } = await supabase
            .from("nd_finance_report_status")
            .select("*")
        if (error) throw error;
        return data
    },

    getAllMonthName: async () => {
        const twelveMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return twelveMonths;
    },

    getAllYearFromTwentyTwenty: async () => {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        for (let i = 2020; i <= currentYear; i++) {
            yearOptions.push(i);
        }
        return yearOptions;
    },

    getAllRegion: async () => {
        const { data, error } = await supabase
            .from("nd_region")
            .select("*")
        if (error) throw error;
        return data
    },

    getAllPhases: async () => {
        const { data, error } = await supabase
            .from("nd_phases")
            .select("*")
        if (error) throw error;
        return data
    },

    getFinanceReportWithFilterAndPagination: async (
        year: string,
        month: string,
        search: string,
        status: string,
        phase: string,
        region: string,
        page: number,
        perPage: number
    ) => {
        const siteIds: number[] = [];
        let statusId: number;
        let regionId: number | undefined;
        let phaseId: number | undefined;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;
        if (search !== "") {
            const { data, error } = await supabase
                .from("nd_site_profile")
                .select("id")
                .ilike("sitename", `%${search}%`)
            if (error) {
                console.error(error);
                throw error;
            }
            siteIds.push(...data.map((site: any) => site.id))
        }
        if (status !== "") {
            const { data, error } = await supabase
                .from("nd_finance_report_status")
                .select("id")
                .eq("status", status)
                .single()
            if (error) {
                console.error(error);
                throw error;
            }
            statusId = data.id;
        }
        if (phase !== "") {
            const { data, error } = await supabase
                .from("nd_phases")
                .select("id")
                .eq("name", phase)
            if (error) {
                console.error(error);
                throw error;
            }
            phaseId = data[0].id
        }
        if (region !== "") {
            const { data, error } = await supabase
                .from("nd_region")
                .select("id")
                .eq("eng", region)
            if (error) {
                console.error(error);
                throw error;
            }
            regionId = data[0].id
        }

        let query = supabase
            .from("nd_finance_report")
            .select(`*, nd_site_profile(*, nd_region (*), nd_phases (*)), nd_finance_report_status(*), nd_finance_report_item(*)`)
            .range(from, to);

        if (month != "") query = query.eq("month", month);
        if (year != "") query = query.eq("year", year);
        if (search !== "") query = query.in("site_id", siteIds);
        if (status !== "") query = query.eq("status_id", statusId);

        const { data, error } = await query;
        if (error) {
            console.error(error);
            throw error;
        };

        const filteredByRegion = data.filter((report: any) => report.nd_site_profile?.nd_region?.id === Number(regionId));
        const filteredByPhase = data.filter((report: any) => report.nd_site_profile?.nd_phases?.id === Number(phaseId));

        if (phase === "" && region === "") {
            return data;
        }

        if (phase !== "" && region !== "") {
            if (filteredByPhase.length === 0 || filteredByRegion.length === 0) {
                return [];
            }

            const uniqueMap = new Map();
            [...filteredByPhase, ...filteredByRegion].forEach(item => {
                uniqueMap.set(item.id, item);
            });

            return Array.from(uniqueMap.values());
        }

        if (phase !== "") {
            return filteredByPhase.length > 0 ? filteredByPhase : [];
        }

        if (region !== "") {
            return filteredByRegion.length > 0 ? filteredByRegion : [];
        }

    },

    getAllFinanceReports: async (dusp_tp_id?: string) => {
        const { data, error } = await supabase
            .from("nd_finance_report")
            .select(`*, nd_site_profile(*)`);
        if (error) throw error;

        if (dusp_tp_id) {
            return data.filter((report: any) => report.nd_site_profile.dusp_tp_id === dusp_tp_id)
        };

        return data;
    }
};