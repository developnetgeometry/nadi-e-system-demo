import { OrganizationFormDialog } from "./OrganizationFormDialog";
import { OrganizationHeader } from "./details/OrganizationHeader";
import { OrganizationInfo } from "./details/OrganizationInfo";
import { DeleteOrganizationDialog } from "./details/DeleteOrganizationDialog";
import { useOrganizationDetails } from "./details/useOrganizationDetails";
import { OrganizationUserList } from "./OrganizationUserList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/organizations")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Organization Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Organization
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Organization
          </Button>
        </div>
      </div>

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
