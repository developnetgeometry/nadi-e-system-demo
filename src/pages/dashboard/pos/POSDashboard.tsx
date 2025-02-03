import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Receipt, ShoppingCart } from "lucide-react";

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

export default function POSDashboard() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
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

  const generateReceipt = () => {
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

    // Save transaction to Supabase
    supabase
      .from("transactions")
      .insert([receipt])
      .then(() => {
        toast({
          title: "Transaction complete",
          description: `Total amount: $${total.toFixed(2)}`,
        });
        setCart([]);
      })
      .catch((error) => {
        console.error("Error saving transaction:", error);
        toast({
          title: "Error",
          description: "Failed to complete transaction",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Catalog */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {isLoading ? (
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
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
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
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
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
                  $
                  {cart
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