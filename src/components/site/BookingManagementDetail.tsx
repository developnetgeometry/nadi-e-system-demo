import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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