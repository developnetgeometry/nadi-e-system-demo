import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import MemberProfilePage from "@/components/member/MemberProfilePage";

const MemberProfilePages = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <DashboardLayout>
      <MemberProfilePage userId={id} />
    </DashboardLayout>
  );
};

export default MemberProfilePages;