import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserGroupList } from "@/components/user-groups/UserGroupList";

export default function UserGroupsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl py-6">
        <UserGroupList />
      </div>
    </DashboardLayout>
  );
}
