
import { Button } from "@/components/ui/button";
import { type Holiday } from "@/utils/holidayUtils";

interface HolidayFormActionsProps {
  selectedHoliday: Holiday | null;
  onCancel: () => void;
}

export function HolidayFormActions({ selectedHoliday, onCancel }: HolidayFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {selectedHoliday ? 'Update' : 'Create'} Holiday
      </Button>
    </div>
  );
}
