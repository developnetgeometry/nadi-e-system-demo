import { useUserMetadata } from '@/hooks/use-user-metadata';
import React from 'react'

const Phase = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;

    return (
        <div>Phase</div>
    )
}

export default Phase;