import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/auth";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4 animate-pulse" />
          <span>Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Notification list error:", error);
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          <span>Error loading notifications</span>
        </div>
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>No new notifications</span>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-1">
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div
              className={cn(
                "group flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-muted/50",
                notification.read ? "opacity-60 bg-muted/20" : "",
                "animate-fade-in"
              )}
            >
              <div className="flex-shrink-0 mt-1 transition-transform group-hover:scale-110">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(notification.created_at)}
                </div>
              </div>
            </div>
            {index < notifications.length - 1 && (
              <Separator className="my-1" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};