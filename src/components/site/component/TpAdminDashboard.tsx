import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatsCard from "../../dashboard/StatCard";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Site } from "@/types/site"
import { useEffect, useMemo, useRef, useState } from "react"
import { Download, RefreshCcw } from "lucide-react";
import { exportToCSV } from "@/utils/export-utils";
import { Asset } from "@/types/asset";
import { PaginationTable } from "./PaginationTable";
import type { SiteProfile } from "@/types/site";
import { useBookingQueries } from "@/hooks/booking/use-booking-queries";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface TpAdminDashboardProps {
    pcsInTpsAdminSite: Asset[]
    setSelecTedSite: React.Dispatch<React.SetStateAction<SiteProfile>>
    tpsSites: SiteProfile[]
}

export const TpAdminDashBoard = ({
    pcsInTpsAdminSite,
    setSelecTedSite,
    tpsSites
}: TpAdminDashboardProps) => {
    console.log("PC in tp admin site", pcsInTpsAdminSite)
    const {
        useAllRegion,
        useAllState
    } = useBookingQueries();
    const {
        data: allRegion,
        isLoading: isAllRegionLoading
    } = useAllRegion();
    const {
        data: allState,
        isLoading: isAllStateLoading
    } = useAllState();
    const [sites, setSites] = useState<SiteProfile[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [region, setRegion] = useState("All Region");
    const [state, setState] = useState("All State");
    const [bodyTableData, setBodyTableData] = useState([]);

    const initialTotalSites = useRef(tpsSites?.length);

    const isLoadingPCs = !pcsInTpsAdminSite || pcsInTpsAdminSite.length === 0;
    const { totalPc, pcInUse } = useMemo(() => {
        const totalPc = pcsInTpsAdminSite.length;
        const pcInUse = pcsInTpsAdminSite.filter(pc => pc?.nd_booking?.some(b => b?.is_using)).length;
    
        return {
            totalPc,
            pcInUse
        };
    }, [pcsInTpsAdminSite]);

    useEffect(() => {
        setSites(tpsSites);
    }, [tpsSites])

    useEffect(() => {
        let isCanceled = false;

        function formatTableBody() {
            if (sites.length > 0) {
                const handledBodyTable = handleBodyTableData(sites);

                if (!isCanceled) {
                    setBodyTableData(handledBodyTable);
                }

            }
        }

        formatTableBody();

        return () => {
            isCanceled = true;
        };

    }, [sites]);

    const handleSelectedSite = (siteId: number) => {
        setSelecTedSite(sites?.find(site => site.id === Number(siteId))!);
    }

    const handleFilter = (searchInput: string, regionName: string, stateName: string) => {

        let sitesTofiltered = [...tpsSites];

        if (regionName !== "All Region") {
            sitesTofiltered = sitesTofiltered.filter(site => site?.nd_region?.eng === regionName);
        }

        if (stateName !== "All State") {
            sitesTofiltered = sitesTofiltered.filter(site => site?.nd_state?.name === stateName)
        }

        if (searchInput.trim() !== "") {
            sitesTofiltered = sitesTofiltered.filter((site) => site?.sitename.toLowerCase().includes(searchInput.toLowerCase()));
        }

        setSites(sitesTofiltered);
    }

    const handleBodyTableData = (tpsSites: SiteProfile[]) => {
        const formattedTableData = [];

        for (const site of tpsSites) {
            const totalPcs = site?.nd_site?.reduce((sum, s) => sum + (s.nd_asset?.length || 0), 0);
            let inUse = 0;
            let available = 0;

            for (const repSite of site?.nd_site || []) {
                for (const asset of repSite.nd_asset || []) {
                    const bookings = asset.nd_booking || [];

                    const isInUse = bookings.length > 0 && bookings.some(b => b.is_using === true);
                    const isAvailable = bookings.length === 0 || bookings.every(b => b.is_using === false);

                    if (isInUse) {
                        inUse++;
                    } else if (isAvailable) {
                        available++;
                    }
                }
            }

            formattedTableData.push({
                id: site.id,
                siteName: site?.sitename,
                state: site?.nd_state?.name,
                region: site?.nd_region?.eng,
                totalPcs: totalPcs,
                inUse: inUse,
                available: available,
                maintenance: "0 in Maintenance",
                action: "View"
            });
        }

        return formattedTableData;
    }

    const siteOverView = [
        {
            title: "Total Sites",
            value: String(initialTotalSites.current),
            description: "",
        },
        {
            title: "Total Pcs",
            value: totalPc,
            description: "",
        },
        {
            title: "PCs In Use",
            value: pcInUse,
            description: "",
            customValueColorClass: "text-blue-500"
        },
        {
            title: "Pcs available",
            value: pcsInTpsAdminSite.filter(pc =>
                !pc?.nd_booking?.some(b => b?.is_using)
            ).length.toString(),
            description: "",
            customValueColorClass: "text-green-500"
        },
    ];

    const headTable = [
        { key: "siteName", label: "Site Name" },
        { key: "state", label: "State" },
        { key: "region", label: "Region" },
        { key: "totalPcs", label: "Total PCs" },
        { key: "inUse", label: "In Use" },
        { key: "available", label: "Available" },
        { key: "maintenance", label: "Maintenance" },
        { key: "action", label: "Action" }
    ];

    if (
        isAllRegionLoading ||
        isAllStateLoading ||
        isLoadingPCs
    ) {
        return <LoadingSpinner />
    }

    return (
        <>
            <header className="flex flex-col justify-start">
                <h1 className="text-2xl font-bold">TP Admin Dashboard</h1>
                <p className="text-gray-600">Manage Facilities and PCs bookings</p>
            </header>

            <div className="p-6 bg-white rounded-md border border-gray-200 mt-6">
                <h1 className="text-2xl font-semibold mb-3">Overview</h1>
                <div className="flex gap-3 items-center">
                    {siteOverView.map((site, idx) => (
                        <StatsCard
                            key={idx}
                            className="flex-grow border border-gray-200"
                            title={site.title}
                            value={site.value}
                            customValueColorClass={site?.customValueColorClass}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-3 flex-grow">
                    <Input
                        className="w-[30%]"
                        type="search"
                        placeholder="Search Site..."
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value)
                            handleFilter(e.target.value, region, state)
                        }}
                    />
                    <Select defaultValue="All State" onValueChange={(value) => {
                        setState(value)
                        handleFilter(searchInput, region, value)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={`Select State`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    [{ name: "All State" }, ...allState].map((state) => (
                                        <SelectItem key={state.name} value={state.name}>{state.name}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="All Region" onValueChange={(value) => {
                        setRegion(value)
                        handleFilter(searchInput, value, state)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={`Select Region`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    [{eng: "All Region"}, ...allRegion].map((region) => (
                                        <SelectItem key={region.eng} value={region.eng}>{region.eng}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => exportToCSV(bodyTableData, "sites")} className="flex gap-2">
                    <Download />
                    Export
                </Button>
            </div>
            <div className="rounded-md">
                <PaginationTable
                    bodyTableData={bodyTableData}
                    handleSelectedSite={handleSelectedSite}
                    headTable={headTable}
                />
            </div>
        </>
    )
}