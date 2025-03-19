
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizations } from "@/hooks/use-organizations";
import { useFileUpload } from "@/hooks/use-file-upload";

export function useOrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    useOrganizationQuery, 
    useOrganizationUsersQuery,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation
  } = useOrganizations();
  
  const { deleteFile } = useFileUpload();

  const { 
    data: organization, 
    isLoading, 
    error 
  } = useOrganizationQuery(id!);
  
  const { data: organizationUsers = [] } = useOrganizationUsersQuery(id!);
  const updateOrganizationMutation = useUpdateOrganizationMutation();
  const deleteOrganizationMutation = useDeleteOrganizationMutation();

  const handleUpdateOrganization = async (values: any) => {
    // If logo has changed and there was an old one, delete it
    if (organization?.logo_url && 
        values.logo_url && 
        values.logo_url !== organization.logo_url) {
      // Delete the old logo file
      try {
        await deleteFile('organization_logos', organization.logo_url);
      } catch (error) {
        console.error('Error deleting old logo:', error);
        // Continue with update even if deletion fails
      }
    }
    
    updateOrganizationMutation.mutate({ ...organization, ...values });
  };

  const handleDeleteOrganization = async () => {
    // If the organization has a logo, try to delete it first
    if (organization?.logo_url) {
      try {
        await deleteFile('organization_logos', organization.logo_url);
      } catch (error) {
        console.error('Error deleting organization logo:', error);
        // Continue with deletion even if logo deletion fails
      }
    }
    
    deleteOrganizationMutation.mutate(id!, {
      onSuccess: () => {
        navigate("/dashboard/organizations");
      }
    });
  };

  return {
    id,
    organization,
    organizationUsers,
    isLoading,
    error,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleUpdateOrganization,
    handleDeleteOrganization,
    navigate
  };
}
