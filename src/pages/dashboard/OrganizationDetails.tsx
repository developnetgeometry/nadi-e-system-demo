
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrganizationDetails as OrgDetails } from "@/components/organizations/OrganizationDetails";

const OrganizationDetails = () => {
  return (
    <DashboardLayout>
      <OrgDetails />
    </DashboardLayout>
  );
};

export default OrganizationDetails;
