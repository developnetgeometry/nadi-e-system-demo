import React from 'react';
import { useUserMetadata } from '@/hooks/use-user-metadata';
import { useGetSiteAgreement, useDeleteSiteAgreement } from '@/hooks/site-agreement/use-agreement';
import DataTable, { Column } from '@/components/ui/datatable';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import {
    FileText,
    Calendar,
    Clock,
    Eye,
    Trash2,
    Edit,
    Plus,
    Building,
    X,
    AlertCircle,
    Paperclip
} from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useNavigate } from 'react-router-dom';
import AgreementDialog from '@/components/site/component/AgreementDialog';
import { useSiteProfiles } from "@/components/member/hook/useSiteProfile";

const Agreement = () => {    // Get user metadata for permissions
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

    const isDusp = parsedMetadata?.user_type.startsWith('dusp') || "";
    const isAdmin = parsedMetadata?.user_type.startsWith('super_admin') || "";
    const isMCMC = parsedMetadata?.user_type.startsWith('mcmc') || "";
    const isTP = parsedMetadata?.user_type.startsWith('tp') || "";

    const { profiles = [], loading, error: siteProfilesError } = useSiteProfiles();
    const profileIds = profiles.map((profile: any) => profile.id);

    console.log("Site Profiles:", profileIds); // Debug log

    const { toast } = useToast();
    const navigate = useNavigate();    // Fetch agreement data - only when we have profile IDs
    const {
        data: agreements = [],
        isLoading,
        error
    } = useGetSiteAgreement(profileIds.length > 0 ? profileIds : undefined);
    
    console.log("Agreements data:", agreements); // Debug log
    
    const deleteAgreementMutation = useDeleteSiteAgreement();

    const [confirmDialog, setConfirmDialog] = React.useState<{
        open: boolean;
        agreementId: number | null;
    }>({ open: false, agreementId: null });

    const [viewDialog, setViewDialog] = React.useState<{ open: boolean; agreement: any | null }>({ open: false, agreement: null });

    // Action handlers
    const handleViewAgreement = (agreementId: number) => {
        const agreement = agreements.find((a) => a.id === agreementId);
        setViewDialog({ open: true, agreement });
    };

    const handleEditAgreement = (agreementId: number) => {
        navigate(`/site-management/agreement/form/${agreementId}`);
    };

    const handleDeleteAgreement = (agreementId: number) => {
        setConfirmDialog({ open: true, agreementId });
    };

    const handleConfirmDelete = async () => {
        if (confirmDialog.agreementId == null) return;
        try {
            await deleteAgreementMutation.mutateAsync(confirmDialog.agreementId);
            toast({
                title: `Deleted Agreement ${confirmDialog.agreementId}`,
                variant: "success",
            });
        } catch (error: any) {
            toast({
                title: `Failed to delete Agreement ${confirmDialog.agreementId}`,
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setConfirmDialog({ open: false, agreementId: null });
        }
    };

    const handleCreateAgreement = () => {
        navigate('/site-management/agreement/form');
    };

    // Data table configuration
    const columns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "5%",
            visible: true,
            align: "center"
        },
        {
            key: "site_profile_id.phase_id.name",
            header: "Phase",
            render: (value) => value || "-",
            filterable: true,
            visible: true,
            filterType: "string",
            align: "center",
        },
        // {
        //     key: "site_profile_id.refid_tp",
        //     header: "RefID TP",
        //     render: (value) => value || "-",
        //     filterable: true,
        //     visible: true,
        //     filterType: "string",
        //     align: "center",
        // },
        {
            key: "site_profile_id.refid_mcmc",
            header: "RefID",
            render: (value) => value || "-",
            filterable: true,
            visible: true,
            filterType: "string",
            align: "center",
        },
        {
            key: "site_profile_id.sitename",
            header: (
                <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>Site Name</span>
                </div>
            ),
            render: (value) => value || "-",
            filterable: true,
            visible: true,
            filterType: "string",
            align: "left",
        },
        {
            key: "updated_at",
            header: (
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Updated At</span>
                </div>
            ),
            render: (value) => {
                if (!value) return '-';
                try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return value;
                    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                } catch (e) {
                    return value;
                }
            },
            visible: true,
            align: "center",
            width: "15%",
        },
        {
            key: (row) => (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleViewAgreement(row.id)}
                        title="View details"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                        onClick={() => handleEditAgreement(row.id)}
                        title="Edit agreement"
                    >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeleteAgreement(row.id)}
                        title="Delete agreement"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
            header: "Actions",
            align: "center",
            width: "10%",
            visible: true,
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Site Agreement Management</h1>
                {(isAdmin || isMCMC || isDusp || isTP) && (
                    <Button
                        onClick={handleCreateAgreement}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <Plus size={16} />
                        <span>Create Agreement</span>
                    </Button>
                )}
            </div>            
            {(error || siteProfilesError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                    <AlertCircle size={20} />
                    <span>
                        Error loading: {error ? `agreements - ${(error as Error).message}` : ''}
                        {error && siteProfilesError ? '; ' : ''}
                        {siteProfilesError ? `site profiles - ${siteProfilesError}` : ''}
                    </span>
                </div>
            )}

            {loading && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-blue-700">
                    <span>Loading site profiles...</span>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">                <DataTable
                    data={agreements}
                    columns={columns}
                    pageSize={10}
                    isLoading={isLoading || loading}
                />
            </div>

            <ConfirmationDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
                title="Delete Agreement?"
                description="Are you sure you want to delete this site agreement? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ open: false, agreementId: null })}
            />

            <AgreementDialog
                open={viewDialog.open}
                onOpenChange={(open) => setViewDialog((prev) => ({ ...prev, open }))}
                agreement={viewDialog.agreement}
            />
        </div>
    );
}

export default Agreement;