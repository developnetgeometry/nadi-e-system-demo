
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter, Building } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/use-has-permission";
import { useUserAccess } from "@/hooks/use-user-access";
import { supabase } from "@/lib/supabase";

const SiteStaff = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userMetadata, isLoading: metadataLoading } = useUserMetadata();
  const { user } = useAuth();
  const hasPermission = useHasPermission('create_users');
  const { userType } = useUserAccess();
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  
  const [organizationInfo, setOrganizationInfo] = useState<{
    organization_id: string | null;
    organization_name: string | null;
  }>({
    organization_id: null,
    organization_name: null,
  });

  useEffect(() => {
    if (userMetadata) {
      try {
        const metadata = JSON.parse(userMetadata);
        setOrganizationInfo({
          organization_id: metadata.organization_id || null,
          organization_name: metadata.organization_name || null,
        });
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadata]);

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (!organizationInfo.organization_id) return;
        
        setIsLoading(true);
        
        // Get sites associated with organization
        const { data: sites, error: sitesError } = await supabase
          .from('nd_site_profile')
          .select('id, sitename')
          .eq('dusp_tp_id', organizationInfo.organization_id);
          
        if (sitesError) throw sitesError;
        
        if (!sites || sites.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }
        
        setLocationOptions(sites.map(site => ({
          id: site.id,
          name: site.sitename
        })));
        
        const siteIds = sites.map(site => site.id);
        
        // Get staff contracts for the center staff user group
        // And only staff_manager and staff_assistant_manager user types
        const { data: userProfiles, error: userProfilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number, ic_number, user_type')
          .like('user_group_name', '%Centre Staff%')
          .in('user_type', ['staff_manager', 'staff_assistant_manager']);
          
        if (userProfilesError) throw userProfilesError;
        
        if (!userProfiles || userProfiles.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        // Get user IDs from profiles to fetch their contracts and site association
        const userIds = userProfiles.map(profile => profile.id);
        
        // Get staff contracts to associate users with sites
        const { data: staffContracts, error: contractsError } = await supabase
          .from('nd_staff_contract')
          .select('id, user_id, site_id, contract_start, is_active')
          .in('user_id', userIds)
          .in('site_id', siteIds);
          
        if (contractsError) throw contractsError;
        
        if (!staffContracts || staffContracts.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        // Get staff profiles for additional details
        const { data: staffProfiles, error: staffProfilesError } = await supabase
          .from('nd_staff_profile')
          .select('id, user_id, fullname, mobile_no, work_email, ic_no, is_active')
          .in('user_id', userIds);
          
        if (staffProfilesError) throw staffProfilesError;
        
        // Create a mapping of site IDs to site names
        const siteMap = new Map(sites.map(site => [site.id, site.sitename]));
        
        // Combine the data to create the staff list
        const formattedStaff = staffContracts.map(contract => {
          const userProfile = userProfiles.find(profile => profile.id === contract.user_id);
          const staffProfile = staffProfiles?.find(profile => profile.user_id === contract.user_id);
          
          if (!userProfile) return null;
          
          return {
            id: userProfile.id,
            name: staffProfile?.fullname || userProfile.full_name || 'Unknown',
            email: staffProfile?.work_email || userProfile.email || '',
            userType: userProfile.user_type || 'Unknown',
            employDate: contract.contract_start,
            status: (staffProfile?.is_active || contract.is_active) ? 'Active' : 'Inactive',
            siteLocation: siteMap.get(contract.site_id) || 'Unknown site',
            siteId: contract.site_id,
            phone_number: staffProfile?.mobile_no || userProfile.phone_number || '',
            ic_number: staffProfile?.ic_no || userProfile.ic_number || '',
          };
        }).filter(Boolean);
        
        setStaffList(formattedStaff);
        
        // Extract status options
        const statuses = [...new Set(formattedStaff.map(staff => staff.status))];
        setStatusOptions(statuses);
        
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast({
          title: "Error",
          description: "Failed to load staff data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaffData();
  }, [organizationInfo.organization_id, toast]);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.userType && staff.userType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (staff.siteLocation && staff.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (staff.email && staff.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      locationFilter === "all" || staff.siteLocation === locationFilter;

    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleAddStaff = () => {
    if (!organizationInfo.organization_id) {
      toast({
        title: "Organization Not Found",
        description: "You need to be associated with an organization to add staff.",
        variant: "destructive",
      });
      return;
    }
    
    const allowedUserTypes = ['tp_admin', 'tp_hr', 'super_admin'];
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast({
        title: "Permission Denied",
        description: "Only TP Admin, HR, and Super Admin users can add staff members.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddStaffOpen(true);
  };

  const handleStaffAdded = async (newStaff: any) => {
    try {
      console.log("Adding new staff member with data:", newStaff);
      
      if (newStaff.id) {
        setStaffList((prevStaff) => [{
          id: newStaff.id,
          name: newStaff.name || newStaff.fullname,
          email: newStaff.work_email || newStaff.email,
          userType: newStaff.userType,
          employDate: newStaff.join_date || new Date().toISOString().split("T")[0],
          status: newStaff.is_active ? "Active" : "Inactive",
          siteLocation: newStaff.siteLocationName || "Unknown site",
          siteId: newStaff.siteLocation,
          phone_number: newStaff.mobile_no || newStaff.phone_number,
          ic_number: newStaff.ic_no || newStaff.ic_number,
        }, ...prevStaff]);
        
        toast({
          title: "Staff Added",
          description: `${newStaff.name || newStaff.fullname} has been added successfully as ${(newStaff.userType || "").replace(/_/g, ' ')} at ${newStaff.siteLocationName || "Unknown site"}.`,
        });
      } else {
        const result = await createStaffMember(newStaff);
        
        setStaffList((prevStaff) => [{
          id: result.data.id,
          name: newStaff.name,
          email: newStaff.email,
          userType: newStaff.userType,
          employDate: newStaff.employDate,
          status: newStaff.status,
          siteLocation: newStaff.siteLocationName || "Unknown site",
          siteId: newStaff.siteLocation,
          phone_number: newStaff.phone_number,
          ic_number: newStaff.ic_number,
        }, ...prevStaff]);
        
        toast({
          title: "Staff Added",
          description: `${newStaff.name} has been added successfully as ${newStaff.userType.replace(/_/g, ' ')} at ${newStaff.siteLocationName || "Unknown site"}.`,
        });
      }
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Site Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Site Staff
          </Button>
        </div>

        {organizationInfo.organization_name && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-800 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Managing site staff for organization: <strong className="ml-1">{organizationInfo.organization_name}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, user type, or location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locationOptions.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Employ Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                    <p className="mt-2 text-muted-foreground">Loading staff data...</p>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>
                      {staff.userType?.replace(/_/g, ' ') || "Unknown"}
                    </TableCell>
                    <TableCell>{staff.employDate ? formatDate(staff.employDate) : "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        staff.status === "Active" 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : staff.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }>
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.siteLocation}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No staff members found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {organizationInfo.organization_id && (
        <StaffFormDialog
          open={isAddStaffOpen}
          onOpenChange={setIsAddStaffOpen}
          organizationId={organizationInfo.organization_id}
          organizationName={organizationInfo.organization_name || "Your Organization"}
          onStaffAdded={handleStaffAdded}
          siteLocations={locationOptions}
        />
      )}
    </DashboardLayout>
  );
};

export default SiteStaff;
