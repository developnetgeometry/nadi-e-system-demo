import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Megaphone } from "lucide-react"; // Replace with your actual icon library import

const AnnouncementButton: React.FC<{ unreadCount: number }> = ({
  unreadCount,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/announcements/list");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 hover:bg-gray-100 relative dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={handleRedirect}
        >
          <Megaphone className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};

export { AnnouncementButton };
