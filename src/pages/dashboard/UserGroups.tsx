import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserGroupList } from "@/components/user-groups/UserGroupList";

export default function UserGroupsPage() {
  return (
    <div>
      <div className="space-y-1">
        <UserGroupList />
      </div>
    </div>
  );
}
