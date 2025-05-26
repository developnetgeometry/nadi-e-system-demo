import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FileDown, Filter, Search, Check } from "lucide-react";

import { exportToCSV } from "@/utils/export-utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Transactions = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [memberProfileId, setMemberProfileId] = useState(null);
  const [searchTransaction, setSearchTransaction] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch transactions with items
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["memberTransactions", memberProfileId],
    queryFn: async () => {
      if (!memberProfileId) return [];

      // Fetch all transactions for this member
      const { data: transactionData, error: transactionError } = await supabase
        .from("nd_pos_transaction")
        .select("*")
        .eq("member_id", memberProfileId)
        .order("created_at", { ascending: false });

      if (transactionError) throw transactionError;

      if (!transactionData || transactionData.length === 0) return [];

      // For each transaction, get its items
      const transactionsWithItems = await Promise.all(
        transactionData.map(async (transaction) => {
          let creatorName = "Unknown";
          if (transaction.created_by) {
            const { data: creatorData, error: creatorError } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", transaction.created_by)
              .single();

            if (!creatorError && creatorData) {
              creatorName = creatorData.full_name;
            }
          }

          const { data: items, error: itemsError } = await supabase
            .from("nd_pos_transaction_item")
            .select("id, quantity, price_per_unit, total_price, item_id")
            .eq("transaction_id", transaction.id);

          if (itemsError) console.error("Error fetching items:", itemsError);

          if (!items || items.length === 0)
            return {
              ...transaction,
              items: [],
              totalPrice: 0,
              creatorName: creatorName,
            };

          // Fetch inventory details for each item
          const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
              const { data: inventoryData, error: inventoryError } =
                await supabase
                  .from("nd_inventory")
                  .select("name")
                  .eq("id", item.item_id)
                  .single();

              if (inventoryError)
                console.error("Error fetching inventory:", inventoryError);

              return {
                ...item,
                nd_inventory: inventoryData || { name: "Unknown item" },
              };
            })
          );

          // Calculate total price
          const totalPrice = itemsWithDetails.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
          );

          return {
            ...transaction,
            items: itemsWithDetails || [],
            totalPrice: totalPrice,
            creatorName: creatorName,
          };
        })
      );

      return transactionsWithItems;
    },
    enabled: !!memberProfileId, // Only run this query when we have the member profile ID
  });

  const bodyTableData = filteredTransactions
    ? filteredTransactions.flatMap((transaction) => {
        return transaction.items.map((item) => {
          return {
            Id: transaction.id,
            Receipt: "N/A",
            Product: item.nd_inventory?.name || "Unknown item",
            Quantity: item.quantity,
            Total_Price: item.total_price.toFixed(2),
            Date_Time: new Date(
              transaction.transaction_date || transaction.created_at
            ).toLocaleString(),
            Handled_By: transaction.creatorName,
          };
        });
      })
    : [];

  const handleTransactionChange = (value: string) => {
    setSearchTransaction(value || "");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        // Get the member profile ID associated with this user
        const { data, error } = await supabase
          .from("nd_member_profile")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          setMemberProfileId(data.id);
        }
      }
    };

    fetchUserData();

    if (!transactions) return;

    let filtered = [...transactions];

    // Apply search filter for transaction ID and item inventory name
    if (searchTransaction) {
      filtered = filtered.filter((transaction) => {
        // Check if transaction ID includes search query
        const idMatch = transaction.id
          .toString()
          .toLowerCase()
          .includes(searchTransaction.toLowerCase());

        // Check if any item name includes search query
        const itemMatch = transaction.items.some((item) =>
          item.nd_inventory?.name
            ?.toLowerCase()
            .includes(searchTransaction.toLowerCase())
        );

        return idMatch || itemMatch;
      });
    }

    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(
          transaction.transaction_date || transaction.created_at
        );

        if (dateFilter === "Today") {
          return transactionDate >= today;
        } else if (dateFilter === "This Week") {
          return transactionDate >= startOfWeek;
        } else if (dateFilter === "This Month") {
          return transactionDate >= startOfMonth;
        }

        return true;
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTransaction, dateFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage sales transactions</p>
        </div>
        <div>
          <Button onClick={() => exportToCSV(bodyTableData, "transactions")}>
            <FileDown className="h-5 w-5" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, receipt, etc..."
            value={searchTransaction}
            onChange={(e) => handleTransactionChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="inline-flex hover:bg-[#5147dd] hover:text-white border"
            >
              <Filter className="h-5 w-5 mr-2" /> Filters{" "}
              {dateFilter && (
                <span className="ml-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2">
              <h3 className="font-medium">Date Range</h3>
            </div>
            <DropdownMenuRadioGroup
              value={dateFilter}
              onValueChange={setDateFilter}
            >
              <DropdownMenuRadioItem value="Today">
                Today
                {dateFilter === "Today" && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="This Week">
                This Week
                {dateFilter === "This Week" && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="This Month">
                This Month
                {dateFilter === "This Month" && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  setDateFilter("");
                  setIsFilterOpen(false);
                }}
              >
                Reset all filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>
                        {new Date(
                          transaction.transaction_date || transaction.created_at
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        RM {transaction.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {transaction.items.length} item(s)
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.items.map((item) => (
                            <div key={item.id}>
                              {item.quantity}x{" "}
                              {item.nd_inventory?.name || "Unknown item"}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
