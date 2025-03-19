
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrganizationHeaderProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function OrganizationHeader({ onEditClick, onDeleteClick }: OrganizationHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/admin/organizations")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Organization Details</h1>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onEditClick}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Organization
        </Button>
        <Button
          variant="destructive"
          onClick={onDeleteClick}
        >
          Delete Organization
        </Button>
      </div>
    </div>
  );
}
