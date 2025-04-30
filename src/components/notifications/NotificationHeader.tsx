import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNotifications } from "./hooks/useNotifications";

interface NotificationHeaderProps {
  filter: "all" | "unread" | "read";
  setFilter: (filter: "all" | "unread" | "read") => void;
}

export const NotificationHeader = ({
  filter,
  setFilter,
}: NotificationHeaderProps) => {
  const { handleMarkAllAsRead } = useNotifications({ filter });

  const filters = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
  ];

  return (
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <div className="flex space-x-1">
        {filters.map((item) => (
          <Button
            key={item.value}
            variant={filter === item.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(item.value as "all" | "unread" | "read")}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleMarkAllAsRead}
        className="text-xs flex items-center gap-1"
      >
        <Check className="h-3 w-3" />
        Mark all as read
      </Button>
    </div>
  );
};
