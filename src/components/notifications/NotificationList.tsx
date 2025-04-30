import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationLoading } from "./NotificationLoading";
import { NotificationError } from "./NotificationError";
import { useNotifications } from "./hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NotificationListProps {
  filter?: "all" | "unread" | "read";
  typeFilter?: string;
}

export const NotificationList = ({
  filter = "all",
  typeFilter = "all",
}: NotificationListProps) => {
  const {
    notifications,
    isLoading,
    error,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications({
    filter,
    typeFilter,
  });

  if (isLoading) {
    return <NotificationLoading />;
  }

  if (error) {
    console.error("Notification list error:", error);
    return <NotificationError />;
  }

  if (!notifications?.length) {
    return <NotificationEmptyState filter={filter} />;
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="px-4 py-2 border-b flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleMarkAllAsRead}
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-1">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              totalCount={notifications.length}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
