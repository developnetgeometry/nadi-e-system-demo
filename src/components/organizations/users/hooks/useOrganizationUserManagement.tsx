
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrganizations } from "@/hooks/use-organizations";
import { UserType } from "@/types/auth";

export const useOrganizationUserManagement = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [filterUserType, setFilterUserType] = useState<string>("all");

  const { 
    useOrganizationQuery,
    useOrganizationUsersQuery, 
    useEligibleUsersQuery,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation 
  } = useOrganizations();

  // Fetch organization to determine eligible user types
  const { data: organization } = useOrganizationQuery(id!);

  // Get eligible user types based on organization type
  const eligibleUserTypes: UserType[] = organization?.type === "dusp" 
    ? ["dusp", "tp", "tp_admin"] 
    : ["tp", "tp_admin"];

  // Fetch users already in the organization
  const { 
    data: orgUsers = [], 
    isLoading: loadingOrgUsers, 
    error: orgUsersError 
  } = useOrganizationUsersQuery(id!);

  // Fetch all available users of eligible types
  const { 
    data: eligibleUsers = [], 
    isLoading: loadingEligibleUsers
  } = useEligibleUsersQuery(eligibleUserTypes);

  // Filter users not already in the organization
  const availableUsers = eligibleUsers.filter(
    (user) => !orgUsers.some((orgUser) => orgUser.user_id === user.id)
  );

  // Filter available users by search term and selected user type
  const filteredAvailableUsers = availableUsers.filter(
    (user) => {
      const matchesSearch = 
        (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchesType = 
        filterUserType === "all" || 
        user.user_type === filterUserType;
      
      return matchesSearch && matchesType;
    }
  );

  // Mutations
  const addUserMutation = useAddUserToOrganizationMutation();
  const removeUserMutation = useRemoveUserFromOrganizationMutation();

  // Add user to organization
  const handleAddUser = (userId: string) => {
    if (!id) return;
    
    console.log("Adding user:", userId, "to org:", id, "with role:", selectedRole);
    
    addUserMutation.mutate({ 
      organization_id: id, 
      user_id: userId,
      role: selectedRole 
    });
  };

  // Remove user from organization
  const handleRemoveUser = (userId: string) => {
    if (!id) return;
    
    console.log("Removing user:", userId, "from org:", id);
    
    removeUserMutation.mutate({ 
      organizationId: id, 
      userId 
    });
  };

  return {
    id,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    filterUserType,
    setFilterUserType,
    eligibleUserTypes,
    orgUsers,
    loadingOrgUsers,
    orgUsersError,
    filteredAvailableUsers,
    loadingEligibleUsers,
    handleAddUser,
    handleRemoveUser
  };
};
