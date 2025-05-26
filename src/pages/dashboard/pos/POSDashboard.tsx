import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const POSDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sitePerformanceData, setSitePerformanceData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    salesGrowth: 0,
    totalTransactions: 0,
    transactionsGrowth: 0,
    totalProducts: 0,
    productsGrowth: 0,
  });

  // Get user metadata
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userType = parsedMetadata?.user_type || "";
  const isTPSiteUser = userType === "tp_site";

  // Fetch dashboard statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // You would replace this with actual API calls to get your dashboard stats
      // For now, using dummy data that matches the screenshot
      return {
        totalSales: 484.91,
        salesGrowth: 20.1,
        totalTransactions: 2,
        transactionsGrowth: 4,
        totalProducts: 7,
        productsGrowth: 1,
      };
    },
  });

  // Fetch site performance data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["site-performance"],
    queryFn: async () => {
      // Mock data for site performance - replace with actual API call
      return [
        {
          site: "Nadi Site 1",
          transactionCount: 2,
          totalSales: 234.95,
          productCount: 2,
        },
        {
          site: "Nadi Site 2",
          transactionCount: 2,
          totalSales: 189.97,
          productCount: 2,
        },
        {
          site: "Nadi Site 3",
          transactionCount: 1,
          totalSales: 59.99,
          productCount: 1,
        },
      ];
    },
    enabled: !isTPSiteUser, // Only fetch if user is not a TP site user
  });

  // Fetch top selling products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      // Mock data for top selling products - replace with actual API call
      return [
        { product: "Wireless Earbuds", sales: "42 units" },
        { product: "Smart Watch", sales: "35 units" },
        { product: "USB-C Charger", sales: "28 units" },
      ];
    },
  });

  useEffect(() => {
    if (statsData) {
      setDashboardStats(statsData);
    }
    if (performanceData) {
      setSitePerformanceData(performanceData);
    }
    if (productsData) {
      setTopSellingProducts(productsData);
    }
  }, [statsData, performanceData, productsData]);

  const handleSiteSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSiteData = searchTerm
    ? sitePerformanceData.filter((site) =>
        site.site.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sitePerformanceData;

  return (
    <div>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">POS Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              {/* <TrendingUp className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardStats.totalSales}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.salesGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions Today
              </CardTitle>
              {/* <ShoppingCart className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.transactionsGrowth}% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Product Count
              </CardTitle>
              {/* <Package className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.productsGrowth} new this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* TP Site Performance Card */}
        {!isTPSiteUser && (
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">TP Site Performance</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by site name..."
                  value={searchTerm}
                  onChange={handleSiteSearch}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 font-medium border-b text-sm text-muted-foreground">
                <div>Site Name</div>
                <div>Transaction Count</div>
                <div>Total Sales</div>
                <div>Product Count</div>
              </div>

              {filteredSiteData.map((site, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 p-4 border-b last:border-0 text-sm"
                >
                  <div className="font-semibold text-md">{site.site}</div>
                  <div>{site.transactionCount}</div>
                  <div>${site.totalSales.toFixed(2)}</div>
                  <div>{site.productCount}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top Selling Products Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>

          <div className="rounded-md">
            <div className="grid grid-cols-2 p-4 text-sm font-medium text-muted-foreground border-b">
              <div>Product</div>
              <div className="text-right">Sales</div>
            </div>

            {topSellingProducts.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-2 p-4 border-b last:border-0"
              >
                <div className="font-medium">{product.product}</div>
                <div className="text-right">{product.sales}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default POSDashboard;
