
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MenuVisibilitySettings } from "@/components/settings/MenuVisibility";

export default function MenuVisibility() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Menu Visibility Management</h1>
        <p className="text-muted-foreground">
          Control which user types can access different menus and submodules
        </p>
        <MenuVisibilitySettings />
      </div>
    </DashboardLayout>
  );
}
