
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
import { UserPlus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/use-has-permission";
import { createStaffMember } from "@/lib/staff";
import { useUserAccess } from "@/hooks/use-user-access";
import { supabase } from "@/lib/supabase";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

const Employees = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userMetadataString = useUserMetadata();
  const { user } = useAuth();
  const hasPermission = useHasPermission('create_users');
  const { userType } = useUserAccess();
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  
  const [organizationInfo, setOrganizationInfo] = useState<{
    organization_id: string | null;
    organization_name: string | null;
  }>({
    organization_id: null,
    organization_name: null,
  });

  useEffect(() => {
    if (userMetadataString) {
      try {
        const metadata = JSON.parse(userMetadataString);
        setOrganizationInfo({
          organization_id: metadata.organization_id || null,
          organization_name: metadata.organization_name || null,
        });
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadataString]);

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
        
        const siteIds = sites.map(site => site.id);
        
        // Get staff jobs for these sites
        const { data: staffJobs, error: staffJobsError } = await supabase
          .from('nd_staff_job')
          .select('id, staff_id, site_id, join_date, is_active')
          .in('site_id', siteIds);
          
        if (staffJobsError) throw staffJobsError;
        
        if (!staffJobs || staffJobs.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        // Get the staff IDs from the jobs to fetch staff profiles
        const staffIds = staffJobs.map(job => job.staff_id);

        // Fetch staff profiles by ID
        const { data: staffProfiles, error: staffProfilesError } = await supabase
          .from('nd_staff_profile')
          .select('id, fullname, work_email, mobile_no, ic_no, is_active, user_id')
          .in('id', staffIds);
          
        if (staffProfilesError) throw staffProfilesError;
        
        if (!staffProfiles || staffProfiles.length === 0) {
          console.log("No staff profiles found for the given jobs");
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        // Get the user IDs from staff profiles to fetch user types
        const userIds = staffProfiles
          .map(profile => profile.user_id)
          .filter(id => id !== null && id !== undefined);
        
        let userTypesData = [];
        if (userIds.length > 0) {
          // Fetch user types from profiles table
          const { data: userProfiles, error: userProfilesError } = await supabase
            .from('profiles')
            .select('id, user_type')
            .in('id', userIds);
          
          if (userProfilesError) throw userProfilesError;
          userTypesData = userProfiles || [];
        }
        
        // Map the data to our staffList format by joining the data manually
        const formattedStaff = staffJobs.map(job => {
          const staffProfile = staffProfiles.find(profile => profile.id === job.staff_id);
          if (!staffProfile) return null;

          const userProfile = userTypesData.find(p => p.id === staffProfile.user_id);
          const site = sites.find(s => s.id === job.site_id);
          
          return {
            id: staffProfile.id,
            name: staffProfile.fullname || 'Unknown',
            email: staffProfile.work_email || '',
            userType: userProfile?.user_type || 'Unknown',
            employDate: job.join_date,
            status: staffProfile.is_active ? 'Active' : 'Inactive',
            siteLocation: site?.sitename || 'Unknown site',
            phone_number: staffProfile.mobile_no || '',
            ic_number: staffProfile.ic_no || '',
          };
        }).filter(Boolean);
        
        setStaffList(formattedStaff);
        
        // Extract location and status options
        const locations = [...new Set(formattedStaff.map(staff => staff.siteLocation))];
        const statuses = [...new Set(formattedStaff.map(staff => staff.status))];
        
        setLocationOptions(locations);
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

  const formatDate = (dateString) => {
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
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {organizationInfo.organization_name && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-800">
              Managing staff for organization: <strong>{organizationInfo.organization_name}</strong>
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
                  <SelectItem key={location} value={location}>
                    {location}
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
                      <Badge variant="outline" className={statusColors[staff.status]}>
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

export default Employees;
