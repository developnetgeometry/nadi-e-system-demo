import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, MapPin, Users, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ProgrammeForm } from "./ProgrammeForm";

interface Programme {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "completed" | "cancelled";
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
}

export const ProgrammeList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<
    Programme | undefined
  >();

  const {
    data: programmes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      console.log("Fetching programmes...");
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching programmes:", error);
        throw error;
      }

      console.log("Fetched programmes:", data);
      return data as Programme[];
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load programmes. Please try again later.",
      variant: "destructive",
    });
  }

  const handleAddEdit = (programme?: Programme) => {
    setSelectedProgramme(programme);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProgramme(undefined);
    queryClient.invalidateQueries({ queryKey: ["programmes"] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programmes</h2>
        <Button onClick={() => handleAddEdit()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Programme
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programmes?.map((programme) => (
            <Card
              key={programme.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{programme.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(programme.status)}>
                      {programme.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddEdit(programme)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{programme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(programme.start_date).toLocaleDateString()} -{" "}
                      {new Date(programme.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{programme.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {programme.capacity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProgramme ? "Edit Programme" : "Add Programme"}
            </DialogTitle>
          </DialogHeader>
          <ProgrammeForm
            programme={selectedProgramme}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
