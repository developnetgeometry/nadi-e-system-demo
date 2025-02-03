import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const Transactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["service-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Service Transactions</h1>
      <div className="space-y-4">
        {transactions?.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {transaction.description || "Transaction"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                    RM {transaction.amount}
                  </span>
                </p>
                <p><span className="font-medium">Type:</span> {transaction.type}</p>
                <p><span className="font-medium">Category:</span> {transaction.category}</p>
                <p><span className="font-medium">Date:</span> {new Date(transaction.date).toLocaleDateString()}</p>
                {transaction.reference_number && (
                  <p><span className="font-medium">Reference:</span> {transaction.reference_number}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Transactions;