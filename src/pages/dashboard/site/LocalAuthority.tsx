import React from 'react';
import { useUserMetadata } from '@/hooks/use-user-metadata';
import { useGetSiteLocalAuthority, useDeleteSiteLocalAuthority } from '@/hooks/site-local-authority/use-site-local-authority';
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
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useNavigate } from 'react-router-dom';
import LocalAuthorityDialog from '@/components/site/component/LocalAuthorityDialog';
import { useSiteProfiles } from "@/components/member/hook/useSiteProfile";

const LocalAuthority = () => {
  // Get user metadata for permissions
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  const isDusp = parsedMetadata?.user_type.startsWith('dusp') || "";
  const isAdmin = parsedMetadata?.user_type.startsWith('super_admin') || "";
  const isMCMC = parsedMetadata?.user_type.startsWith('mcmc') || "";
  const isTP = parsedMetadata?.user_type.startsWith('tp') || "";

  const { profiles = [], loading, error: siteProfilesError } = useSiteProfiles();
  const profileIds = profiles.map((profile: any) => profile.id);

  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch local authority data - only when we have profile IDs
  const {
    data: localAuthorities = [],
    isLoading,
    error
  } = useGetSiteLocalAuthority(profileIds.length > 0 ? profileIds : []);

  const deleteLocalAuthorityMutation = useDeleteSiteLocalAuthority();

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    localAuthorityId: number | null;
  }>({ open: false, localAuthorityId: null });

  const [viewDialog, setViewDialog] = React.useState<{ open: boolean; localAuthority: any | null }>({ open: false, localAuthority: null });

  // Action handlers
  const handleViewLocalAuthority = (localAuthorityId: number) => {
    const localAuthority = localAuthorities.find((la) => la.id === localAuthorityId);
    setViewDialog({ open: true, localAuthority });
  };

  const handleEditLocalAuthority = (localAuthorityId: number) => {
    navigate(`/site-management/local-authority/form/${localAuthorityId}`);
  };

  const handleDeleteLocalAuthority = (localAuthorityId: number) => {
    setConfirmDialog({ open: true, localAuthorityId });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.localAuthorityId == null) return;
    try {
      await deleteLocalAuthorityMutation.mutateAsync(confirmDialog.localAuthorityId);
      toast({
        title: `Deleted Local Authority ${confirmDialog.localAuthorityId}`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: `Failed to delete Local Authority ${confirmDialog.localAuthorityId}`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirmDialog({ open: false, localAuthorityId: null });
    }
  };

  const handleCreateLocalAuthority = () => {
    navigate('/site-management/local-authority/form');
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
      key: "start_date",
      header: (
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>Start Date</span>
        </div>
      ),
      render: (value) => {
        if (!value) return '-';
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;
          return date.toLocaleDateString();
        } catch (e) {
          return value;
        }
      },
      visible: true,
      align: "center",
      filterable: true,
      filterType: "date",
    },
    {
      key: "end_date",
      header: (
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>End Date</span>
        </div>
      ),
      render: (value) => {
        if (!value) return '-';
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;
          return date.toLocaleDateString();
        } catch (e) {
          return value;
        }
      },
      visible: true,
      align: "center",
      filterable: true,
      filterType: "date",
    },
    {
      key: "file_path",
      header: (
        <div className="flex items-center gap-2">
          <Paperclip size={16} />
          <span>Files</span>
        </div>
      ),
      render: (value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return "-";
        return (
          <div className="flex items-center gap-1">
            <FileText size={16} className="text-blue-600" />
            <span>{value.length} file(s)</span>
          </div>
        );
      },
      visible: true,
      align: "center",
      width: "10%",
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
            onClick={() => handleViewLocalAuthority(row.id)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          {(isAdmin || isMCMC || isDusp || isTP) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
              onClick={() => handleEditLocalAuthority(row.id)}
              title="Edit local authority"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          {(isAdmin || isMCMC || isDusp || isTP) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
              onClick={() => handleDeleteLocalAuthority(row.id)}
              title="Delete local authority"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
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
        <h1 className="text-2xl font-bold">Local Authority Management</h1>
        {(isAdmin || isMCMC || isDusp || isTP) && (
          <Button
            onClick={handleCreateLocalAuthority}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={16} />
            <span>Create Local Authority</span>
          </Button>
        )}
      </div>

      {(error || siteProfilesError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>
            Error loading: {error ? `local authorities - ${(error as Error).message}` : ''}
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

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          data={localAuthorities}
          columns={columns}
          pageSize={10}
          isLoading={isLoading || loading}
        />
      </div>

      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title="Delete Local Authority?"
        description="Are you sure you want to delete this local authority record? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, localAuthorityId: null })}
      />

      <LocalAuthorityDialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog((prev) => ({ ...prev, open }))}
        localAuthority={viewDialog.localAuthority}
      />
    </div>
  );
}

export default LocalAuthority;