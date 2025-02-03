import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationList } from "@/components/notifications/NotificationList";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        <div className="bg-background rounded-lg border shadow-sm">
          <NotificationList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;