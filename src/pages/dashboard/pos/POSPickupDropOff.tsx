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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { FileDown, Filter, Search, Check, Plus } from "lucide-react";
import { useUserMetadata } from "@/hooks/use-user-metadata";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define types for better TypeScript support
interface PUDOFormData {
  pudoType: "pickup" | "drop-off";
  member_id: number | null;
  tracking_number: string;
  weight: number;
  paid_amount: number;
  parcel_deliverd_type_id: number | null;
  pudo_provider_id: number | null;
  item_id: string | null;
}

interface PUDORecord {
  id: number;
  site_profile_id: number | null;
  member_id: number | null;
  parcel_deliverd_type_id: number | null;
  pudo_provider_id: number | null;
  tracking_number: string | null;
  weight: number | null;
  paid_amount: number | null;
  created_by: string | null;
  created_at: string | null;
  updated_by: string | null;
  updated_at: string | null;
  item_id: string | null;
  nd_pudo_provider?: {
    id: number;
    name: string;
    image_url: string | null;
  };
  nd_parcel_delivered_type?: {
    id: number;
    name: string;
  };
  nd_member_profile?: {
    id: number;
    fullname: string;
  };
  nd_site_profile?: {
    id: number;
    sitename: string;
  };
  nd_inventory?: {
    id: string;
    name: string;
  };
}

