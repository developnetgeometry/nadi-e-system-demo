import { useState, useEffect, useCallback, useMemo } from "react";
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
import { UserPlus, Search, Filter, Building, Mail, Phone, CalendarDays, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/use-has-permission";
import { useUserAccess } from "@/hooks/use-user-access";
import { supabase } from "@/lib/supabase";
import { createStaffMember } from "@/lib/staff";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortDirection = "asc" | "desc" | null;
type SortField = "name" | "userType" | "employDate" | "status" | "siteLocation" | null;

interface StaffMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  employDate: string;
  status: string;
  siteLocation: string;
  siteId: string;
  phone_number: string;
  ic_number: string;
}

const SiteStaff = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userMetadata, isLoading: metadataLoading } = useUserMetadata();
  const { user } = useAuth();
  const hasPermission = useHasPermission('create_users');
  const { userType } = useUserAccess();
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
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

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (!organizationInfo.organization_id) return;
        
        setIsLoading(true);
        
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
        
        const { data: userProfiles, error: userProfilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number, ic_number, user_type')
          .like('user_group', 7)
          .in('user_type', ['staff_manager', 'staff_assistant_manager']);
          
        if (userProfilesError) throw userProfilesError;
        
        if (!userProfiles || userProfiles.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        const userIds = userProfiles.map(profile => profile.id);
        
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

        const { data: staffProfiles, error: staffProfilesError } = await supabase
          .from('nd_staff_profile')
          .select('id, user_id, fullname, mobile_no, work_email, ic_no, is_active')
          .in('user_id', userIds);
          
        if (staffProfilesError) throw staffProfilesError;
        
        const siteMap = new Map(sites.map(site => [site.id, site.sitename]));
        
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
        }).filter(Boolean) as StaffMember[];
        
        setStaffList(formattedStaff);
        
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

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  const sortedStaff = useMemo(() => {
    if (!sortField || !sortDirection) return staffList;
    
    return [...staffList].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "userType":
          aValue = a.userType || "";
          bValue = b.userType || "";
          break;
        case "employDate":
          aValue = new Date(a.employDate).getTime();
          bValue = new Date(b.employDate).getTime();
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "siteLocation":
          aValue = a.siteLocation || "";
          bValue = b.siteLocation || "";
          break;
        default:
          return 0;
      }
      
      const compareResult = typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));
        
      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [staffList, sortField, sortDirection]);

  const filteredStaff = useMemo(() => {
    return sortedStaff.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.userType && staff.userType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (staff.siteLocation && staff.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (staff.email && staff.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (staff.phone_number && staff.phone_number.includes(searchQuery));

      const matchesLocation =
        locationFilter === "all" || staff.siteLocation === locationFilter;

      const matchesStatus = statusFilter === "all" || staff.status === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [sortedStaff, searchQuery, locationFilter, statusFilter]);

  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStaff.slice(startIndex, startIndex + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStaff.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStaff(checked ? paginatedStaff.map(staff => staff.id) : []);
  };

  const handleSelectStaff = (staffId: string, checked: boolean) => {
    setSelectedStaff(prev => 
      checked 
        ? [...prev, staffId] 
        : prev.filter(id => id !== staffId)
    );
  };

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
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown 
      className={`ml-1 h-4 w-4 ${
        sortField === field 
          ? "opacity-100" 
          : "opacity-40"
      } ${
        sortField === field && sortDirection === "desc"
          ? "transform rotate-180"
          : ""
      }`} 
    />
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl p-4">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Site Staff Management</CardTitle>
                <CardDescription>
                  Manage staff_manager and staff_assistant_manager accounts
                </CardDescription>
              </div>
              <Button onClick={handleAddStaff}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Site Staff
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                  placeholder="Search by name, email, phone number..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
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
                
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Page Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedStaff.length === paginatedStaff.length && paginatedStaff.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Staff Name <SortIcon field="name" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('userType')}>
                      User Type <SortIcon field="userType" />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('employDate')}>
                      Employ Date <SortIcon field="employDate" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      Status <SortIcon field="status" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('siteLocation')}>
                      Site Location <SortIcon field="siteLocation" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                        <p className="mt-2 text-muted-foreground">Loading staff data...</p>
                      </TableCell>
                    </TableRow>
                  ) : paginatedStaff.length > 0 ? (
                    paginatedStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={selectedStaff.includes(staff.id)}
                            onChange={(e) => handleSelectStaff(staff.id, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {staff.userType?.replace(/_/g, ' ') || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <span className="flex items-center text-xs">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" /> 
                              {staff.email}
                            </span>
                            {staff.phone_number && (
                              <span className="flex items-center text-xs">
                                <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
                                {staff.phone_number}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground" />
                            {staff.employDate ? formatDate(staff.employDate) : "-"}
                          </span>
                        </TableCell>
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
                        <TableCell>
                          <TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No staff members found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredStaff.length)} of {filteredStaff.length} staff members
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
