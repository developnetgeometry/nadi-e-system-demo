import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/auth";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const NotificationList = () => {
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      console.log("Notifications fetched:", data);
      return data as Notification[];
    },
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  };

  if (isLoading) {
    return (
      <div className="py-4 px-6 text-sm text-muted-foreground flex items-center justify-center">
        <Bell className="h-4 w-4 animate-pulse mr-2" />
        Loading notifications...
      </div>
    );
  }

  if (error) {
    console.error("Notification list error:", error);
    return (
      <div className="py-4 px-6 text-sm text-red-500 flex items-center justify-center">
        <XCircle className="h-4 w-4 mr-2" />
        Error loading notifications. Please try again later.
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="py-4 px-6 text-sm text-muted-foreground flex items-center justify-center">
        <Bell className="h-4 w-4 mr-2" />
        No new notifications
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
            notification.read ? "opacity-60 bg-muted/20" : ""
          )}
        >
          <div className="flex-shrink-0 mt-1">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none mb-1">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(notification.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};