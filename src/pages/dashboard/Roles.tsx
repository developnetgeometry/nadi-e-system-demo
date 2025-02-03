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
          <main className="flex-1 p-8 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                  <p className="text-muted-foreground">
                    Manage user roles and their associated permissions
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/dashboard/roles/new")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Role
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="w-[250px]">Role Name</TableHead>
                        <TableHead className="max-w-[400px]">Description</TableHead>
                        <TableHead className="w-[100px]">Users</TableHead>
                        <TableHead className="w-[150px]">Created At</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles?.map((role) => (
                        <TableRow key={role.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span>{role.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {role.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{role.users_count}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(role.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/dashboard/roles/${role.id}`)}
                              className="hover:bg-muted"
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
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Roles;