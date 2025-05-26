import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserGroupList } from "@/components/user-groups/UserGroupList";

export default function UserGroupsPage() {
  return (
    <div>
      <div className="space-y-1 max-w-6xl py-6">
        <UserGroupList />
      </div>
    </div>
  );
}
