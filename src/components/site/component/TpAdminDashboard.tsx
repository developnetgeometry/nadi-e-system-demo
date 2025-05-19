import StatsCard from "../../dashboard/StatCard";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Site } from "@/types/site"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react"
import { Download, Eye } from "lucide-react";
import { PaginationTable } from "./PaginationTable";
import { exportToCSV } from "@/utils/export-utils";

interface TpAdminDashboardProps {
    selectedSite: Site
    setSelecTedSite: React.Dispatch<React.SetStateAction<Site | any>>
    tpsSites: Site[] | any[]
}

export const TpAdminDashBoard = ({
    selectedSite,
    setSelecTedSite,
    tpsSites
}: TpAdminDashboardProps) => {
    console.log("tps sites from tp admin comp", tpsSites)
    // state management tp sites
    const [sites, setSites] = useState<Site[]>(tpsSites);
    const [searchInput, setSearchInput] = useState("");
    console.log("sites state tp admin dashboard", sites)

    function handleSelectedSite(siteId: number) {
        setSelecTedSite(sites.find(site => site.id === Number(siteId)));
    }

    function handleSearch(searchInput: string) {

        let sitesTofiltered = tpsSites;

        sitesTofiltered = sitesTofiltered.filter((site) => site.nd_site_profile.sitename.includes(searchInput));

        setSites(sitesTofiltered);
    }

    useEffect(() => {
        handleSearch(searchInput)
    }, [searchInput])

    // PCS in this site (total pc, in use, available)

    const initialTotalSites = useRef(tpsSites.length);

    // Overview data 
    const siteOverView = [
        {
            title: "Total Sites",
            value: String(initialTotalSites.current),
            description: "",
            // iconTextColor: "text-green-500",
        },
        {
            title: "Total Pcs",
            value: "3",
            description: "",
            // iconTextColor: "text-green-500",
        },
        {
            title: "PCs In Use",
            value: "2",
            description: "",
            customValueColorClass: "text-blue-500"
            // iconTextColor: "text-green-500",
        },
        {
            title: "Pcs available",
            value: "1",
            description: "",
            customValueColorClass: "text-green-500"
            // iconTextColor: "text-green-500",
        },
    ]

    // Table data
    const headTable = [
        { key: "siteName", label: "Site Name"},
        { key: "location", label: "Location"},
        { key: "totalPcs", label: "Total PCs"},
        { key: "inUse", label: "In Use"},
        { key: "available", label: "Available"},
        { key: "status", label: "Status"},
        { key: "action", label: "Action"}
    ];

    const bodyTableData = sites.map((site) => {
        return {
            id: site.id,
            siteName: site?.nd_site_profile?.sitename,
            location: site?.nd_site_profile?.state_id,
            totalPcs: "8",
            inUse: "3",
            available: "5",
            status: "1 in Maintenance",
            action: "View"
        }
    })


    // trigger selected site to open booking && site selected

    return (
        <>
            <header className="flex flex-col justify-start">
                <h1 className="text-2xl font-bold">TP Admin Dashboard</h1>
                <p className="text-gray-600">Manage TP sites and PC bookings</p>
            </header>
            <div className="p-6 bg-white rounded-md border border-gray-200 mt-6">
                <h1 className="text-2xl font-semibold mb-3">Overview</h1>
                <div className="flex gap-3 items-center">
                    {siteOverView.map((site) => (
                        <StatsCard
                            className="flex-grow border border-gray-200"
                            title={site.title}
                            value={site.value}
                            customValueColorClass={site?.customValueColorClass}
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <Input
                    className="w-[30%]"
                    type="search"
                    placeholder="Search Site..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
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