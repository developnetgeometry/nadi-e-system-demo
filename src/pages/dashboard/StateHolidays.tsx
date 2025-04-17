
import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { HolidayFormDialog } from "@/components/holidays/HolidayFormDialog";
import { HolidayList } from "@/components/holidays/HolidayList";
import { HolidayCalendar } from "@/components/holidays/HolidayCalendar";
import { getHolidaysForDate } from "@/utils/holidayUtils";
import { useHolidays } from "@/hooks/use-holidays";
import { useHolidayOperations } from "@/hooks/use-holiday-operations";

const StateHolidays = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const { isSuperAdmin } = useUserAccess();
  
  // Use our custom hook for fetching data
  const { 
    currentYear, 
    setCurrentYear, 
    holidays, 
    states, 
    isLoading,
    fetchHolidays 
  } = useHolidays();

  // Use our custom hook for holiday operations
  const {
    selectedHoliday,
    isDialogOpen,
    setIsDialogOpen,
    handleAddHoliday,
    handleEditHoliday,
    handleDeleteHoliday,
    submitHoliday
  } = useHolidayOperations(() => fetchHolidays(currentYear));

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const onSubmit = async (values: any) => {
    await submitHoliday(values, user?.id);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">State Holidays Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {currentYear} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <DropdownMenuItem key={year} onClick={() => handleYearChange(year)}>
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isSuperAdmin && (
              <Button onClick={handleAddHoliday} className="gap-2">
                <Plus className="h-4 w-4" /> Add Holiday
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <HolidayCalendar 
            holidays={holidays}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <HolidayList
            title={selectedDate 
              ? `Holidays for ${selectedDate.toLocaleDateString()}` 
              : 'Select a date to view holidays'}
            holidays={getHolidaysForDate(selectedDate, holidays)}
            isLoading={isLoading}
            onEdit={handleEditHoliday}
            onDelete={handleDeleteHoliday}
            isSuperAdmin={isSuperAdmin}
            emptyMessage="No holidays found for this date."
          />
        </div>

        <div className="mt-6">
          <HolidayList
            title={`All Holidays in ${currentYear}`}
            holidays={holidays}
            isLoading={isLoading}
            onEdit={handleEditHoliday}
            onDelete={handleDeleteHoliday}
            isSuperAdmin={isSuperAdmin}
            emptyMessage={`No holidays found for ${currentYear}.`}
          />
        </div>
      </div>

      <HolidayFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedHoliday={selectedHoliday}
        states={states}
        onSubmit={onSubmit}
      />
    </DashboardLayout>
  );
};

export default StateHolidays;
