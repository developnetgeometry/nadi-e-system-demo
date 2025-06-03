import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ChevronsUpDown
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const POSDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sitePerformanceData, setSitePerformanceData] = useState([]);
  const [siteCurrentPage, setSiteCurrentPage] = useState(1);
  const sitesPageSize = 10;
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [performanceFilter, setPerformanceFilter] = useState<string>("top10");
  const [sortField, setSortField] = useState<string>('totalSales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    salesGrowth: 0,
    totalTransactions: 0,
    transactionsGrowth: 0,
    totalProducts: 0,
    productsGrowth: 0
  });

  // Get user metadata
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userType = parsedMetadata?.user_type || "";
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isTPSiteUser = userType === "tp_site";
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    (isTPUser) &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;

  // Fetch dashboard statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', parsedMetadata?.group_profile?.site_profile_id, isSuperAdmin],
    queryFn: async () => {
      try {
        let siteId = null;
        let inventoryIds = [];
        let totalSales = 0;
        
        // Get site_id if not super admin
        if (!isSuperAdmin) {
          const siteProfileId = parsedMetadata?.group_profile?.site_profile_id || null;
          
          if (!siteProfileId) {
            console.warn("No site_profile_id found in user metadata");
            return {
              totalSales: 0,
              salesGrowth: 0,
              totalTransactions: 0,
              transactionsGrowth: 0,
              totalProducts: 0,
              productsGrowth: 0
            };
          }

          // Get the site_id from nd_site table using site_profile_id
          const { data: siteData, error: siteError } = await supabase
            .from('nd_site')
            .select('id')
            .eq('site_profile_id', siteProfileId)
            .single();

          if (siteError || !siteData) {
            console.error("Error fetching site:", siteError);
            return {
              totalSales: 0,
              salesGrowth: 0,
              totalTransactions: 0,
              transactionsGrowth: 0,
              totalProducts: 0,
              productsGrowth: 0
            };
          }

          siteId = siteData.id;
        }

        // Calculate total sales (both inventory items and services)
        if (siteId) {
          // Get inventory IDs for this site
          const { data: siteInventory } = await supabase
            .from('nd_inventory')
            .select('id')
            .eq('site_id', siteId);
            
          inventoryIds = siteInventory?.map(inv => inv.id) || [];
          
          // Get users from this site for service transactions
          const { data: siteUsers } = await supabase
            .from('nd_site_user')
            .select('user_id')
            .eq('site_profile_id', parsedMetadata?.group_profile?.site_profile_id);
          
          const siteUserIds = siteUsers?.map(user => user.user_id) || [];
          
          let totalSalesFromItems = 0;
          let totalSalesFromServices = 0;
          
          // Get sales from inventory items
          if (inventoryIds.length > 0) {
            const { data: itemSalesData } = await supabase
              .from('nd_pos_transaction_item')
              .select('total_price')
              .in('item_id', inventoryIds);
              
            totalSalesFromItems = itemSalesData?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;
          }
          
          // Get sales from services (transactions created by site users)
          if (siteUserIds.length > 0) {
            const { data: serviceTransactions } = await supabase
              .from('nd_pos_transaction')
              .select('id')
              .in('created_by', siteUserIds);
            
            const serviceTransactionIds = serviceTransactions?.map(t => t.id) || [];
            
            if (serviceTransactionIds.length > 0) {
              const { data: serviceSalesData } = await supabase
                .from('nd_pos_transaction_item')
                .select('total_price')
                .in('transaction_id', serviceTransactionIds)
                .not('service_id', 'is', null);
                
              totalSalesFromServices = serviceSalesData?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;
            }
          }
          
          totalSales = totalSalesFromItems + totalSalesFromServices;
        } else {
          // Super admin - get all sales (items + services)
          const { data: salesData } = await supabase
            .from('nd_pos_transaction_item')
            .select('total_price');
            
          totalSales = salesData?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;
        }

        // Get today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (siteId) {
          // Get users from this site for service transactions
          const { data: siteUsers } = await supabase
            .from('nd_site_user')
            .select('user_id')
            .eq('site_profile_id', parsedMetadata?.group_profile?.site_profile_id);
          
          const siteUserIds = siteUsers?.map(user => user.user_id) || [];
          
          let relevantTransactionIds = [];

          // Get transactions with items from this site
          if (inventoryIds.length > 0) {
            const { data: siteTransactionItems } = await supabase
              .from('nd_pos_transaction_item')
              .select('transaction_id')
              .in('item_id', inventoryIds);
            
            relevantTransactionIds = [...relevantTransactionIds, ...siteTransactionItems?.map(item => item.transaction_id) || []];
          }

          // Get transactions created by users from this site (for services)
          if (siteUserIds.length > 0) {
            const { data: siteUserTransactions } = await supabase
              .from('nd_pos_transaction')
              .select('id')
              .in('created_by', siteUserIds);
            
            relevantTransactionIds = [...relevantTransactionIds, ...siteUserTransactions?.map(t => t.id) || []];
          }

          // Remove duplicates
          relevantTransactionIds = [...new Set(relevantTransactionIds)];
          
          if (relevantTransactionIds.length > 0) {
            // Get today's transactions
            const { data: todayTransactions } = await supabase
              .from('nd_pos_transaction')
              .select('id')
              .in('id', relevantTransactionIds)
              .gte('transaction_date', today.toISOString())
              .lt('transaction_date', tomorrow.toISOString());
            
            // Get yesterday's transactions
            const { data: yesterdayTransactions } = await supabase
              .from('nd_pos_transaction')
              .select('id')
              .in('id', relevantTransactionIds)
              .gte('transaction_date', yesterday.toISOString())
              .lt('transaction_date', today.toISOString());
            
            var todayCount = todayTransactions?.length || 0;
            var yesterdayCount = yesterdayTransactions?.length || 0;
          } else {
            var todayCount = 0;
            var yesterdayCount = 0;
          }
        } else {
          // Super admin - get all transactions
          const { data: todayTransactions } = await supabase
            .from('nd_pos_transaction')
            .select('id')
            .gte('transaction_date', today.toISOString())
            .lt('transaction_date', tomorrow.toISOString());
          
          const { data: yesterdayTransactions } = await supabase
            .from('nd_pos_transaction')
            .select('id')
            .gte('transaction_date', yesterday.toISOString())
            .lt('transaction_date', today.toISOString());
          
          var todayCount = todayTransactions?.length || 0;
          var yesterdayCount = yesterdayTransactions?.length || 0;
        }

        // Get total products (inventory + services)
        let inventoryCount = 0;
        let servicesCount = 0;

        // Get inventory count
        let productsQuery = supabase
          .from('nd_inventory')
          .select('id')
          .is('deleted_at', null);

        if (siteId) {
          productsQuery = productsQuery.eq('site_id', siteId);
        }

        const { data: productsData } = await productsQuery;
        inventoryCount = productsData?.length || 0;

        // Get services count (always show all services for now, or filter by site if needed)
        const { data: servicesData } = await supabase
          .from('nd_category_service')
          .select('id');

        servicesCount = servicesData?.length || 0;

        const totalProductsCount = inventoryCount + servicesCount;

        // Calculate growth
        const transactionsGrowth = yesterdayCount > 0 
          ? Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
          : todayCount > 0 ? 100 : 0;

        return {
          totalSales: totalSales,
          salesGrowth: 0,
          totalTransactions: todayCount,
          transactionsGrowth: transactionsGrowth,
          totalProducts: totalProductsCount,
          productsGrowth: 0
        };
      } catch (error) {
        return {
          totalSales: 0,
          salesGrowth: 0,
          totalTransactions: 0,
          transactionsGrowth: 0,
          totalProducts: 0,
          productsGrowth: 0
        };
      }
    }
  });

  const { data: sites = [], isLoading: isLoadingSites } = useQuery({
    queryKey: ["sites-for-filter"],
    queryFn: async () => {
      let query = supabase
        .from('nd_site')
        .select(`
          id,
          nd_site_profile!site_profile_id(
            sitename
          )
        `)
        .order('nd_site_profile(sitename)'); // Order by sitename

      // If not super admin, filter by organization
      if (!isSuperAdmin && organizationId) {
        query = query.eq('nd_site_profile.dusp_tp_id', organizationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data?.map(site => ({
        id: site.id,
        sitename: site.nd_site_profile?.sitename || `Site ${site.id}`
      })) || [];
    },
    enabled: true,
  });

  // Fetch site performance data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['site-performance', siteCurrentPage, searchTerm, siteFilter, performanceFilter, sortField, sortDirection],
    queryFn: async () => {
      try {
        // Get all sites with their inventory and transaction data in fewer queries
        let sitesQuery = supabase
          .from('nd_site')
          .select(`
            id,
            standard_code,
            nd_site_profile!site_profile_id(
              id,
              sitename
            )
          `);

        // Apply specific site filter if exists (but not search term here)
        if (siteFilter) {
          sitesQuery = sitesQuery.eq('id', parseInt(siteFilter));
        }

        const { data: allSitesData, error: allSitesError } = await sitesQuery;
        if (allSitesError) throw allSitesError;

        if (!allSitesData?.length) {
          return { data: [], count: 0 };
        }

        const siteIds = allSitesData.map(site => site.id);

        // Get all inventory for these sites in one query
        const { data: allInventoryData } = await supabase
          .from('nd_inventory')
          .select('id, site_id')
          .in('site_id', siteIds)
          .is('deleted_at', null);

        // Group inventory by site
        const inventoryBySite = {};
        allInventoryData?.forEach(inv => {
          if (!inventoryBySite[inv.site_id]) {
            inventoryBySite[inv.site_id] = [];
          }
          inventoryBySite[inv.site_id].push(inv.id);
        });

        // Get all inventory IDs
        const allInventoryIds = allInventoryData?.map(inv => inv.id) || [];

        // Get all transaction items for these inventories in one query
        const { data: allTransactionItems } = allInventoryIds.length > 0 
          ? await supabase
              .from('nd_pos_transaction_item')
              .select('total_price, transaction_id, item_id')
              .in('item_id', allInventoryIds)
          : { data: [] };

        // Group transaction data by site
        const transactionsBySite = {};
        const salesBySite = {};

        // Process inventory items
        allTransactionItems?.forEach(item => {
          // Find which site this item belongs to
          const siteId = allInventoryData?.find(inv => inv.id === item.item_id)?.site_id;
          if (siteId) {
            if (!transactionsBySite[siteId]) {
              transactionsBySite[siteId] = new Set();
            }
            if (!salesBySite[siteId]) {
              salesBySite[siteId] = 0;
            }
            transactionsBySite[siteId].add(item.transaction_id);
            salesBySite[siteId] += item.total_price || 0;
          }
        });

        // Process service transactions
        for (const siteData of allSitesData) {
          const siteId = siteData.id;
          
          // Get users for this site
          const { data: siteUsers } = await supabase
            .from('nd_site_user')
            .select('user_id')
            .eq('site_profile_id', siteData.nd_site_profile?.id);
          
          const siteUserIds = siteUsers?.map(user => user.user_id) || [];
          
          if (siteUserIds.length > 0) {
            // Get service transactions for this site
            const { data: serviceTransactions } = await supabase
              .from('nd_pos_transaction')
              .select('id')
              .in('created_by', siteUserIds);
            
            const serviceTransactionIds = serviceTransactions?.map(t => t.id) || [];
            
            if (serviceTransactionIds.length > 0) {
              // Get service transaction items
              const { data: serviceTransactionItems } = await supabase
                .from('nd_pos_transaction_item')
                .select('total_price, transaction_id')
                .in('transaction_id', serviceTransactionIds)
                .not('service_id', 'is', null);
              
              // Add to site data
              serviceTransactionItems?.forEach(item => {
                if (!transactionsBySite[siteId]) {
                  transactionsBySite[siteId] = new Set();
                }
                if (!salesBySite[siteId]) {
                  salesBySite[siteId] = 0;
                }
                transactionsBySite[siteId].add(item.transaction_id);
                salesBySite[siteId] += item.total_price || 0;
              });
            }
          }
        }

        const { data: servicesData } = await supabase
          .from('nd_category_service')
          .select('id');
        const servicesCount = servicesData?.length || 0;

        // Build performance data
        const allSitePerformance = allSitesData.map(site => ({
          site: site.nd_site_profile?.sitename || `Site ${site.id}`,
          siteId: site.id,
          siteCode: site.standard_code || '-',
          transactionCount: transactionsBySite[site.id]?.size || 0,
          totalSales: salesBySite[site.id] || 0,
          productCount: (inventoryBySite[site.id]?.length || 0) + servicesCount
        }));

        // Apply search filter here (after getting all data)
        let filteredPerformance = allSitePerformance;
        if (searchTerm) {
          filteredPerformance = allSitePerformance.filter(site => 
            site.site.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply performance filter
        if (performanceFilter === "top10") {
          filteredPerformance = filteredPerformance
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 10);
        }

        // Apply sorting
        if (sortField) {
          filteredPerformance.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortField) {
              case "site":
                valueA = a.site || "";
                valueB = b.site || "";
                break;
              case "siteCode":
                valueA = a.siteCode || "";
                valueB = b.siteCode || "";
                break;
              case "transactionCount":
                valueA = a.transactionCount || 0;
                valueB = b.transactionCount || 0;
                break;
              case "totalSales":
                valueA = a.totalSales || 0;
                valueB = b.totalSales || 0;
                break;
              case "productCount":
                valueA = a.productCount || 0;
                valueB = b.productCount || 0;
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

        // Add ranking based on sorted data
        const rankedPerformance = filteredPerformance.map((site, index) => ({
          ...site,
          ranking: index + 1
        }));

        // Apply pagination to filtered results
        const startIndex = (siteCurrentPage - 1) * sitesPageSize;
        const endIndex = startIndex + sitesPageSize;
        const paginatedPerformance = filteredPerformance.slice(startIndex, endIndex);

        return {
          data: paginatedPerformance,
          count: filteredPerformance.length
        };
      } catch (error) {
        console.error('Error fetching site performance:', error);
        return {
          data: [],
          count: 0
        };
      }
    },
    enabled: !isTPSiteUser
  });

  // Fetch top selling products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products', parsedMetadata?.group_profile?.site_profile_id, isSuperAdmin, isTPUser],
    queryFn: async () => {
      try {
        let inventoryIds = [];
        let productSales = {};

        // Handle TP Site users - only their own site's products
        if (isTPSiteUser) {
          const siteProfileId = parsedMetadata?.group_profile?.site_profile_id;
          if (!siteProfileId) return [];

          // Get site_id first
          const { data: siteData } = await supabase
            .from('nd_site')
            .select('id')
            .eq('site_profile_id', siteProfileId)
            .single();

          if (!siteData) return [];

          // Get inventory IDs for this site
          const { data: siteInventory } = await supabase
            .from('nd_inventory')
            .select('id')
            .eq('site_id', siteData.id)
            .is('deleted_at', null);
            
          inventoryIds = siteInventory?.map(inv => inv.id) || [];
          
          if (inventoryIds.length === 0) return [];

          // Get transaction items for this site's inventory
          const { data: transactionItems } = await supabase
            .from('nd_pos_transaction_item')
            .select('item_id, quantity')
            .in('item_id', inventoryIds);

          // Get inventory details
          const { data: inventoryData } = await supabase
            .from('nd_inventory')
            .select('id, name')
            .in('id', inventoryIds)
            .is('deleted_at', null);

          // Create product sales map
          const itemNameMap = {};
          inventoryData?.forEach(item => {
            itemNameMap[item.id] = item.name;
          });

          transactionItems?.forEach(item => {
            const productName = itemNameMap[item.item_id];
            if (productName) {
              if (!productSales[productName]) {
                productSales[productName] = 0;
              }
              productSales[productName] += item.quantity || 0;
            }
          });
        } 
        // Handle Super Admin and TP Admin - all products from all sites
        else {
          // Get all transaction items (inventory items only for now)
          const { data: allTransactionItems } = await supabase
            .from('nd_pos_transaction_item')
            .select('item_id, quantity')
            .not('item_id', 'is', null);

          // Get all unique item IDs
          const uniqueItemIds = [...new Set(allTransactionItems?.map(item => item.item_id) || [])];
          
          if (uniqueItemIds.length > 0) {
            // Get inventory details for all items
            const { data: allInventoryData } = await supabase
              .from('nd_inventory')
              .select('id, name')
              .in('id', uniqueItemIds)
              .is('deleted_at', null);

            // Create product sales map
            const itemNameMap = {};
            allInventoryData?.forEach(item => {
              itemNameMap[item.id] = item.name;
            });

            allTransactionItems?.forEach(item => {
              const productName = itemNameMap[item.item_id];
              if (productName) {
                if (!productSales[productName]) {
                  productSales[productName] = 0;
                }
                productSales[productName] += item.quantity || 0;
              }
            });
          }
        }

        // Convert to array and sort by sales
        const sortedProducts = Object.entries(productSales)
          .map(([product, sales]) => ({
            product,
            sales: `${sales} units`
          }))
          .sort((a, b) => parseInt(b.sales) - parseInt(a.sales))
          .slice(0, 5);

        return sortedProducts;
      } catch (error) {
        console.error('Error fetching top products:', error);
        return [];
      }
    }
  });
  
  const handleSiteSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (statsData) {
      setDashboardStats(statsData);
    }
    if (performanceData) {
      setSitePerformanceData(performanceData.data);
    }
    if (productsData) {
      setTopSellingProducts(productsData);
    }
  }, [statsData, performanceData, productsData]);

  useEffect(() => {
    setSiteCurrentPage(1);
  }, [searchTerm, siteFilter, performanceFilter]);

  const sitesTotalPages = Math.ceil((performanceData?.count || 0) / sitesPageSize);

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">POS Dashboard</h1>
          <Button 
            onClick={() => navigate('/pos/sales')}
            className="flex items-center gap-2"
          >
            New Sales
          </Button>
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
                 {statsLoading ? "Loading..." : `RM${dashboardStats.totalSales.toFixed(2)}`}
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
                {statsLoading ? "Loading..." : dashboardStats.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.transactionsGrowth >= 0 ? '+' : ''}
                {dashboardStats.transactionsGrowth}% from yesterday
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
                {statsLoading ? "Loading..." : dashboardStats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.productsGrowth >= 0 ? '+' : ''}
                {dashboardStats.productsGrowth} new this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* TP Site Performance Card */}
        {!isTPSiteUser && (
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">TP Site Performance</h2>
                <Button 
                  onClick={() => navigate('/pos/transactions')}
                  className="flex items-center gap-2"
                >
                  View Detail
                </Button>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by site name..."
                    value={searchTerm}
                    onChange={handleSiteSearch}
                    className="pl-9"
                  />
                </div>
                <div className="relative">
                  <select
                    value={performanceFilter}
                    onChange={(e) => setPerformanceFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[150px]"
                  >
                    <option value="all">All Sites</option>
                    <option value="top10">Top Sites</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer w-[100px]"
                      onClick={() => handleSort("ranking")}
                    >
                      <div className="flex items-center">
                        Ranking
                        {sortField === "ranking" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-[150px]"
                      onClick={() => handleSort("siteCode")}
                    >
                      <div className="flex items-center">
                        Site Code
                        {sortField === "siteCode" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-[200px]"
                      onClick={() => handleSort("site")}
                    >
                      <div className="flex items-center">
                        Site Name
                        {sortField === "site" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-[150px]"
                      onClick={() => handleSort("transactionCount")}
                    >
                      <div className="flex items-center">
                        Transaction Count
                        {sortField === "transactionCount" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-[150px]"
                      onClick={() => handleSort("totalSales")}
                    >
                      <div className="flex items-center">
                        Total Sales
                        {sortField === "totalSales" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-[120px]"
                      onClick={() => handleSort("productCount")}
                    >
                      <div className="flex items-center">
                        Product Count
                        {sortField === "productCount" ? (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        ) : (
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={`skeleton-row-${index}`}>
                          <TableCell><div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        </TableRow>
                      ))
                  ) : (performanceData?.data || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <p className="text-gray-500">No sites found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (performanceData?.data || []).map((site, index) => (
                      <TableRow key={site.siteId}>
                        <TableCell className="font-semibold">
                          {(siteCurrentPage - 1) * sitesPageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-semibold">{site.siteCode}</TableCell>
                        <TableCell className="font-semibold">{site.site}</TableCell>
                        <TableCell>{site.transactionCount}</TableCell>
                        <TableCell>RM{site.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{site.productCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Site Performance Pagination */}
            {performanceData?.data?.length > 0 && (
              <div className="mt-4">
                <PaginationComponent
                  currentPage={siteCurrentPage}
                  totalPages={sitesTotalPages}
                  onPageChange={setSiteCurrentPage}
                  totalItems={performanceData?.count || 0}
                  pageSize={sitesPageSize}
                  startItem={(siteCurrentPage - 1) * sitesPageSize + 1}
                  endItem={Math.min(siteCurrentPage * sitesPageSize, performanceData?.count || 0)}
                />
              </div>
            )}
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
              <div key={index} className="grid grid-cols-2 p-4 border-b last:border-0">
                <div className="font-medium">{product.product}</div>
                <div className="text-right">{product.sales}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
};

export default POSDashboard;
