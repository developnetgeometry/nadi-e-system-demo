
import { Bell, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export const DashboardNavbar = () => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#000080]/95 backdrop-blur supports-[backdrop-filter]:bg-[#000080]/60">
      <div className="container flex h-14 items-center px-4 sm:px-8">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
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
                <Button variant="ghost" size="icon">
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
                      <Button variant="outline" size="sm">Light</Button>
                      <Button variant="outline" size="sm">Dark</Button>
                      <Button variant="outline" size="sm">System</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Notification Preferences</h4>
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
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};
