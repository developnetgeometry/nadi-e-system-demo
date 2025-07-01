import { useNavigate } from "react-router-dom";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemberStatsCards from "@/components/member/MemberStatsCards";
import DataTable, { Column } from "@/components/ui/datatable";
import { useFetchMembersTp } from "../hooks/use-member-data-tp";

const McmcMemberList = () => {

    const navigate = useNavigate();
    const { data: membersData, isLoading } = useFetchMembersTp(); // Use the new hook
    const stats = {
        totalMembers: membersData?.length || 0,
        premiumMembers: membersData?.filter((member) => member.community_status).length || 0,
        activeMembers:
            membersData?.filter(
                (member) => member.status_membership?.name === "Active"
            ).length || 0,
        lastRegistration:
            membersData?.filter((member) => member.status_entrepreneur).length || 0,
    };



    const handleViewDetailsClick = (userId: string) => {
        navigate(`/member-management/profile?id=${userId}`);
    };

    // DataTable columns configuration
    const columns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "5%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "membership_id",
            header: "ID",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "10%",
            render: (value) => value || "-",
        },
        {
            key: "identity_no",
            header: "Identity No",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "10%",
            render: (value) => value || "-",
        },
        {
            key: "fullname",
            header: "Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "20%",
            render: (value) => value || "-",
        },
        {
            key: "email",
            header: "Email",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "20%",
            render: (value) => value || "-",
        },
        {
            key: "status_membership.name",
            header: "Status",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                >
                    {value || "N/A"}
                </Badge>
            ),
        },
        {
            key: (row) => (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDetailsClick(String(row.user_id))}
                >
                    <Users className="h-4 w-4" />
                </Button>
            ),
            header: "Actions",
            align: "center" as const,
            width: "10%",
            visible: true,
        },
    ];

    return (
        <div>
            <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Left side: Title and subtitle */}
                    <div>
                        <h1 className="text-xl font-bold">Member Management</h1>
                        <p className="text-gray-500 mt-1">View and manage all members in the system</p>
                    </div>

                    {/* Right side: Button */}
                    {/* <Button
                        className="flex items-center gap-2 self-start sm:self-auto"
                        onClick={() => navigate(`/member-management/registration`)}
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New Member
                    </Button> */}
                </div>

                {/* Stats card */}
                <MemberStatsCards stats={stats} />

                {/* Members Table */}
                <div className=" p-6 rounded-lg border border-gray-200 shadow-sm">
                    <DataTable
                        data={membersData || []}
                        columns={columns}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default McmcMemberList;