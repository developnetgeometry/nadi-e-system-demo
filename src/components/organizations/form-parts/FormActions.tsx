
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isUploading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function FormActions({ 
  isUploading, 
  isEditing, 
  onCancel 
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>{isEditing ? "Update" : "Create"} Organization</>
        )}
      </Button>
    </div>
  );
}
