import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MenuVisibilitySettings } from "@/components/settings/MenuVisibility";

export default function AccessControl() {
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Access Control</h1>
        <MenuVisibilitySettings />
      </div>
    </div>
  );
}
