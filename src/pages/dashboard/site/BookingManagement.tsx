import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { BookingManagementDetail } from "@/components/site/BookingManagementDetail"

export const BookingManagement = () => {
    return (
        <DashboardLayout>
            <BookingManagementDetail />
        </DashboardLayout>
    )
}