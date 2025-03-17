
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Workflow } from "@/types/workflow";
import { Copy, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { EmptyState } from "../ui/empty-state";

interface WorkflowListProps {
  workflows: Workflow[] | undefined;
  isLoading: boolean;
  onSelect: (workflow: Workflow) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const WorkflowList = ({
  workflows,
  isLoading,
  onSelect,
  onDelete,
  onDuplicate,
}: WorkflowListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkflows = workflows?.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="backdrop-blur-sm bg-white/5 border border-gray-100/20 animate-pulse">
            <CardHeader className="h-[100px]"></CardHeader>
            <CardContent className="h-[80px]"></CardContent>
            <CardFooter className="h-[40px]"></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!workflows?.length) {
    return (
      <EmptyState
        title="No workflows found"
        description="Get started by creating your first workflow"
        icon={<Pencil className="h-12 w-12 text-gray-300" />}
        action={
          <Button onClick={() => {}}>Create Workflow</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows?.map((workflow) => (
          <Card 
            key={workflow.id}
            className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1 text-lg">{workflow.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => onSelect(workflow)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(workflow.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onClick={() => onDelete(workflow.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="line-clamp-2">
                {workflow.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex justify-between items-center">
                <div>{getStatusBadge(workflow.status)}</div>
                <div className="text-sm text-muted-foreground">
                  {workflow.steps.length} steps
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <div className="flex -space-x-2">
                  {workflow.assignedUsers?.map((user, i) => (
                    <Avatar key={i} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelect(workflow)}
                >
                  Open
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
