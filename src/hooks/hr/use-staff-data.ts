
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  employDate: string;
  status: string;
  phone_number: string;
  ic_number: string;
  role: string;
}

interface OrganizationInfo {
  organization_id: string | null;
  organization_name: string | null;
}

export const useStaffData = (
  user: any,
  organizationInfo: OrganizationInfo
) => {
  const { toast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (!organizationInfo.organization_id) return;
        
        setIsLoading(true);
        
        // Fetch users with user_group=3 (TP users) under the same organization_id
        const { data: staffProfiles, error: staffProfilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number, ic_number, user_type, created_at, user_group')
          .eq('user_group', 3)
          .neq('id', user?.id); // Exclude current user
          
        if (staffProfilesError) throw staffProfilesError;
        
        // Fetch center staff (user_group=6) who are associated with sites under this organization
        const { data: centerStaffProfiles, error: centerStaffError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number, ic_number, user_type, created_at, user_group')
          .eq('user_group', 6)
          .neq('id', user?.id);
          
        if (centerStaffError) throw centerStaffError;
        
        console.log("Found center staff profiles:", centerStaffProfiles?.length);
        
        // Get all staff profiles so we can link them with contracts
        const allStaffProfiles = [...(staffProfiles || []), ...(centerStaffProfiles || [])];
        
        if (!allStaffProfiles || allStaffProfiles.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }
        
        // Get the user IDs from all staff profiles
        const userIds = allStaffProfiles.map(profile => profile.id);
        
        // For TP staff (user_group=3), check organization_users table
        const { data: orgUsers, error: orgUsersError } = await supabase
          .from('organization_users')
          .select('user_id, role')
          .eq('organization_id', organizationInfo.organization_id)
          .in('user_id', userIds);
          
        if (orgUsersError) throw orgUsersError;
        
        // For center staff (user_group=6), we need to query staff contracts and site profiles
        const { data: staffContracts, error: contractsError } = await supabase
          .from('nd_staff_contract')
          .select('user_id, site_id')
          .in('user_id', userIds);
          
        if (contractsError) throw contractsError;
        
        if (staffContracts && staffContracts.length > 0) {
          // Get all the site IDs from staff contracts
          const siteIds = staffContracts.map(contract => contract.site_id).filter(Boolean);
          
          // Get sites that belong to the organization
          const { data: sites, error: sitesError } = await supabase
            .from('nd_site_profile')
            .select('id, sitename')
            .eq('dusp_tp_id', organizationInfo.organization_id)
            .in('id', siteIds.length > 0 ? siteIds : [0]); // Fallback to impossible ID if no sites
            
          if (sitesError) throw sitesError;
          
          // Extract the site IDs associated with this organization
          const orgSiteIds = sites?.map(site => site.id) || [];
          
          // Filter staff contracts to only include those associated with organization sites
          const filteredContracts = staffContracts.filter(contract => 
            orgSiteIds.includes(contract.site_id)
          );
          
          // Get user IDs of center staff associated with this organization's sites
          const centerStaffOrgUserIds = filteredContracts.map(contract => contract.user_id);
          
          // Filter center staff profiles to only include those with contracts in organization sites
          const filteredCenterStaff = centerStaffProfiles?.filter(
            profile => centerStaffOrgUserIds.includes(profile.id)
          ) || [];
          
          console.log("Filtered center staff count:", filteredCenterStaff.length);
          
          // For TP staff, get the ones directly associated with the organization
          const orgUserIds = orgUsers?.map(ou => ou.user_id) || [];
          const filteredTPStaff = staffProfiles?.filter(
            profile => orgUserIds.includes(profile.id)
          ) || [];
          
          // Combine filtered TP staff and center staff
          const filteredStaffProfiles = [...filteredTPStaff, ...filteredCenterStaff];
          
          // Map the data to our staffList format
          const formattedStaff = filteredStaffProfiles.map(profile => {
            const orgUser = orgUsers?.find(ou => ou.user_id === profile.id);
            const contract = staffContracts?.find(sc => sc.user_id === profile.id);
            
            return {
              id: profile.id,
              name: profile.full_name || 'Unknown',
              email: profile.email || '',
              userType: profile.user_type || 'Unknown',
              employDate: profile.created_at,
              status: 'Active', // Default status since we don't have that data
              phone_number: profile.phone_number || '',
              ic_number: profile.ic_number || '',
              role: orgUser?.role || 'Member',
            };
          });
          
          setStaffList(formattedStaff);
          
          // Extract status options
          const statuses = [...new Set(formattedStaff.map(staff => staff.status))];
          setStatusOptions(statuses);
        } else {
          // Handle case where there are no staff contracts
          const orgUserIds = orgUsers?.map(ou => ou.user_id) || [];
          const filteredStaffProfiles = staffProfiles?.filter(
            profile => orgUserIds.includes(profile.id)
          ) || [];
          
          // Map the data to our staffList format for TP staff only
          const formattedStaff = filteredStaffProfiles.map(profile => {
            const orgUser = orgUsers?.find(ou => ou.user_id === profile.id);
            
            return {
              id: profile.id,
              name: profile.full_name || 'Unknown',
              email: profile.email || '',
              userType: profile.user_type || 'Unknown',
              employDate: profile.created_at,
              status: 'Active', // Default status
              phone_number: profile.phone_number || '',
              ic_number: profile.ic_number || '',
              role: orgUser?.role || 'Member',
            };
          });
          
          setStaffList(formattedStaff);
          
          // Extract status options
          const statuses = [...new Set(formattedStaff.map(staff => staff.status))];
          setStatusOptions(statuses);
        }
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
  }, [organizationInfo.organization_id, toast, user?.id]);

  // Add method to update staff list
  const addStaffMember = (newStaff: any) => {
    // Create a staff member object in the expected format
    const staffMember: StaffMember = {
      id: newStaff.id,
      name: newStaff.name || newStaff.fullname,
      email: newStaff.work_email || newStaff.email,
      userType: newStaff.userType,
      employDate: newStaff.join_date || new Date().toISOString().split("T")[0],
      status: newStaff.is_active ? "Active" : "Inactive",
      phone_number: newStaff.mobile_no || newStaff.phone_number,
      ic_number: newStaff.ic_no || newStaff.ic_number,
      role: newStaff.role || "Member",
    };
    
    setStaffList(prevStaff => [staffMember, ...prevStaff]);
  };

  return {
    staffList,
    isLoading,
    statusOptions,
    addStaffMember,
  };
};
