import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  last_generated: string;
  schedule: string;
  parameters: Record<string, any> | null;
}

export const ReportList = () => {
  const { toast } = useToast();
  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      console.log("Fetching reports...");
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }
      console.log("Fetched reports:", data);
      return data as Report[];
    },
  });

  const handleGenerateReport = async (reportId: string) => {
    try {
      console.log("Generating report:", reportId);
      // Update last_generated timestamp
      const { error } = await supabase
        .from("reports")
        .update({ last_generated: new Date().toISOString() })
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">System Reports</h2>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports?.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {report.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
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
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};