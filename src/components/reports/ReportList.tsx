import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  last_generated: string;
  schedule: string;
}

export const ReportList = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reports?.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <CardTitle className="text-lg">{report.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Type: {report.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Last Generated:{" "}
                  {report.last_generated
                    ? new Date(report.last_generated).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
              {report.schedule && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    Schedule: {report.schedule}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};