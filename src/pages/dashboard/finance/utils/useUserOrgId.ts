import { useState, useEffect } from "react";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useUserOrgId = () => {
    const userMetadata = useUserMetadata();
    const [state, setState] = useState({
        tpAdminOrganizationId: null,
        tpSiteOrganizationId: null,
        tpFinanceOrganizationId: null,
        tpOperationsOrganizationId: null,
        isTpAdmin: false,
        isSuperAdmin: false,
        isTpSite: false,
        isTpFinance: false,
        isTpOperations: false,
        isMember: false
    });

    useEffect(() => {
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

        setState({
            tpAdminOrganizationId,
            tpSiteOrganizationId,
            tpFinanceOrganizationId,
            tpOperationsOrganizationId,
            isTpAdmin: !!tpAdminOrganizationId,
            isSuperAdmin: parsedMetadata?.user_type === "super_admin",
            isTpSite: !!tpSiteOrganizationId,
            isTpFinance: !!tpFinanceOrganizationId,
            isTpOperations: !!tpOperationsOrganizationId,
            isMember: parsedMetadata?.user_group === 7
        });
    }, [userMetadata]);

    return state;
}

