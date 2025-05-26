import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MenuVisibilitySettings } from "@/components/settings/MenuVisibility";

export default function MenuVisibility() {
  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Menu Visibility Management</h1>
        <p className="text-muted-foreground pb-6">
          Control which user types can access different menus and submodules
        </p>
        <MenuVisibilitySettings />
      </div>
    </div>
  );
}
