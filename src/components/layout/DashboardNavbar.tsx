
import { Bell, Settings, Menu, ChevronDown, Sun, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useSidebar } from "@/hooks/use-sidebar";
import { sidebarStyles } from "@/utils/sidebar-styles";
import { cn } from "@/lib/utils";

export const DashboardNavbar = () => {
  const { logout, user } = useAuth();
  const { settings } = useAppSettings();
  const { isMobile, toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Get navbar title from settings
  const navbarTitle =
    settings.find((s) => s.key === "navbar_title")?.value || "";

  // Fetch user profile including name and role
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, user_type")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Get first character of name for avatar fallback
  const getNameInitial = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return "U"; // Default to 'U' for User if no name is available
  };

  // Format user type for display
  const formatUserType = (userType: string) => {
    if (!userType) return "";
    return userType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-border/10 bg-white",
        sidebarStyles.navbarBackground
      )}
    >
      <div className="flex h-16 items-center px-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {(!isMobile && isCollapsed) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="mr-4 hidden md:flex">
          <h2 className="text-lg font-semibold text-gray-800">{navbarTitle}</h2>
        </div>
        
        {isMobile && (
          <h2 className="text-lg font-semibold text-gray-800 flex-1">
            {navbarTitle}
          </h2>
        )}
        
        <div className={cn(
          "flex items-center space-x-4",
          !isMobile && "flex-1 justify-end"
        )}>
          <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
            <Sun className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>
              <NotificationList />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      Light
                    </Button>
                    <Button variant="outline" size="sm">
                      Dark
                    </Button>
                    <Button variant="outline" size="sm">
                      System
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Notification Preferences
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-sm">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-sm">Push notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="pl-2 pr-3 py-2 h-auto hover:bg-gray-100 flex items-center gap-2 rounded-full"
              >
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage
                    src=""
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {getNameInitial()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium text-gray-800">
                    {profile?.full_name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profile?.user_type ? formatUserType(profile.user_type) : "Loading..."}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || "Loading..."}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.user_type
                      ? formatUserType(profile.user_type)
                      : "Loading..."}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
