import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserGroupList } from "@/components/user-groups/UserGroupList";

export default function UserGroupsPage() {
  return (
    <div>
      <div className="container mx-auto max-w-6xl py-6">
        <UserGroupList />
      </div>
    </div>
  );
}
