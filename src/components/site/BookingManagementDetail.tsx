import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleCheckBig, RotateCcwSquare, Server } from "lucide-react";
import { StatsCard } from "../dashboard/StatsCard";
import FilterBar from "./component/FilterBar";
import { Badge } from "../ui/badge";
import DataCard from "./component/DataCard";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAssets } from "@/hooks/use-assets";
import { UseQueryResult } from "@tanstack/react-query";
import { Asset } from "@/types/asset";
import { useBookingMutation } from "@/hooks/booking/use-booking-mutation";

type FilterParams = {
    pcAvailability: string,
    pcTypeTabs: string,
    searchQuery?: string
};

const tabsMenu = ["PC Bookings", "PC Calendar", "Facility Bookings", "Facility Calendar"];

export const BookingManagementDetail = () => {
    return (
        <>
            <BookingHeader />
            <BookingContent />
        </>
    )
}

const BookingHeader = () => {
    return (
        <section className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-extrabold">PC Booking Management</h1>
            <p className="text-muted-foreground mt-2">Monitor and manage PC usage</p>
        </section>
    )
}

const BookingContent = () => {
    const { useAssetsByTypeQuery } = useAssets();

    const assetIdsPc = 1;
    const { data: pcs = [], isLoading } = useAssetsByTypeQuery(assetIdsPc);

    return (
        <Tabs defaultValue="PC Bookings" className="w-full grid place-items-center mt-7">
            <TabsList className="bg-white inline-flex h-11 flex-wrap justify-center gap-2 items-center">
                {
                    tabsMenu.map((menu) => (
                        <TabsTrigger className="text-md px-2 py-1 min-w-max data-[state=active]:bg-muted rounded whitespace-nowrap" key={menu} value={menu}>{menu}</TabsTrigger>
                    ))
                }
            </TabsList>
            <PcBookings 
                value="PC Bookings" 
                pcStats={{
                    totalPcs: isLoading ? 0 : pcs.length,
                    pcInUse: 0,
                    pcAvailable: 0
                }}
            />
            <PcCalender 
                value="PC Calendar" 
            />
            <FacilityBooking 
                value="Facility Bookings" 
            />
            <FacilityCalender 
                value="Facility Calendar" 
            />
        </Tabs>
    )
}

interface PcBookingProps {
    value: string,
    pcStats: {
        totalPcs: number,
        pcInUse: number,
        pcAvailable: number
    }
}

const PcBookings = ({value, pcStats}: PcBookingProps) => {

    const statsItems = [
        {
            title: "Total PCs",
            value: String(pcStats.totalPcs),
            icon: Server,
            description: "",
            iconBgColor: "bg-gray-200",
            iconTextColor: "text-black",
        },
        {
            title: "In Use",
            value: String(pcStats.pcInUse),
            icon: RotateCcwSquare,
            description: "",
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-500",
        },{
            title: "Available",
            value: String(pcStats.pcAvailable),
            icon: CircleCheckBig,
            description: "",
            iconBgColor: "bg-green-100",
            iconTextColor: "text-green-500",
        },
    ]

    return (
        <TabsContent className="w-full mt-6" value={value}>
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {
                    statsItems.map((item) => (
                        <StatsCard key={item.title} {...item} />
                    ))
                }
            </section>
            <PcMainContent />
        </TabsContent>
    )
}

const PcCalender = ({value}) => {
    // Handle post new booking
    const { useAssetMutation } = useBookingMutation();

    return (
        <TabsContent value={value}>
            
        </TabsContent>
    )
}

const FacilityBooking = ({value}) => {
    return (
        <TabsContent value={value}>
            {/* just for an example content */}
            <h1>{`${value} content`}</h1>
        </TabsContent>
    )
}

const FacilityCalender = ({value}) => {
    return (
        <TabsContent value={value}>
            {/* just for an example content */}
            <h1>{`${value} content`}</h1>
        </TabsContent>
    )
}

const PcMainContent = () => {

    return (
        <section className="mt-6 flex flex-col" id="pc status">
            <PcStatus />
            <ResentPcBooking />
        </section>
    )
}

