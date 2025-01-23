import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Save, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

const RoleConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Fetch role data
  const { data: roleData, isLoading: isRoleLoading } = useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch permissions data
  const { data: permissions, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module');
      
      if (error) throw error;
      return data as Permission[];
    }
  });

  // Fetch role permissions
  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', id);
      
      if (error) throw error;
      return data as RolePermission[];
    }
  });

  // Update role mutation
  const updateRole = useMutation({
    mutationFn: async () => {
      // Update role details
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: roleName,
          description: roleDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (roleError) throw roleError;

      // Delete existing permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', id);

      if (deleteError) throw deleteError;

      // Insert new permissions
      if (selectedPermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(
            selectedPermissions.map(permissionId => ({
              role_id: id,
              permission_id: permissionId
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', id] });
      toast({
        title: "Success",
        description: "Role configuration saved successfully",
      });
    },
    onError: (error) => {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: "Failed to save role configuration",
        variant: "destructive",
      });
    }
  });

  // Delete role mutation
  const deleteRole = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      navigate('/dashboard/roles');
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (roleData) {
      setRoleName(roleData.name);
      setRoleDescription(roleData.description);
    }
  }, [roleData]);

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map(rp => rp.permission_id));
    }
  }, [rolePermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  if (isRoleLoading || isPermissionsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <SidebarTrigger />
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-3 text-primary" />
              <h1 className="text-3xl font-bold">Configure Role</h1>
            </div>
            <div className="flex gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Role
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the role
                      and remove it from all users who have it assigned.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRole.mutate()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => updateRole.mutate()}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Enter role description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions?.reduce((acc: JSX.Element[], permission) => {
                    // Check if we need to add a module header
                    const lastPermission = acc[acc.length - 1];
                    if (!lastPermission || lastPermission.key !== `module-${permission.module}`) {
                      acc.push(
                        <div key={`module-${permission.module}`} className="mt-6 first:mt-0">
                          <h3 className="text-lg font-semibold capitalize mb-4">{permission.module}</h3>
                        </div>
                      );
                    }
                    
                    // Add the permission toggle
                    acc.push(
                      <div
                        key={permission.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">
                            {permission.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {permission.description}
                          </div>
                        </div>
                        <Switch
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                      </div>
                    );
                    
                    return acc;
                  }, [])}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RoleConfig;