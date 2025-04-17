import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CommunityModeration = () => {
  const { data: flags, isLoading } = useQuery({
    queryKey: ["content-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_flags")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching flags:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Community Moderation</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage flagged content
          </p>
        </div>
        <div className="space-y-4">
          {flags?.map((flag) => (
            <Card key={flag.id}>
              <CardHeader>
                <CardTitle>{flag.content_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><span className="font-medium">Reason:</span> {flag.reason}</p>
                <p><span className="font-medium">Status:</span> {flag.status}</p>
                <p><span className="font-medium">Reported:</span> {new Date(flag.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityModeration;