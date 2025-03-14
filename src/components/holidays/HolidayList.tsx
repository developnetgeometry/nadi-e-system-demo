import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Holiday, type State } from "@/utils/holidayUtils";

interface HolidayListProps {
  title: string;
  holidays: Holiday[];
  isLoading: boolean;
  onEdit: (holiday: Holiday) => void;
  onDelete: (holidayId: number) => void;
  isSuperAdmin: boolean;
  emptyMessage?: string;
}

export function HolidayList({
  title,
  holidays,
  isLoading,
  onEdit,
  onDelete,
  isSuperAdmin,
  emptyMessage = "No holidays found.",
}: HolidayListProps) {
  const renderStatesBadges = (holiday: Holiday) => {
    if (!holiday.states || holiday.states.length === 0) {
      return <Badge variant="outline">None</Badge>;
    }

    return holiday.states.map((state) => (
      <Badge key={state.id} variant="outline">
        {state.name}
      </Badge>
    ));
  };

  // Sort holidays by date
  const sortedHolidays = holidays
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading holidays...</p>
        ) : sortedHolidays.length === 0 ? (
          <p className="text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {sortedHolidays.map((holiday) => (
              <div key={holiday.id} className="border rounded-md p-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{holiday.desc}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(holiday.date), "PPP")}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderStatesBadges(holiday)}
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(holiday)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => onDelete(holiday.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
