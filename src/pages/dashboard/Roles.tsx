import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Users, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  users_count: number;
}

const Roles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      console.log('Fetching roles data...');
      
      try {
        // First fetch basic role data
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id, name, description, created_at');
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw rolesError;
        }

        if (!rolesData) {
          throw new Error('No roles data returned');
        }

        console.log('Roles data fetched:', rolesData);

        // Then get user counts for each role
        const rolesWithCounts = await Promise.all(
          rolesData.map(async (role) => {
            const { count } = await supabase
              .from('user_roles')
              .select('*', { count: 'exact', head: true })
              .eq('role_id', role.id);

            return {
              ...role,
              users_count: count || 0
            };
          })
        );

        console.log('Roles with counts:', rolesWithCounts);
        return rolesWithCounts;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch roles data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  if (error) {
    console.error('Rendering error state:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading roles. Please try again later.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Roles & Permissions</h1>
              <Button onClick={() => navigate("/dashboard/roles/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Role
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles?.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                            {role.name}
                          </div>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {role.users_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(role.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/roles/${role.id}`)}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Roles;