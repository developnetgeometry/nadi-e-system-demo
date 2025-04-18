
import { Bell, Check, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/notifications/NotificationList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { id: 1, title: 'New user registered', time: '2 min ago', read: false },
  { id: 2, title: 'Server update completed', time: '1 hour ago', read: false },
  { id: 3, title: 'Server down', time: '3 hours ago', read: false },
  { id: 4, title: 'System maintenance', time: 'Yesterday', read: true }
];
export const NotificationToggle = () => {
  return (
    <div className="relative">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell size={20} />
          <Badge className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] h-5 w-5 flex items-center justify-center p-0">
            04
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 dark:bg-gray-800 dark:text-white dark:border-gray-700" align="end">
        <DropdownMenuLabel className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto px-2 py-1"
            >
              Mark all as read
            </Button>
          </div>
        </DropdownMenuLabel>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent">
              <div className={`flex items-start p-3 gap-3 w-full hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                notification.read ? '' : 'bg-purple-50 dark:bg-purple-900/10'
              }`}>
                <div className={`h-8 w-8 flex items-center justify-center rounded-full ${
                  notification.read ? 'bg-gray-200 dark:bg-gray-700' : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {notification.read ? 
                    <Check size={16} className="text-gray-500 dark:text-gray-400" /> : 
                    <Mail size={16} className="text-purple-500" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <Button 
            variant="ghost" 
            className="w-full h-auto py-3 justify-center rounded-none"
          >
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  );
};
