import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FinancialTransactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
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
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View your transaction history
          </p>
        </div>
        <div className="space-y-4">
          {transactions?.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {transaction.description || transaction.type}
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
                    <span className="font-medium">Status:</span>{" "}
                    {transaction.status}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialTransactions;
