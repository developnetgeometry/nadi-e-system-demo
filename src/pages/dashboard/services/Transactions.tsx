import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ServiceTransactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["service-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .eq("category", "service")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching service transactions:", error);
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
          <h1 className="text-xl font-bold">Service Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View your service-related transactions
          </p>
        </div>
        <div className="space-y-4">
          {transactions?.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {transaction.description || "Service Transaction"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {transaction.amount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {transaction.type}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {transaction.category}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                  {transaction.reference_number && (
                    <p>
                      <span className="font-medium">Reference:</span>{" "}
                      {transaction.reference_number}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTransactions;
