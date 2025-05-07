import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import MemberProfilePage from "@/components/member/MemberProfilePage";

const MemberProfilePages = () => {
  const [searchParams] = useSearchParams(); // Use useSearchParams to get query parameters
  const userId = searchParams.get("id"); // Retrieve the `id` query parameter

  if (!userId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <MemberProfilePage userId={userId} />
    </DashboardLayout>
  );
};

export default MemberProfilePages;