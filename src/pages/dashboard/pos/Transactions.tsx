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
import { useUserMetadata } from "@/hooks/use-user-metadata";

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

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    (isTPUser) &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  // Fetch transactions with items
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', memberProfileId, parsedMetadata?.group_profile?.site_profile_id, isSuperAdmin, parsedMetadata?.user_type],
    queryFn: async () => {
      let transactionQuery = supabase
        .from('nd_pos_transaction')
        .select('*')
        .order('created_at', { ascending: false });

      // For member users - show only their transactions
      if (parsedMetadata?.user_type === 'member' && memberProfileId) {
        transactionQuery = transactionQuery.eq('member_id', memberProfileId);
      }
      // For TP site users - show transactions from their site only
      else if (parsedMetadata?.user_type === 'tp_site') {
        const siteProfileId = parsedMetadata?.group_profile?.site_profile_id;
        
        if (!siteProfileId) {
          console.warn("No site_profile_id found for TP site user");
          return [];
        }

        // Get the site_id from nd_site table using site_profile_id
        const { data: siteData, error: siteError } = await supabase
          .from('nd_site')
          .select('id')
          .eq('site_profile_id', siteProfileId)
          .single();

        if (siteError || !siteData) {
          console.error("Error fetching site:", siteError);
          return [];
        }

        const siteId = siteData.id;

        // Get all inventory IDs for this site
        const { data: siteInventory } = await supabase
          .from('nd_inventory')
          .select('id')
          .eq('site_id', siteId)
          .is('deleted_at', null);
          
        const inventoryIds = siteInventory?.map(inv => inv.id) || [];
        
        if (inventoryIds.length === 0) {
          return [];
        }

        // Get transaction IDs that contain items from this site
        const { data: siteTransactionItems } = await supabase
          .from('nd_pos_transaction_item')
          .select('transaction_id')
          .in('item_id', inventoryIds);
        
        const relevantTransactionIds = [...new Set(siteTransactionItems?.map(item => item.transaction_id))];
        
        if (relevantTransactionIds.length === 0) {
          return [];
        }

        transactionQuery = transactionQuery.in('id', relevantTransactionIds);
      }
      // For super admin and other roles - show all transactions (no filter needed)

      const { data: transactionData, error: transactionError } = await transactionQuery;
      
      if (transactionError) 
        throw transactionError;

      if (!transactionData || transactionData.length === 0) 
        return [];

      // For each transaction, get its items and creator info
      const transactionsWithItems = await Promise.all(
        transactionData.map(async (transaction) => {
          let creatorName = 'Unknown';
          let siteName = 'Unknown Site';
          let customerName = 'Walk-in Customer';
          
          // Get creator name
          if(transaction.created_by) {
            const { data: creatorData, error: creatorError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', transaction.created_by)
              .single();

            if (!creatorError && creatorData) {
              creatorName = creatorData.full_name;
            }
          }

          // Get customer name if member_id exists
          if(transaction.member_id) {
            const { data: memberData, error: memberError } = await supabase
              .from('nd_member_profile')
              .select('fullname')
              .eq('id', transaction.member_id)
              .single();

            if (!memberError && memberData && memberData.fullname) {
              customerName = memberData.fullname;
            }
          }

          // Get transaction items
          const { data: items, error: itemsError } = await supabase
            .from('nd_pos_transaction_item')
            .select('id, quantity, price_per_unit, total_price, item_id')
            .eq('transaction_id', transaction.id);
          
          if (itemsError) 
            console.error('Error fetching items:', itemsError);

          if (!items || items.length === 0) 
            return { ...transaction, items: [], totalPrice: 0, creatorName, siteName, customerName };

          // Fetch inventory details for each item and determine site
          const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
              const { data: inventoryData, error: inventoryError } = await supabase
                .from('nd_inventory')
                .select(`
                  name,
                  site_id,
                  nd_site!site_id(
                    nd_site_profile!site_profile_id(
                      sitename
                    )
                  )
                `)
                .eq('id', item.item_id)
                .single();
                
              if (inventoryError) console.error('Error fetching inventory:', inventoryError);
              
              return {
                ...item,
                nd_inventory: inventoryData || { name: 'Unknown item' },
                siteName: inventoryData?.nd_site?.nd_site_profile?.sitename || 'Unknown Site'
              };
            })
          );
          
          // Get site name from first item (assuming all items in a transaction are from same site)
          if (itemsWithDetails.length > 0) {
            siteName = itemsWithDetails[0].siteName;
          }
          
          // Calculate total price
          const totalPrice = itemsWithDetails.reduce((sum, item) => sum + (item.total_price || 0), 0);

          return {
            ...transaction,
            items: itemsWithDetails || [],
            totalPrice: totalPrice,
            creatorName,
            siteName,
            customerName
          };
        })
      );
      
      return transactionsWithItems;
    },
    enabled: true, // Always enabled now since we handle different user types
  });

  const bodyTableData = filteredTransactions ? filteredTransactions.flatMap((transaction) => {
    return transaction.items.map((item) => {
      const baseData = {
        Id: transaction.id,
        Receipt: 'N/A',
        Product: item.nd_inventory?.name || 'Unknown item',
        Quantity: item.quantity,
        Total_Price: item.total_price.toFixed(2),
        Date_Time: new Date(transaction.transaction_date || transaction.created_at).toLocaleString(),
        Handled_By: transaction.creatorName,
      };

      // Add customer and site info only for non-member users
      if (parsedMetadata?.user_type !== 'member') {
        return {
          ...baseData,
          Customer: transaction.customerName,
          Nadi_Site_Name: transaction.siteName,
        };
      }

      return baseData;
    })
  }) : [];

  const handleTransactionChange = (value: string) => {
    setSearchTransaction(value || "");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // Only get member profile ID if user is a member
        if (parsedMetadata?.user_type === 'member') {
          const { data, error } = await supabase
            .from('nd_member_profile')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            setMemberProfileId(data.id);
          }
        }
      }
    };

    fetchUserData();
  }, [parsedMetadata?.user_type]);

  // Separate useEffect for filtering
  useEffect(() => {
    if (!transactions) return;

    let filtered = [...transactions];
    
    // Apply enhanced search filter
    if (searchTransaction) {
      const searchLower = searchTransaction.toLowerCase();
      
      filtered = filtered.filter(transaction => {
        // Search by transaction ID
        const idMatch = transaction.id.toString().toLowerCase().includes(searchLower);
        
        // Search by TP site name (only for non-member users)
        const siteMatch = parsedMetadata?.user_type !== 'member' && 
          transaction.siteName?.toLowerCase().includes(searchLower);
        
        // Search by handler name
        const handlerMatch = transaction.creatorName?.toLowerCase().includes(searchLower);
        
        // Search by customer name
        const customerMatch = transaction.customerName?.toLowerCase().includes(searchLower);
        
        // Search by inventory product names
        const itemMatch = transaction.items.some(item => 
          item.nd_inventory?.name?.toLowerCase().includes(searchLower)
        );
        
        // Search by total price (convert to string for partial matches)
        const totalMatch = transaction.totalPrice.toFixed(2).includes(searchTransaction);
        
        // Search by date and time
        const dateTimeString = new Date(transaction.transaction_date || transaction.created_at)
          .toLocaleString().toLowerCase();
        const dateTimeMatch = dateTimeString.includes(searchLower);
        
        return idMatch || siteMatch || handlerMatch || customerMatch || 
              itemMatch || totalMatch || dateTimeMatch;
      });
    }
    
    // Apply date filter (keep existing logic)
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date || transaction.created_at);
        
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
  }, [transactions, searchTransaction, dateFilter, parsedMetadata?.user_type]);

  return (
    <>
    
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
            <Button variant="secondary" className="inline-flex hover:bg-[#5147dd] hover:text-white border">
              <Filter className="h-5 w-5 mr-2" /> Filters {dateFilter && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">1</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2">
              <h3 className="font-medium">Date Range</h3>
            </div>
            <DropdownMenuRadioGroup value={dateFilter} onValueChange={setDateFilter}>
              <DropdownMenuRadioItem value="Today">
                Today
                {dateFilter === "Today" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="This Week">
                This Week
                {dateFilter === "This Week" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="This Month">
                This Month
                {dateFilter === "This Month" && <Check className="h-4 w-4 ml-auto" />}
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
                  {/* Only show Customer column if not a member user */}
                  {parsedMetadata?.user_type !== 'member' && (
                    <TableHead>Customer</TableHead>
                  )}
                  <TableHead>Handled By</TableHead>
                  {/* Only show Nadi Site Name column if not a member user */}
                  {parsedMetadata?.user_type !== 'member' && (
                    <TableHead>Nadi Site Name</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>
                        {new Date(transaction.transaction_date || transaction.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>RM {transaction.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {transaction.items.length} item(s)
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.items.map(item => (
                            <div key={item.id}>
                              {item.quantity}x {item.nd_inventory?.name || 'Unknown item'}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      {/* Only show Customer column if not a member user */}
                      {parsedMetadata?.user_type !== 'member' && (
                        <TableCell>{transaction.customerName}</TableCell>
                      )}
                      <TableCell>{transaction.creatorName}</TableCell>
                      {/* Only show Nadi Site Name column if not a member user */}
                      {parsedMetadata?.user_type !== 'member' && (
                        <TableCell>{transaction.siteName}</TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={parsedMetadata?.user_type === 'member' ? 5 : 7} className="text-center py-6">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Transactions;