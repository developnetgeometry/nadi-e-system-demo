
import { ApprovalCondition } from "@/types/workflow";
import { Label } from "@/components/ui/label";
import { ConditionItem } from "./ConditionItem";
import { ConditionForm } from "./ConditionForm";

interface ApprovalConditionsProps {
  conditions: ApprovalCondition[];
  onAddCondition: (condition: ApprovalCondition) => void;
  onRemoveCondition: (id: string) => void;
}

export function ApprovalConditions({
  conditions,
  onAddCondition,
  onRemoveCondition
}: ApprovalConditionsProps) {
  return (
    <div className="space-y-3">
      <Label>Approval Conditions</Label>
      {conditions.length > 0 ? (
        <div className="space-y-2">
          {conditions.map(condition => (
            <ConditionItem
              key={condition.id}
              condition={condition}
              onRemove={onRemoveCondition}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">No conditions set</div>
      )}
      
      <ConditionForm onAddCondition={onAddCondition} />
    </div>
  );
}
