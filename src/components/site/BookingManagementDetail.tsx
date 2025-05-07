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
    // Upcoming function to get booking data
    // const { data, error, isLoading } = useBookingData();

    return (
        <Tabs defaultValue="PC Bookings" className="w-full grid place-items-center mt-7">
            <TabsList className="bg-white inline-flex h-11 flex-wrap justify-center items-center">
                {
                    tabsMenu.map((menu) => (
                        <TabsTrigger className="text-md px-2 py-1 min-w-max data-[state=active]:bg-muted rounded whitespace-nowrap" key={menu} value={menu}>{menu}</TabsTrigger>
                    ))
                }
            </TabsList>
            <PcBookings value="PC Bookings"/>
            <PcCalender value="PC Calendar" />
            <FacilityBooking value="Facility Bookings" />
            <FacilityCalender value="Facility Calender" />
        </Tabs>
    )
}

const PcBookings = ({value}) => {

    const statsItems = [
        {
            title: "Total PCs",
            value: "0",
            icon: Server,
            description: "",
            iconBgColor: "bg-gray-200",
            iconTextColor: "text-black",
        },
        {
            title: "In Use",
            value: "0",
            icon: RotateCcwSquare,
            description: "",
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-500",
        },{
            title: "Available",
            value: "0",
            icon: CircleCheckBig,
            description: "",
            iconBgColor: "bg-green-100",
            iconTextColor: "text-green-500",
        },
    ]

    return (
        <TabsContent value={value}>
            {/* just for an example content */}
            <h1>{`${value} content`}</h1>
        </TabsContent>
    )
}

const PcCalender = ({value}) => {
    return (
        <TabsContent value={value}>
            {/* just for an example content */}
            <h1>{`${value} content`}</h1>
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