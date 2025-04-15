
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
        
        if (!staffProfiles || staffProfiles.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }

        console.log("Found staff profiles:", staffProfiles.length);
        
        // Get the user IDs from staff profiles
        const userIds = staffProfiles.map(profile => profile.id);
        
        // Check which users are associated with the same organization
        const { data: orgUsers, error: orgUsersError } = await supabase
          .from('organization_users')
          .select('user_id, role')
          .eq('organization_id', organizationInfo.organization_id)
          .in('user_id', userIds);
          
        if (orgUsersError) throw orgUsersError;
        
        // If no org users found, return empty list
        if (!orgUsers || orgUsers.length === 0) {
          setStaffList([]);
          setIsLoading(false);
          return;
        }
        
        // Filter staff profiles to only include those associated with the organization
        const orgUserIds = orgUsers.map(ou => ou.user_id);
        const filteredStaffProfiles = staffProfiles.filter(profile => 
          orgUserIds.includes(profile.id)
        );
        
        // Map the data to our staffList format
        const formattedStaff = filteredStaffProfiles.map(profile => {
          const orgUser = orgUsers.find(ou => ou.user_id === profile.id);
          
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

  return {
    staffList,
    isLoading,
    statusOptions,
  };
};
