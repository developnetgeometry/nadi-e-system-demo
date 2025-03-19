
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserGroupList } from "@/components/user-groups/UserGroupList";

export default function UserGroupsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <UserGroupList />
      </div>
    </DashboardLayout>
  );
}
