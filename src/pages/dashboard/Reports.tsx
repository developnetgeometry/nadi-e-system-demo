import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface SalesData {
  id: string;
  date: string;
  amount: number;
  transaction_id: string;
}

const fetchSalesData = async () => {
  console.log("Fetching sales data...");
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }

  console.log("Sales data fetched:", data);
  return data;
};

export const Reports = () => {
  const { data: salesData, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSalesData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formattedData = salesData?.map((sale: SalesData) => ({
    date: format(new Date(sale.date), "MMM dd"),
    amount: sale.amount,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily sales performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;