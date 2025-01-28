import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/auth";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const NotificationList = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-2 px-4 text-sm text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="py-2 px-4 text-sm text-muted-foreground">
        No new notifications
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
            notification.read ? "opacity-60" : ""
          )}
        >
          {getIcon(notification.type)}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(notification.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};