
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Moon, Bell, Sun, Mail, Check, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // useEffect only runs on the client, so we need this to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  // Sample notification data
  const notifications = [
    { id: 1, title: 'New user registered', time: '2 min ago', read: false },
    { id: 2, title: 'Server update completed', time: '1 hour ago', read: false },
    { id: 3, title: 'New order received', time: '3 hours ago', read: false },
    { id: 4, title: 'System maintenance', time: 'Yesterday', read: true }
  ];

  const goToNotifications = () => {
    navigate('/notifications');
  };
  
  const goToProfile = () => {
    navigate('/profile');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    toast.success("You have been logged out");
    // In a real application, this would clear the authentication state and redirect to login
  };

  const markAllAsRead = () => {
    toast.success("All notifications marked as read");
    // In a real application, this would update the notification state
  };

  return <div className="w-full bg-white dark:bg-gray-800 shadow-sm mb-0 px-4 py-[20px] sticky top-0 z-50">
      <div className="flex items-center justify-end">
        {/* Right Side Icons */}
        <div className="flex items-center gap-5">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && (
              theme === 'dark' ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} />
            )}
          </Button>

          {/* Notifications Dropdown */}
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
                      onClick={markAllAsRead}
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
                    onClick={goToNotifications}
                  >
                    View all notifications
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Profile with Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage src="/lovable-uploads/ea0a6fe4-1ed5-4d5e-b5b8-0d5395a16576.png" alt="User" />
                  <AvatarFallback>TV</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium dark:text-white">Thomas Vactom</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Web Designer</p>
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 dark:bg-gray-800 dark:text-white">
              <div className="space-y-2">
                <div 
                  className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={goToProfile}
                >
                  Profile
                </div>
                <div 
                  className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={goToSettings}
                >
                  Settings
                </div>
                <div 
                  className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>;
};

export default DashboardHeader;
