import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SiteDetail from "@/components/site/SiteDetail";

const SiteDetails = () => {
  const [searchParams] = useSearchParams(); // Use useSearchParams to get query parameters
  const siteId = searchParams.get("id"); // Retrieve the `id` query parameter

  if (!siteId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <SiteDetail siteId={siteId} />
    </DashboardLayout>
  );
};

export default SiteDetails;