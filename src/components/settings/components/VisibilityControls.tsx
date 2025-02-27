
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserType } from "@/types/auth";

interface VisibilityControlsProps {
  label: string;
  userTypes: UserType[];
  visibilityList: Array<{ visible_to: UserType[] }>;
  identifier: string;
  onUpdateVisibility: (userType: UserType, checked: boolean) => void;
}

export const VisibilityControls = ({
  label,
  userTypes,
  visibilityList,
  identifier,
  onUpdateVisibility
}: VisibilityControlsProps) => {
  // Check if all user types are selected
  const allChecked = userTypes.every(userType => 
    visibilityList.some(item => item.visible_to.includes(userType))
  );

  // Handle "Check All" functionality
  const handleCheckAll = (checked: boolean) => {
    userTypes.forEach(userType => {
      onUpdateVisibility(userType, checked);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">{label}</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${identifier}-check-all`}
            checked={allChecked}
            onCheckedChange={handleCheckAll}
          />
          <Label 
            htmlFor={`${identifier}-check-all`}
            className="text-sm font-medium"
          >
            Check All
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userTypes.map((userType) => (
          <div key={`${identifier}-${userType}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${identifier}-${userType}`}
              checked={visibilityList.some(
                item => item.visible_to.includes(userType)
              )}
              onCheckedChange={(checked) => 
                onUpdateVisibility(userType, checked as boolean)
              }
            />
            <Label 
              htmlFor={`${identifier}-${userType}`}
              className="cursor-help"
            >
              {userType.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
