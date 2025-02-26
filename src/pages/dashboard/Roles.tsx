
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { RoleFormDialog } from "@/components/roles/RoleFormDialog";
import { RoleHeader } from "@/components/roles/RoleHeader";
import { RoleTable } from "@/components/roles/RoleTable";
import { useRoles } from "@/hooks/use-roles";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  users_count: number;
}

const Roles = () => {
  const { roles, isLoading, error, createRole, updateRole } = useRoles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreateRole = async (values: { name: string; description: string }) => {
    await createRole(values);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateRole = async (values: { name: string; description: string }) => {
    if (!editingRole) return;
    await updateRole(editingRole.id, { description: values.description });
    setEditingRole(null);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading roles. Please try again later.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col ml-[240px]">
          <DashboardNavbar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="container mx-auto max-w-6xl space-y-8">
              <RoleHeader onCreateRole={() => setIsCreateDialogOpen(true)} />
              
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <RoleTable 
                  roles={roles || []}
                  onEdit={setEditingRole}
                />
              )}
            </div>
          </main>
        </div>
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
    </SidebarProvider>
  );
};

export default Roles;
