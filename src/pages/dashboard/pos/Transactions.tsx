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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { FileDown, Filter, Search, Check, ChevronsUpDown, X, RotateCcw, Building, Box, User, Receipt, FileText, Printer } from "lucide-react";
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
  
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  // Selected filters (pending application)
  const [selectedSiteFilters, setSelectedSiteFilters] = useState<string[]>([]);
  const [selectedCustomerFilters, setSelectedCustomerFilters] = useState<string[]>([]);
  const [selectedItemFilters, setSelectedItemFilters] = useState<string[]>([]);
  const [selectedTotalFilters, setSelectedTotalFilters] = useState<string[]>([]);
  const [selectedDateFilters, setSelectedDateFilters] = useState<string[]>([]);

  // Applied filters (used in actual filtering)
  const [appliedSiteFilters, setAppliedSiteFilters] = useState<string[]>([]);
  const [appliedCustomerFilters, setAppliedCustomerFilters] = useState<string[]>([]);
  const [appliedItemFilters, setAppliedItemFilters] = useState<string[]>([]);
  const [appliedTotalFilters, setAppliedTotalFilters] = useState<string[]>([]);
  const [appliedDateFilters, setAppliedDateFilters] = useState<string[]>([]);

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatTransactionId = (transaction) => {
    const date = new Date(transaction.transaction_date || transaction.created_at);
    const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp
    return `t${timestamp}`;
  };

  const handleResetFilters = () => {
    setSearchTransaction("");
    setSelectedSiteFilters([]);
    setSelectedCustomerFilters([]);
    setSelectedItemFilters([]);
    setSelectedTotalFilters([]);
    setSelectedDateFilters([]);
    setAppliedSiteFilters([]);
    setAppliedCustomerFilters([]);
    setAppliedItemFilters([]);
    setAppliedTotalFilters([]);
    setAppliedDateFilters([]);
    setSortField(null);
    setSortDirection(null);
  };

  const hasActiveFilters = 
    appliedSiteFilters.length > 0 ||
    appliedCustomerFilters.length > 0 ||
    appliedItemFilters.length > 0 ||
    appliedTotalFilters.length > 0 ||
    appliedDateFilters.length > 0;

  const getActiveFilterCount = () => {
    return (
      appliedSiteFilters.length +
      appliedCustomerFilters.length +
      appliedItemFilters.length +
      appliedTotalFilters.length +
      appliedDateFilters.length
    );
  };

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
        Id: formatTransactionId(transaction),
        Receipt: 'N/A',
        Product: item.nd_inventory?.name || 'Unknown item',
        Quantity: item.quantity,
        Total_Price: item.total_price.toFixed(2),
        Date_Time: new Date(transaction.transaction_date || transaction.created_at).toLocaleString(),
        Handled_By: transaction.creatorName,
      };

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

  const formatReceiptDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewReceipt = (transaction) => {
    setSelectedTransactionForReceipt(transaction);
    setIsReceiptDialogOpen(true);
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
    
    // Apply search filter
    if (searchTransaction) {
      const searchLower = searchTransaction.toLowerCase();
      
      filtered = filtered.filter(transaction => {
        const formattedId = formatTransactionId(transaction);
        const idMatch = formattedId.toLowerCase().includes(searchLower);
        const siteMatch = parsedMetadata?.user_type !== 'member' && 
          transaction.siteName?.toLowerCase().includes(searchLower);
        const handlerMatch = transaction.creatorName?.toLowerCase().includes(searchLower);
        const customerMatch = transaction.customerName?.toLowerCase().includes(searchLower);
        const itemMatch = transaction.items.some(item => 
          item.nd_inventory?.name?.toLowerCase().includes(searchLower)
        );
        const totalMatch = transaction.totalPrice.toFixed(2).includes(searchTransaction);
        const dateTimeString = new Date(transaction.transaction_date || transaction.created_at)
          .toLocaleString().toLowerCase();
        const dateTimeMatch = dateTimeString.includes(searchLower);
        
        return idMatch || siteMatch || handlerMatch || customerMatch || 
              itemMatch || totalMatch || dateTimeMatch;
      });
    }

    // Apply dropdown filters
    filtered = filtered.filter(transaction => {
      const siteMatch = appliedSiteFilters.length > 0 
        ? appliedSiteFilters.includes(transaction.siteName || "")
        : true;
      
      const customerMatch = appliedCustomerFilters.length > 0
        ? appliedCustomerFilters.includes(transaction.customerName || "")
        : true;
      
      const itemMatch = appliedItemFilters.length > 0
        ? transaction.items.some(item => 
            appliedItemFilters.includes(item.nd_inventory?.name || "")
          )
        : true;
      
      const totalMatch = appliedTotalFilters.length > 0
        ? appliedTotalFilters.includes(transaction.totalPrice.toFixed(2))
        : true;
      
      const dateMatch = appliedDateFilters.length > 0
        ? appliedDateFilters.includes(
            new Date(transaction.transaction_date || transaction.created_at).toLocaleDateString()
          )
        : true;

      return siteMatch && customerMatch && itemMatch && totalMatch && dateMatch;
    });

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
          case "transactionId":
            valueA = formatTransactionId(a);
            valueB = formatTransactionId(b);
            break;
          case "dateTime":
            valueA = new Date(a.transaction_date || a.created_at);
            valueB = new Date(b.transaction_date || b.created_at);
            break;
          case "total":
            valueA = a.totalPrice || 0;
            valueB = b.totalPrice || 0;
            break;
          case "items":
            valueA = a.items.length || 0;
            valueB = b.items.length || 0;
            break;
          case "customer":
            valueA = a.customerName || "";
            valueB = b.customerName || "";
            break;
          case "handledBy":
            valueA = a.creatorName || "";
            valueB = b.creatorName || "";
            break;
          case "siteName":
            valueA = a.siteName || "";
            valueB = b.siteName || "";
            break;
          default:
            valueA = a[sortField] || "";
            valueB = b[sortField] || "";
        }

        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTransaction, appliedSiteFilters, appliedCustomerFilters, appliedItemFilters, appliedTotalFilters, appliedDateFilters, sortField, sortDirection, parsedMetadata?.user_type]);

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

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* TP Site Filter - Only for super admin and TP admin */}
          {(isSuperAdmin || isTPUser) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10"
                >
                  <Building className="h-4 w-4 text-gray-500" />
                  TP Site
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search sites..." />
                  <CommandList>
                    <CommandEmpty>No sites found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {transactions && Array.from(
                        new Set(transactions.map(t => t.siteName).filter(Boolean))
                      ).sort().map((siteName) => (
                        <CommandItem
                          key={siteName}
                          onSelect={() => {
                            setSelectedSiteFilters(
                              selectedSiteFilters.includes(siteName)
                                ? selectedSiteFilters.filter(item => item !== siteName)
                                : [...selectedSiteFilters, siteName]
                            );
                          }}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            selectedSiteFilters.includes(siteName)
                              ? "bg-primary border-primary"
                              : "opacity-50"
                          )}>
                            {selectedSiteFilters.includes(siteName) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {siteName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Customer Filter - Not for member users */}
          {parsedMetadata?.user_type !== 'member' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  Customer
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandList>
                    <CommandEmpty>No customers found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {transactions && Array.from(
                        new Set(transactions.map(t => t.customerName).filter(Boolean))
                      ).sort().map((customerName) => (
                        <CommandItem
                          key={customerName}
                          onSelect={() => {
                            setSelectedCustomerFilters(
                              selectedCustomerFilters.includes(customerName)
                                ? selectedCustomerFilters.filter(item => item !== customerName)
                                : [...selectedCustomerFilters, customerName]
                            );
                          }}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            selectedCustomerFilters.includes(customerName)
                              ? "bg-primary border-primary"
                              : "opacity-50"
                          )}>
                            {selectedCustomerFilters.includes(customerName) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {customerName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Item Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Box className="h-4 w-4 text-gray-500" />
                Item
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search items..." />
                <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {transactions && Array.from(
                      new Set(
                        transactions.flatMap(t => 
                          t.items.map(item => item.nd_inventory?.name).filter(Boolean)
                        )
                      )
                    ).sort().map((itemName) => (
                      <CommandItem
                        key={itemName}
                        onSelect={() => {
                          setSelectedItemFilters(
                            selectedItemFilters.includes(itemName)
                              ? selectedItemFilters.filter(item => item !== itemName)
                              : [...selectedItemFilters, itemName]
                          );
                        }}
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                          selectedItemFilters.includes(itemName)
                            ? "bg-primary border-primary"
                            : "opacity-50"
                        )}>
                          {selectedItemFilters.includes(itemName) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {itemName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-10"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-4 w-4 text-gray-500" />
            Reset
          </Button>
        </div>

        <Button
          variant="secondary"
          className="flex items-center gap-2 ml-auto"
          onClick={() => {
            setAppliedSiteFilters(selectedSiteFilters);
            setAppliedCustomerFilters(selectedCustomerFilters);
            setAppliedItemFilters(selectedItemFilters);
            setAppliedTotalFilters(selectedTotalFilters);
            setAppliedDateFilters(selectedDateFilters);
          }}
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {appliedSiteFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Site: {appliedSiteFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedSiteFilters([]);
                  setSelectedSiteFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedCustomerFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Customer: {appliedCustomerFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedCustomerFilters([]);
                  setSelectedCustomerFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedItemFilters.length > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 h-6">
              <span>Item: {appliedItemFilters.length}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setAppliedItemFilters([]);
                  setSelectedItemFilters([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

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
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("transactionId")}
                  >
                    <div className="flex items-center">
                      Transaction ID
                      {sortField === "transactionId" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("dateTime")}
                  >
                    <div className="flex items-center">
                      Date & Time
                      {sortField === "dateTime" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center">
                      Total
                      {sortField === "total" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("items")}
                  >
                    <div className="flex items-center">
                      Items
                      {sortField === "items" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  {parsedMetadata?.user_type !== 'member' && (
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === "customer" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                  )}
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("handledBy")}
                  >
                    <div className="flex items-center">
                      Handled By
                      {sortField === "handledBy" ? (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  {parsedMetadata?.user_type !== 'member' && (
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("siteName")}
                    >
                      <div className="flex items-center">
                        Nadi Site Name
                        {sortField === "siteName" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                  )}
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatTransactionId(transaction)}</TableCell>
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
                      {parsedMetadata?.user_type !== 'member' && (
                        <TableCell>{transaction.customerName}</TableCell>
                      )}
                      <TableCell>{transaction.creatorName}</TableCell>
                      {parsedMetadata?.user_type !== 'member' && (
                        <TableCell>{transaction.siteName}</TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewReceipt(transaction)}
                        >
                          <Receipt className="h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={parsedMetadata?.user_type === 'member' ? 6 : 8} className="text-center py-6">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5"/> Receipt
            </DialogTitle>
          </DialogHeader>
          {selectedTransactionForReceipt && (
            <div className="space-y-4 py-4">
              {/* Receipt Header */}
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">NADI 2.0 POS</h3>
                <p className="text-sm text-muted-foreground">Kuala Lumpur, Malaysia</p>
              </div>

              {/* Transaction Info */}
              <div className="border-b pb-2 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Receipt No:</p>
                  <p className="text-sm">{formatTransactionId(selectedTransactionForReceipt)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Date:</p>
                  <p className="text-sm">
                    {formatReceiptDate(selectedTransactionForReceipt.transaction_date || selectedTransactionForReceipt.created_at)}
                  </p>
                </div>

                {/* Customer Info - Only show if not member user and customer exists */}
                {parsedMetadata?.user_type !== 'member' && selectedTransactionForReceipt.customerName && selectedTransactionForReceipt.customerName !== 'Walk-in Customer' && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Customer:</p>
                    <p className="text-sm">{selectedTransactionForReceipt.customerName}</p>
                  </div>
                )}

                {/* Site Info - Only show if not member user */}
                {parsedMetadata?.user_type !== 'member' && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Site:</p>
                    <p className="text-sm">{selectedTransactionForReceipt.siteName}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Handled By:</p>
                  <p className="text-sm">{selectedTransactionForReceipt.creatorName}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Items:</p>
                {selectedTransactionForReceipt.items.map((item, index) => (
                  <div key={index} className="flex flex-col gap-3 pb-2">
                    <div className="grid grid-cols-8">
                      <div className="flex col-span-5 gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.nd_inventory?.name || 'Unknown item'}</p>
                          <p className="text-xs text-muted-foreground">
                            Unit Price: RM{item.price_per_unit?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-right">{item.quantity}x</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-right">RM {item.total_price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>RM {selectedTransactionForReceipt.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (0%):</span>
                  <span>RM 0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total:</span>
                  <span>RM {selectedTransactionForReceipt.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedTransactionForReceipt.type || 'Cash'}</span>
                </div>
              </div>

              {/* Remarks */}
              {selectedTransactionForReceipt.remarks && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium">Remarks:</p>
                  <p className="text-sm text-muted-foreground">{selectedTransactionForReceipt.remarks}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm border-t pt-4">
                <p>Thank you for your purchase!</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="secondary"
              className="border print:hidden"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5"/>
              Print
            </Button>
            <Button 
              variant="default" 
              onClick={() => setIsReceiptDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Transactions;