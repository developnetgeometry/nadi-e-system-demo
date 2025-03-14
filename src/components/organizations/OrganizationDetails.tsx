import { OrganizationFormDialog } from "./OrganizationFormDialog";
import { OrganizationHeader } from "./details/OrganizationHeader";
import { OrganizationInfo } from "./details/OrganizationInfo";
import { DeleteOrganizationDialog } from "./details/DeleteOrganizationDialog";
import { useOrganizationDetails } from "./details/useOrganizationDetails";
import { Button } from "@/components/ui/button";

export function OrganizationDetails() {
  const {
    organization,
    isLoading,
    error,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleUpdateOrganization,
    handleDeleteOrganization,
    navigate,
  } = useOrganizationDetails();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        Loading organization details...
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex flex-col items-center p-8">
        <p className="text-destructive">Error loading organization details</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/organizations")}
        >
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrganizationHeader
        onEditClick={() => setIsEditDialogOpen(true)}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />

      <OrganizationInfo organization={organization} />

      <OrganizationFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        organization={organization}
        onSubmit={handleUpdateOrganization}
      />

      <DeleteOrganizationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        organization={organization}
        onConfirm={handleDeleteOrganization}
      />
    </div>
  );
}
