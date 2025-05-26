import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RoleFormDialog } from "@/components/roles/RoleFormDialog";
import { RoleHeader } from "@/components/roles/RoleHeader";
import { RoleTable } from "@/components/roles/RoleTable";
import { useRoles } from "@/hooks/use-roles";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  users_count: number;
}

const Roles = () => {
  const navigate = useNavigate();
  const { roles, isLoading, error, createRole, updateRole } = useRoles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreateRole = async (values: {
    name: string;
    description: string;
  }) => {
    await createRole(values);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateRole = async (values: {
    name: string;
    description: string;
  }) => {
    if (!editingRole) return;
    await updateRole(editingRole.id, { description: values.description });
    setEditingRole(null);
  };

  const handleViewPermissions = () => {
    navigate("/admin/permissions");
  };

  if (error) {
    return (
      <div>
        <div className="p-4 text-red-500">
          Error loading roles. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1   space-y-8">
        <div className="flex justify-between items-center">
          <RoleHeader onCreateRole={() => setIsCreateDialogOpen(true)} />
          <Button
            variant="outline"
            onClick={handleViewPermissions}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Permissions
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <RoleTable roles={roles || []} onEdit={setEditingRole} />
        )}
      </div>

      <RoleFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRole}
      />

      <RoleFormDialog
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        initialData={editingRole || undefined}
        onSubmit={handleUpdateRole}
      />
    </div>
  );
};

export default Roles;