const POSPickupDropOff = () => {
  const [searchPUDO, setSearchPUDO] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredPUDOs, setFilteredPUDOs] = useState<PUDORecord[]>([]);
  const [isNewPUDOOpen, setIsNewPUDOOpen] = useState(false);
  const { toast } = useToast();
  
  // Form state for new PUDO
  const [newPUDO, setNewPUDO] = useState<PUDOFormData>({
    pudoType: "pickup", // This is for UI only - not sent to database
    member_id: null,
    tracking_number: "",
    weight: 0,
    paid_amount: 0,
    parcel_deliverd_type_id: null,
    pudo_provider_id: null,
    item_id: null, // Added for the new item_id column
  });

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPSiteUser = parsedMetadata?.user_type === "tp_site";
  const canCRUD = isSuperAdmin || isTPSiteUser;
  
  const queryClient = useQueryClient();

  // Fetch PUDO providers
  const { data: pudoProviders } = useQuery({
    queryKey: ['pudo_providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_pudo_provider')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch parcel delivered types
  const { data: parcelTypes } = useQuery({
    queryKey: ['parcel_delivered_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_parcel_delivered_type')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch members (for dropdown)
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nd_member_profile')
        .select('id, fullname')
        .order('fullname');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch inventory items for the item_id selection
    const { data: inventoryItems } = useQuery({
    queryKey: ['inventory_items', parsedMetadata?.group_profile?.site_profile_id],
    queryFn: async () => {
        let query = supabase
        .from('nd_inventory')
        .select('id, name')  // Remove the nd_site relation
        .is('deleted_at', null)
        .order('name');

        // // Filter by site for tp_site users
        // if (isTPSiteUser && parsedMetadata?.group_profile?.site_profile_id) {
        // // First get the site_id from nd_site table
        // const { data: siteData } = await supabase
        //     .from('nd_site')
        //     .select('id')
        //     .eq('site_profile_id', parsedMetadata.group_profile.site_profile_id)
        //     .single();
        
        //     if (siteData) {
        //         query = query.eq('site_id', siteData.id);
        //     }
        // }

        const { data, error } = await query;
        
        if (error) throw error;
        return (data as unknown as { id: string; name: string }[]);
    },
    enabled: !!parsedMetadata,
    });

  // Fetch PUDO records
  const { data: pudoRecords, isLoading, error } = useQuery({
    queryKey: ['pudo_records', parsedMetadata?.group_profile?.site_profile_id],
    queryFn: async () => {
      let query = supabase
        .from('nd_pudo_record')
        .select(`
          *,
          nd_pudo_provider (
            id,
            name,
            image_url
          ),
          nd_parcel_delivered_type (
            id,
            name
          ),
          nd_member_profile (
            id,
            fullname
          ),
          nd_site_profile (
            id,
            sitename
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by site for tp_site users
      if (isTPSiteUser && parsedMetadata?.group_profile?.site_profile_id) {
        query = query.eq('site_profile_id', parsedMetadata.group_profile.site_profile_id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as PUDORecord[];
    },
    enabled: !!parsedMetadata,
  });

  // Fetch inventory details for existing records (separate query to avoid relation issues)
    const { data: inventoryDetails } = useQuery({
    queryKey: ['inventory_details', pudoRecords],
    queryFn: async () => {
        if (!pudoRecords || pudoRecords.length === 0) return {};
        
        const itemIds = pudoRecords
        .map(record => record.item_id)
        .filter(id => id !== null) as string[];  // Keep as string[]
        
        if (itemIds.length === 0) return {};

        const { data, error } = await supabase
        .from('nd_inventory')
        .select('id, name')
        .in('id', itemIds as any);  // This should work with string[] now

        if (error) throw error;
        
        // Convert to lookup object
        const lookup: Record<string, { id: string; name: string }> = {};
        (data as unknown as { id: string; name: string }[])?.forEach(item => {
            lookup[item.id] = item;
        });
        
        return lookup;
    },
    enabled: !!pudoRecords && pudoRecords.length > 0,
    });

  // Create PUDO mutation
  const createPUDOMutation = useMutation({
    mutationFn: async (pudoData: PUDOFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Remove pudoType from the data before sending to database
      const { pudoType, ...dbData } = pudoData;
      
      const recordData = {
        ...dbData,
        site_profile_id: isTPSiteUser ? parsedMetadata?.group_profile?.site_profile_id : null,
        created_by: user?.id,
      };

      console.log("Creating PUDO record with data:", recordData); // Debug log

      const { data, error } = await supabase
        .from('nd_pudo_record')
        .insert([recordData])
        .select();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pudo_records'] });
      setIsNewPUDOOpen(false);
      setNewPUDO({
        pudoType: "pickup",
        member_id: null,
        tracking_number: "",
        weight: 0,
        paid_amount: 0,
        parcel_deliverd_type_id: null,
        pudo_provider_id: null,
        item_id: null,
      });
      toast({
        title: "Success",
        description: "PUDO record created successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Create PUDO error:", error);
      toast({
        title: "Error",
        description: "Failed to create PUDO record: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mark complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('nd_pudo_record')
        .update({ 
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pudo_records'] });
      toast({
        title: "Success",
        description: "PUDO record marked as complete!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update PUDO record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchPUDO(value || "");
  };

  const handleCreatePUDO = () => {
    // Validate required fields
    if (!newPUDO.pudo_provider_id) {
      toast({
        title: "Error",
        description: "Please select a courier provider",
        variant: "destructive",
      });
      return;
    }
    if (!newPUDO.parcel_deliverd_type_id) {
      toast({
        title: "Error",
        description: "Please select how the parcel was received",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting PUDO data:", newPUDO); // Debug log
    createPUDOMutation.mutate(newPUDO);
  };

  const handleMarkComplete = (id: number) => {
    markCompleteMutation.mutate(id);
  };

  // Filter records
  useEffect(() => {
    if (!pudoRecords) return;

    let filtered = [...pudoRecords];
    
    // Apply search filter
    if (searchPUDO) {
      const searchLower = searchPUDO.toLowerCase();
      
      filtered = filtered.filter(record => {
        const idMatch = record.id.toString().toLowerCase().includes(searchLower);
        const trackingMatch = record.tracking_number?.toLowerCase().includes(searchLower);
        const providerMatch = record.nd_pudo_provider?.name?.toLowerCase().includes(searchLower);
        const memberMatch = record.nd_member_profile?.fullname?.toLowerCase().includes(searchLower);
        const siteMatch = record.nd_site_profile?.sitename?.toLowerCase().includes(searchLower);
        const itemMatch = record.item_id && inventoryDetails?.[record.item_id]?.name?.toLowerCase().includes(searchLower);
        
        return idMatch || trackingMatch || providerMatch || memberMatch || siteMatch || itemMatch;
      });
    }
    
    // Apply type filter (based on parcel_deliverd_type_id)
    if (typeFilter) {
      filtered = filtered.filter(record => {
        if (typeFilter === "pickup") {
          return record.nd_parcel_delivered_type?.name?.toLowerCase().includes("pickup");
        } else if (typeFilter === "drop-off") {
          return record.nd_parcel_delivered_type?.name?.toLowerCase().includes("drop");
        }
        return true;
      });
    }
    
    setFilteredPUDOs(filtered);
  }, [pudoRecords, searchPUDO, typeFilter, statusFilter, inventoryDetails]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PUDO</h1>
          <p className="text-muted-foreground">Pickup and Drop-off Management</p>
        </div>
        <div className="flex gap-2">
          {canCRUD && (
            <Dialog open={isNewPUDOOpen} onOpenChange={setIsNewPUDOOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-5 w-5 mr-2" /> New PUDO
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New PUDO Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* PUDO Type Switch */}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="pudo-type">PUDO Type</Label>
                    <Switch
                      id="pudo-type"
                      checked={newPUDO.pudoType === "drop-off"}
                      onCheckedChange={(checked) => 
                        setNewPUDO(prev => ({ ...prev, pudoType: checked ? "drop-off" : "pickup" }))
                      }
                    />
                    <Label>{newPUDO.pudoType === "drop-off" ? "Drop-off" : "Pickup"}</Label>
                  </div>

                  {/* Select Courier */}
                  <div className="space-y-2">
                    <Label>Select Courier *</Label>
                    <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                      {pudoProviders?.map((provider) => (
                        <div
                          key={provider.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            newPUDO.pudo_provider_id === provider.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setNewPUDO(prev => ({ ...prev, pudo_provider_id: provider.id }))}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <img
                              src={provider.image_url || '/200x200.svg'}
                              alt={provider.name}
                              className="w-16 h-16 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/200x200.svg';
                              }}
                            />
                            <span className="text-sm font-medium text-center">{provider.name}</span>
                            {newPUDO.pudo_provider_id === provider.id && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parcel Delivery Type */}
                  <div className="space-y-2">
                    <Label>How Parcel Was Received *</Label>
                    <Select
                      value={newPUDO.parcel_deliverd_type_id?.toString() || ""}
                      onValueChange={(value) => 
                        setNewPUDO(prev => ({ ...prev, parcel_deliverd_type_id: parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery type" />
                      </SelectTrigger>
                      <SelectContent>
                        {parcelTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item Selection */}
                <div className="space-y-2">
                    <Label>Select Item (Optional)</Label>
                    <Select
                        value={newPUDO.item_id || "no-item"}  // Use "no-item" instead of empty string
                        onValueChange={(value) => 
                        setNewPUDO(prev => ({ ...prev, item_id: value === "no-item" ? null : value }))
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Select item or leave blank" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="no-item">No specific item</SelectItem>  {/* Changed from "none" to "no-item" */}
                        {inventoryItems?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                            {item.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                  {/* Payment Amount */}
                  <div className="space-y-2">
                    <Label>Payment Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPUDO.paid_amount}
                      onChange={(e) => setNewPUDO(prev => ({ ...prev, paid_amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Tracking Number and Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tracking Number</Label>
                      <Input
                        value={newPUDO.tracking_number}
                        onChange={(e) => setNewPUDO(prev => ({ ...prev, tracking_number: e.target.value }))}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (Kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newPUDO.weight}
                        onChange={(e) => setNewPUDO(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  {/* Member Selection */}
                <div className="space-y-2">
                    <Label>Select Member (Optional)</Label>
                    <Select
                        value={newPUDO.member_id?.toString() || "walk-in"}  // Use "walk-in" instead of empty string
                        onValueChange={(value) => 
                        setNewPUDO(prev => ({ ...prev, member_id: value === "walk-in" ? null : parseInt(value) }))
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Select member or leave blank for walk-in" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="walk-in">Walk-in Customer</SelectItem>  {/* Changed from "" to "walk-in" */}
                        {members?.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                            {member.fullname}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNewPUDOOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePUDO}
                      disabled={createPUDOMutation.isPending || !newPUDO.pudo_provider_id || !newPUDO.parcel_deliverd_type_id}
                    >
                      {createPUDOMutation.isPending ? "Creating..." : "Create PUDO"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PUDO entries..."
            value={searchPUDO}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
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
                  <TableHead>PUDO ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Handled By</TableHead>
                  <TableHead>Status</TableHead>
                  {canCRUD && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPUDOs.length > 0 ? (
                  filteredPUDOs.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>pu{record.id.toString().padStart(3, '0')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.nd_parcel_delivered_type?.name?.toLowerCase().includes('pickup')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.nd_parcel_delivered_type?.name?.toLowerCase().includes('pickup') ? 'Pickup' : 'Drop-off'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.item_id && inventoryDetails?.[record.item_id] 
                          ? inventoryDetails[record.item_id].name 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <img
                            src={record.nd_pudo_provider?.image_url || '/200x200.svg'}
                            alt={record.nd_pudo_provider?.name || 'Provider'}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/200x200.svg';
                            }}
                          />
                          <span>{record.nd_pudo_provider?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell>TP Site User</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.updated_at 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.updated_at ? '✓ Completed' : '⏳ Pending'}
                        </span>
                      </TableCell>
                      {canCRUD && (
                        <TableCell>
                          {!record.updated_at && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkComplete(record.id)}
                              disabled={markCompleteMutation.isPending}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={canCRUD ? 8 : 7} className="text-center py-6">
                      No PUDO records found
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

export default POSPickupDropOff;