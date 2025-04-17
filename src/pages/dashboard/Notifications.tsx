
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationList } from "@/components/notifications/NotificationList";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        
        <Card className="overflow-hidden border shadow">
          <NotificationHeader filter={filter} setFilter={setFilter} />
          <NotificationFilters 
            typeFilter={typeFilter} 
            setTypeFilter={setTypeFilter} 
          />
          <NotificationList filter={filter} typeFilter={typeFilter} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
