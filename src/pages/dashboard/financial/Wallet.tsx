import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Wallet } from "lucide-react";

const FinancialWallet = () => {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching wallet:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="space-y-1">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital wallet
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {wallet?.balance?.toLocaleString("en-US", {
                style: "currency",
                currency: wallet?.currency || "USD",
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialWallet;
