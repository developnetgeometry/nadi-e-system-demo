import { useState, useEffect } from "react";
import { useUserMetadata } from "./use-user-metadata";

interface UserMetadata {
  user_type: string;
  organization_id: string | null;
  organization_name: string | null;
  user_group?: number;
  user_group_name?: string;
}

export interface UserGroupInfo {
  userType: string;
  groupId: number | null;
  groupName: string | null;
  organizationId: string | null;
  organizationName: string | null;
  // Helper methods to check specific groups
  isUserInGroup: (groupName: string) => boolean;
  isTP: boolean;
  isDUSP: boolean;
  isSuperAdmin: boolean; // Added explicit super admin check
  // Helper method to check if user has access to all features
  hasFullAccess: boolean;
}

export const useUserGroup = (): UserGroupInfo => {
  const [userGroupInfo, setUserGroupInfo] = useState<UserGroupInfo>({
    userType: "",
    groupId: null,
    groupName: null,
    organizationId: null,
    organizationName: null,
    isUserInGroup: () => false,
    isTP: false,
    isDUSP: false,
    isSuperAdmin: false,
    hasFullAccess: false,
  });

  const userMetadataStr = useUserMetadata();

  useEffect(() => {
    if (userMetadataStr) {
      try {
        const userData: UserMetadata = JSON.parse(userMetadataStr);

        // Check for specific user types/groups
        const isSuperAdmin = userData.user_type === "super_admin";
        const isTP = userData.user_group_name === "TP";
        const isDUSP = userData.user_group_name === "DUSP";

        // Create the isUserInGroup function that checks if user belongs to specified group
        const isUserInGroup = (groupName: string): boolean => {
          // Super admin has access to all group features
          if (isSuperAdmin) return true;
          return userData.user_group_name === groupName;
        };

        // Super admin has full access
        const hasFullAccess = isSuperAdmin;

        setUserGroupInfo({
          userType: userData.user_type || "",
          groupId: userData.user_group || null,
          groupName: userData.user_group_name || null,
          organizationId: userData.organization_id,
          organizationName: userData.organization_name,
          isUserInGroup,
          isTP,
          isDUSP,
          isSuperAdmin,
          hasFullAccess,
        });
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadataStr]);

  return userGroupInfo;
};
