
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useOrganizations } from "@/hooks/use-organizations";
import { OrganizationCard } from "@/components/organizations/OrganizationCard";
import { OrganizationTree } from "@/components/organizations/OrganizationTree";
import { OrganizationFormDialog } from "@/components/organizations/OrganizationFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building, Plus, Search, List, Grid3X3 } from "lucide-react";
import { Organization } from "@/types/organization";

const Organizations = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "tree">("grid");
  
  const {
    useOrganizationsQuery,
    useCreateOrganizationMutation,
    useDeleteOrganizationMutation,
  } = useOrganizations();
  
  const { data: organizations = [], isLoading } = useOrganizationsQuery();
  const createOrganizationMutation = useCreateOrganizationMutation();
  const deleteOrganizationMutation = useDeleteOrganizationMutation();
  
  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter(
    (org) => org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find parent names for display
  const getParentName = (parentId: string | undefined) => {
    if (!parentId) return undefined;
    const parent = organizations.find((org) => org.id === parentId);
    return parent?.name;
  };

  const handleCreateOrganization = (values: any) => {
    createOrganizationMutation.mutate(values);
  };

  const handleDeleteOrganization = () => {
    if (organizationToDelete) {
      deleteOrganizationMutation.mutate(organizationToDelete.id, {
        onSuccess: () => setOrganizationToDelete(null)
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Organizations</h1>
            <p className="text-muted-foreground">
              Manage your organizational hierarchy and user assignments
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("tree")}
            >
              <List className="h-4 w-4 mr-2" />
              Tree
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading organizations...</div>
        ) : filteredOrganizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No organizations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try a different search term"
                : "Get started by creating your first organization"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                parentName={getParentName(organization.parent_id)}
                onEdit={() => navigate(`/admin/organizations/${organization.id}`)}
                onDelete={() => setOrganizationToDelete(organization)}
                onManageUsers={() => navigate(`/admin/organizations/${organization.id}?tab=users`)}
                onViewDetails={() => navigate(`/admin/organizations/${organization.id}`)}
              />
            ))}
          </div>
        ) : (
          <OrganizationTree
            organizations={filteredOrganizations}
            onSelect={(org) => navigate(`/admin/organizations/${org.id}`)}
          />
        )}
      </div>

      <OrganizationFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateOrganization}
      />

      <AlertDialog 
        open={!!organizationToDelete} 
        onOpenChange={(open) => !open && setOrganizationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the organization "{organizationToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrganization}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Organizations;
