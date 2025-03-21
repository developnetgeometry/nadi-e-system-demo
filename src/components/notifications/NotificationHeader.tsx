
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface NotificationHeaderProps {
  filter: "all" | "unread" | "read";
  setFilter: (filter: "all" | "unread" | "read") => void;
}

export const NotificationHeader = ({ filter, setFilter }: NotificationHeaderProps) => {
  const { toast } = useToast();
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingRead(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
        variant: "default",
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    } finally {
      setIsMarkingRead(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b p-4 bg-muted/30">
      <Tabs defaultValue={filter} onValueChange={(value) => setFilter(value as "all" | "unread" | "read")}>
        <TabsList className="grid w-full sm:w-auto grid-cols-3 h-9">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-xs sm:text-sm">
            Unread
          </TabsTrigger>
          <TabsTrigger value="read" className="text-xs sm:text-sm">
            Read
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 sm:mt-0 w-full sm:w-auto" 
        onClick={handleMarkAllRead}
        disabled={isMarkingRead}
      >
        <Check className="mr-1 h-4 w-4" />
        Mark all as read
      </Button>
    </div>
  );
};
