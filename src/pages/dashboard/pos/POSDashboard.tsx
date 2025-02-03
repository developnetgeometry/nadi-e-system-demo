import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Receipt, ShoppingCart, TrendingUp, Package, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Transaction {
  date: string;
  total: number;
}

export default function POSDashboard() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchQuery}%`);

      if (error) throw error;
      return data as Product[];
    },
  });

  // Fetch transactions for analytics
  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  // Calculate analytics data
  const totalSales = transactions?.reduce((sum, t) => sum + t.total, 0) || 0;
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter((p) => p.stock < 10).length || 0;

  // Prepare chart data
  const last7DaysData = transactions
    ?.slice(0, 7)
    .map((t) => ({
      date: new Date(t.date).toLocaleDateString(),
      amount: t.total,
    }))
    .reverse();

  // Keep existing cart functionality
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to the cart`,
    });
  };

  const generateReceipt = async () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const receipt = {
      items: cart,
      total,
      date: new Date().toISOString(),
      transactionId: Math.random().toString(36).substr(2, 9),
    };

    try {
      await supabase.from("transactions").insert([receipt]);
      toast({
        title: "Transaction complete",
        description: `Total amount: $${total.toFixed(2)}`,
      });
      setCart([]);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast({
        title: "Error",
        description: "Failed to complete transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-4 mb-8">
        <h3 className="text-lg font-semibold mb-4">Sales Last 7 Days</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Original POS Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Catalog */}
        <div className="md:col-span-2">
          <div className="mb-4 relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productsLoading ? (
              <p>Loading products...</p>
            ) : (
              products?.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Cart & Receipt */}
        <div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Cart</h2>
              <ShoppingCart className="h-6 w-6" />
            </div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between mb-4">
                <p className="font-bold">Total:</p>
                <p className="font-bold">
                  ${cart
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={generateReceipt}
                disabled={cart.length === 0}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Generate Receipt
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
