import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { fetchSiteClosureRequests, updateSiteClosureRequest, fetchClosure_Status } from "@/components/site/queries/site-closure";
import { SiteClosureRequest, Closure_Status } from "@/components/site/types/site-closure";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/date-utils";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { getStatusMap } from "@/constants/status";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

const SiteClosureApproval = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { userMetadata, isLoading: isMetadataLoading } = useUserMetadata();
    const [userOrganizationId, setUserOrganizationId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (userMetadata) {
            try {
                const metadata = JSON.parse(userMetadata);
                if (metadata?.organization_id) {
                    setUserOrganizationId(metadata.organization_id);
                }
            } catch (error) {
                console.error("Error parsing user metadata:", error);
            }
        }
    }, [userMetadata]);

    const isSuperAdmin = userMetadata?.user_type === "super_admin";
    const isTPUser = userMetadata?.user_group_name === "TP" && !!userMetadata?.organization_id;
    const isDUSPUser = userMetadata?.user_group_name === "DUSP" && !!userMetadata?.organization_id;
    const organizationId = isTPUser || isDUSPUser ? userOrganizationId : null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [STATUS, setSTATUS] = useState<Record<string, number>>({});
    const [showOnlyActionable, setShowOnlyActionable] = useState(true);

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const statusMap = await getStatusMap();
                setSTATUS(statusMap);
            } catch (error) {
                console.error("Error loading statuses:", error);
            }
        };
        loadStatuses();
    }, []);

    useEffect(() => {
        console.log('Subscribing to site closure changes');
        const channel = supabase
            .channel('site_closure_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'nd_site_closure'},
                (payload) => {
                    console.log('Database change detected on status column:', payload);
                    queryClient.invalidateQueries({ queryKey: ["site-closure-requests", organizationId] });
                }
            )
            .subscribe();

        return () => {
            console.log('Unsubscribing from site closure changes');
            supabase.removeChannel(channel);
        };
    }, [organizationId, queryClient]);

    const ROLE_STATUS_MAPPING = {
        TP: [STATUS.APPROVED, STATUS.REJECTED, STATUS.RECOMMENDED].filter(Boolean),
        DUSP: [STATUS.AUTHORIZED, STATUS.DECLINED].filter(Boolean),
    };

    const canActOnRequest = (role: string, currentStatus: number, duration: number | null): boolean => {
        if (role === "TP" && currentStatus === STATUS.SUBMITTED) {
            return true;
        }
        if (role === "DUSP" && currentStatus === STATUS.RECOMMENDED) {
            return true;
        }
        return false;
    };

    const getAllowedStatuses = (role: string, currentStatus: number, duration: number | null): number[] => {
        if (role === "TP" && currentStatus === STATUS.SUBMITTED) {
            if (duration && duration > 2) {
                return ROLE_STATUS_MAPPING.TP;
            }
            return ROLE_STATUS_MAPPING.TP.filter((status) => status !== STATUS.RECOMMENDED);
        }
        if (role === "DUSP" && currentStatus === STATUS.RECOMMENDED) {
            return ROLE_STATUS_MAPPING.DUSP;
        }
        return [];
    };

    const needsAction = (request: SiteClosureRequest): boolean => {
        if (isSuperAdmin) {
            return true;
        }
        if (isTPUser && request.nd_closure_status?.id === STATUS.SUBMITTED) {
            return true;
        }
        if (isDUSPUser && request.nd_closure_status?.id === STATUS.RECOMMENDED) {
            return true;
        }
        return false;
    };

    const { data: requests = [], isLoading: isRequestsLoading, isError: isRequestsError } = useQuery({
        queryKey: ["site-closure-requests", organizationId],
        queryFn: () => fetchSiteClosureRequests(organizationId, isDUSPUser),
        enabled: isSuperAdmin || !!organizationId,
    });

    const { data: statuses = [], isLoading: isStatusesLoading, isError: isStatusesError } = useQuery({
        queryKey: ["closure-statuses"],
        queryFn: fetchClosure_Status,
    });

    const handleUpdateStatus = async (id: string, status_id: string | number) => {
        const numericStatusId = typeof status_id === "string" ? parseInt(status_id, 10) : status_id;

        if (
            (isTPUser && !ROLE_STATUS_MAPPING.TP.includes(numericStatusId)) ||
            (isDUSPUser && !ROLE_STATUS_MAPPING.DUSP.includes(numericStatusId))
        ) {
            toast({
                title: "Action not allowed",
                description: "You are not allowed to update to this status.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await updateSiteClosureRequest(id, numericStatusId);
            queryClient.invalidateQueries({ queryKey: ["site-closure-requests", organizationId] });
            toast({ title: "Request updated successfully.", variant: "default" });
        } catch (error: any) {
            console.error("Error updating site closure request:", error);
            toast({
                title: "Failed to update request.",
                description: error?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: number, statuses: Closure_Status[]) => {
        const statusObj = statuses.find(s => s.id === status);
        if (!statusObj) return <Badge variant="outline">Unknown</Badge>;

        const variants: Record<number, "default" | "destructive" | "outline" | "secondary"> = {
            1: "default",
            2: "outline",
            3: "secondary",
            4: "destructive",
            5: "default",
            6: "secondary",
            7: "destructive",
            8: "default",
        };

        const variant = variants[status] || "outline";
        return <Badge variant={variant}>{statusObj.name}</Badge>;
    };

    if (isRequestsLoading || isStatusesLoading || isMetadataLoading) {
        return <div>Loading...</div>;
    }

    if (isRequestsError || isStatusesError) {
        return <div>Error loading data. Please try again later.</div>;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Site Closure Approval</h1>
                {!isSuperAdmin && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Manage site closure requests.</p>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={showOnlyActionable}
                                onCheckedChange={setShowOnlyActionable}
                            />
                            <span className="text-sm text-gray-600">
                                {showOnlyActionable ? "Show Only Actionable" : "Show All Requests"}
                            </span>
                        </div>
                    </div>
                )}
                <div className="rounded-md border">
                    {requests.length === 0 ? (
                        <p className="p-4">No site closure requests available.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Site Name</TableHead>
                                    <TableHead>Standard Code</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead>Subcategories</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests
                                    .filter(request =>
                                        isSuperAdmin ||
                                        (isTPUser && request.nd_site_profile?.organizations?.id === organizationId) ||
                                        (isDUSPUser &&
                                            request.nd_site_profile?.organizations?.parent_id?.id === organizationId)
                                    )
                                    .filter(request => showOnlyActionable ? needsAction(request) : true)
                                    .map((request: SiteClosureRequest, index) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{request?.nd_site_profile?.sitename || "N/A"}</TableCell>
                                            <TableCell>{request?.nd_site_profile?.nd_site?.[0]?.standard_code || "N/A"}</TableCell>
                                            <TableCell>
                                                {request.nd_closure_categories
                                                    ? request.nd_closure_categories.eng
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {request.nd_closure_subcategories
                                                    ? request.nd_closure_subcategories.eng
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>{request.duration || "N/A"}</TableCell>
                                            <TableCell>{formatDate(request.close_start)}</TableCell>
                                            <TableCell>{formatDate(request.close_end)}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(request.nd_closure_status?.id, statuses)}
                                            </TableCell>
                                            <TableCell>
                                                {isSuperAdmin ||
                                                    (isTPUser && request.nd_closure_status?.id === STATUS.SUBMITTED) ||
                                                    (isDUSPUser && request.nd_closure_status?.id === STATUS.RECOMMENDED) ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <span className="sr-only">Open menu</span>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="w-5 h-5"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                                                    />
                                                                </svg>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {statuses
                                                                .filter(status =>
                                                                    isSuperAdmin ||
                                                                    (isTPUser &&
                                                                        getAllowedStatuses("TP", request.nd_closure_status?.id, request.duration).includes(status.id)) ||
                                                                    (isDUSPUser &&
                                                                        getAllowedStatuses("DUSP", request.nd_closure_status?.id, request.duration).includes(status.id))
                                                                )
                                                                .map((status: Closure_Status) => (
                                                                    <DropdownMenuItem
                                                                        key={status.id}
                                                                        onClick={() => handleUpdateStatus(request.id, String(status.id))}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        {status.name}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <span>No actions available</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SiteClosureApproval;
