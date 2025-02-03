import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";

interface Programme {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
}

export const ProgrammeList = () => {
  const { data: programmes, isLoading } = useQuery({
    queryKey: ["programmes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Programme[];
    },
  });

  if (isLoading) {
    return <div>Loading programmes...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programmes?.map((programme) => (
        <Card key={programme.id}>
          <CardHeader>
            <CardTitle className="text-lg">{programme.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {programme.description}
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(programme.start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{programme.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Capacity: {programme.capacity}</span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {programme.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};