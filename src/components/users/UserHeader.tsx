import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserHeaderProps {
  onCreateUser: () => void;
}

export const UserHeader = ({ onCreateUser }: UserHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Button onClick={onCreateUser}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
};