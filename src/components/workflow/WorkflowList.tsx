import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, List } from "lucide-react";
import { useState } from "react";
import { WorkflowFormDialog } from "./WorkflowFormDialog";
import { WorkflowTasksDialog } from "./WorkflowTasksDialog";

export const WorkflowList = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      console.log("Fetching workflows...");
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workflows:", error);
        throw error;
      }

      console.log("Workflows fetched:", data);
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading workflows...
              </TableCell>
            </TableRow>
          ) : workflows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No workflows found
              </TableCell>
            </TableRow>
          ) : (
            workflows?.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>{workflow.name}</TableCell>
                <TableCell>{workflow.description}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(workflow.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        setIsTasksDialogOpen(true);
                      }}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <WorkflowFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        workflow={selectedWorkflow}
      />

      <WorkflowTasksDialog
        open={isTasksDialogOpen}
        onOpenChange={setIsTasksDialogOpen}
        workflow={selectedWorkflow}
      />
    </div>
  );
};