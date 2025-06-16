import { useUserMetadata } from '@/hooks/use-user-metadata';

const Phase = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;
    const organizationId = parsedMetadata?.organization_id;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;    

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Phase Management</h1>
        </div>
    )
}

export default Phase;