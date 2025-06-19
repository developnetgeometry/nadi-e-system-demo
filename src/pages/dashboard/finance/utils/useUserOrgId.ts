import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useUserOrgId = () => {
    const userMetadata = useUserMetadata();
        const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
        const tpAdminOrganizationId =
            parsedMetadata?.user_type !== "super_admin" &&
                parsedMetadata?.user_group_name === "TP" &&
                parsedMetadata?.user_type === "tp_admin" &&
                !!parsedMetadata?.organization_name &&
                parsedMetadata?.organization_id
                ? parsedMetadata.organization_id
                : null;
        const tpSiteOrganizationId =
            parsedMetadata?.user_group === 9 &&
                parsedMetadata?.user_group_name === "Site" &&
                parsedMetadata?.user_type === "tp_site" &&
                parsedMetadata?.organization_id
                ? parsedMetadata.organization_id
                : null;
        const tpFinanceOrganizationId =
            parsedMetadata?.user_group === 3 &&
                parsedMetadata?.user_group_name === "TP" &&
                parsedMetadata?.user_type === "tp_finance" &&
                !!parsedMetadata?.organization_name &&
                parsedMetadata?.organization_id
                ? parsedMetadata.organization_id
                : null;
        const tpOperationsOrganizationId =
            parsedMetadata?.user_group === 3 &&
                parsedMetadata?.user_group_name === "TP" &&
                parsedMetadata?.user_type === "member" &&
                !!parsedMetadata?.organization_name &&
                parsedMetadata?.organization_id
                ? parsedMetadata.organization_id
                : null;
    
        const isTpAdmin = !!tpAdminOrganizationId;
        const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
        const isTpSite = !!tpSiteOrganizationId;
        const isTpFinance = !!tpFinanceOrganizationId;
        const isTpOperations = !!tpOperationsOrganizationId;
        const isMember = parsedMetadata?.user_group === 7;
    return {
        tpAdminOrganizationId,
        tpSiteOrganizationId,
        tpFinanceOrganizationId,
        tpOperationsOrganizationId,
        isTpAdmin,
        isSuperAdmin,
        isTpSite,
        isTpFinance,
        isTpOperations,
        isMember
    }
}