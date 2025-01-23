import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const RoleConfig = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  
  const { data: roleData, isLoading } = useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setRoleName(data.name);
      setRoleDescription(data.description);
      return data;
    }
  });

  const permissions: Permission[] = [
    { id: "1", name: "View Dashboard", description: "Access to view dashboard", enabled: true },
    { id: "2", name: "Manage Users", description: "Create, edit, and delete users", enabled: false },
    { id: "3", name: "Manage Roles", description: "Create and configure roles", enabled: false },
    { id: "4", name: "View Reports", description: "Access to view reports", enabled: true },
    { id: "5", name: "Manage Settings", description: "Configure system settings", enabled: false },
  ];

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('roles')
        .update({
          name: roleName,
          description: roleDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: "Failed to save role configuration",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
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
                  {permissions.map((permission) => (
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
                        checked={permission.enabled}
                        onCheckedChange={() => {
                          console.log(`Toggle ${permission.name}`);
                        }}
                      />
                    </div>
                  ))}
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