const PcStatus = () => {

    const statusBadges = [
        {
            name: "Available",
            customClass: "bg-green-200 text-green-600 hover:bg-green-300 font-semibold"
        },
        {
            name: "In Use",
            customClass: "bg-blue-200 text-blue-600 hover:bg-blue-300 font-semibold"
        },
        {
            name: "Maintenance",
            customClass: "bg-red-200 text-red-600 hover:bg-red-300 font-semibold"
        }
    ];

    // Upcoming function to get pcs data
    // const { data, error, isLoading } = usePcsData();
    const Pcs = [
        {
            status: 'available',
            type: 'gaming',
            name: 'PC001',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-green-200 text-green-600 hover:bg-green-300 font-semibold"
        },
        {
            status: 'available',
            type: 'gaming',
            name: 'PC002',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-green-200 text-green-600 hover:bg-green-300 font-semibold"
        },{
            status: 'available',
            type: 'gaming',
            name: 'PC003',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-green-200 text-green-600 hover:bg-green-300 font-semibold"
        },{
            status: 'available',
            type: 'gaming',
            name: 'PC004',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-green-200 text-green-600 hover:bg-green-300 font-semibold"
        },{
            status: 'in-use',
            type: 'gaming',
            name: 'PC005',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-blue-200 text-blue-600 hover:bg-blue-300 font-semibold"
        },{
            status: 'in-use',
            type: 'gaming',
            name: 'PC006',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-blue-200 text-blue-600 hover:bg-blue-300 font-semibold"
        },{
            status: 'in-use',
            type: 'standard',
            name: 'PC007',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-blue-200 text-blue-600 hover:bg-blue-300 font-semibold"
        },{
            status: 'in-use',
            type: 'standard',
            name: 'PC008',
            spec: 'RTX3060, i7',
            staffName: 'Farhan',
            startDate: '14:30',
            duration: '1h 30m',
            icon: <Server/>,
            customClass: "bg-blue-200 text-blue-600 hover:bg-blue-300 font-semibold"
        },
    ];

    const [pcs, setPcs] = useState([]);

    function onFilterChange({ pcAvailability, pcTypeTabs, searchQuery }: FilterParams) {
        let filtered = Pcs;

        if (pcAvailability !== "all") {
            filtered = filtered.filter((pc) => pc.status === pcAvailability);
        }

        if (pcTypeTabs !== "all") {
            filtered = filtered.filter((pc) => pc.type === pcTypeTabs);
        }

        if (!!searchQuery) {
            filtered = filtered.filter((pc) => pc.name.includes(searchQuery));
        }

        setPcs(filtered);
    }

    useEffect(() => {
        onFilterChange({ pcAvailability:"all", pcTypeTabs: "all"})
    }, []);

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">PC Status</h1>
                <div className="flex gap-2">
                    {statusBadges.map(({ name, customClass}) => (
                        <Badge key={name} className={`${customClass}`}>{name}</Badge>
                    ))}
                </div>
            </div>
            <div>
                <FilterBar className="flex mt-6 justify-between" onFilterChange={onFilterChange} showDateRange={false} showRegion={false} showCenterType={false} showPcBookingFilter={true} />
                <div className="grid grid-cols-4 gap-5 mt-4">
                        {
                            pcs.map((pc) => (
                                <DataCard 
                                    title={pc.type} 
                                    value={pc.name} 
                                    description={pc.spec}
                                    icon={pc.icon}
                                    name={pc.staffName}
                                    label={( <Badge className={`${pc.customClass}`}>{pc.status}</Badge> )}
                                    footer={`started: ${pc.startDate} Duration: ${pc.duration}`}
                                />
                            ))
                        }
                </div>
            </div>
        </>
    )
}

const ResentPcBooking = () => {

    const headTable = ["User", "PC", "Start Time", "End Time", "Duration"];

    // Upcoming custom hooks to get PC booking data
    // const { data, isLoading, error } = useBookingPc();
    const recentBooking = [
        {
            userName: "siti aminah",
            pcName: "PC-001",
            startTime: "14:30",
            endTime: "16:00",
            duration: "1h 30m"
        },
        {
            userName: "siti aminah",
            pcName: "PC-001",
            startTime: "14:30",
            endTime: "16:00",
            duration: "1h 30m"
        },{
            userName: "siti aminah",
            pcName: "PC-001",
            startTime: "14:30",
            endTime: "16:00",
            duration: "1h 30m"
        },{
            userName: "siti aminah",
            pcName: "PC-001",
            startTime: "14:30",
            endTime: "16:00",
            duration: "1h 30m"
        },{
            userName: "siti aminah",
            pcName: "PC-001",
            startTime: "14:30",
            endTime: "16:00",
            duration: "1h 30m"
        }
    ];

    return (
        <div className="mt-8 space-y-7 overflow-hidden">
                <h1 className="font-bold text-2xl text-center">Recent Booking</h1>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <Table className="w-full table-auto border-collapse text-sm">
                <TableHeader>
                    <TableRow>
                        {
                            headTable.map((head) => (
                                <TableHead key={head}>{head}</TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        recentBooking.map((bookingItem, index) => (
                            <TableRow className="hover:bg-gray-200">
                                <TableCell>{bookingItem.userName}</TableCell>
                                <TableCell>{bookingItem.pcName}</TableCell>
                                <TableCell>{bookingItem.startTime}</TableCell>
                                <TableCell>{bookingItem.endTime}</TableCell>
                                <TableCell>{bookingItem.duration}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                </Table>
                </div>
            </div>
    )
}