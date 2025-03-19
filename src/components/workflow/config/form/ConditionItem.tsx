
import { ApprovalCondition } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface ConditionItemProps {
  condition: ApprovalCondition;
  onRemove: (id: string) => void;
}

export function ConditionItem({
  condition,
  onRemove
}: ConditionItemProps) {
  const getConditionText = (condition: ApprovalCondition) => {
    switch (condition.type) {
      case "amount":
        return `Amount ${condition.operator} ${condition.value}`;
      case "field_value":
        return `${condition.field} ${condition.operator} ${condition.value}`;
      case "user_role":
        return `User role ${condition.operator} ${condition.value}`;
      case "department":
        return `Department ${condition.operator} ${condition.value}`;
      case "sla":
        return `SLA ${condition.operator} ${condition.value} hours`;
      default:
        return "Unknown condition";
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-md p-2">
      <span className="text-sm">{getConditionText(condition)}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(condition.id)}
      >
        <TrashIcon className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
