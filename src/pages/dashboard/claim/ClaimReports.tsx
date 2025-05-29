import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import MemberProfilePage from "@/components/member/MemberProfilePage";
import ClaimViewPage from "@/components/claims/component/ClaimViewDialog";

const ClaimReports = () => {
  const [searchParams] = useSearchParams(); // Use useSearchParams to get query parameters
  const claimId = searchParams.get("id"); // Retrieve the `id` query parameter

  if (!claimId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <ClaimViewPage claimId={Number(claimId)} />
    </div>
  );
};

export default ClaimReports;
