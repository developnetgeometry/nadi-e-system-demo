
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  return (
    <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
      <Sun className="h-5 w-5" />
    </Button>
  );
};
