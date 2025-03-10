
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { HolidayFormDialog } from "@/components/holidays/HolidayFormDialog";
import { HolidayList } from "@/components/holidays/HolidayList";
import { HolidayCalendar } from "@/components/holidays/HolidayCalendar";
import * as z from "zod";

interface Holiday {
  id: number;
  desc: string;
  date: string;
  year: number;
  status: number;
  states?: { id: number; name: string }[];
}

interface State {
  id: number;
  name: string;
  code?: string;
  abbr?: string;
  region_id?: number;
}

const holidayFormSchema = z.object({
  desc: z.string().min(1, "Holiday name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  states: z.array(z.number()).optional(),
  status: z.number().default(1)
});

const StateHolidays = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const { isSuperAdmin } = useUserAccess();

  // Function to fetch holidays for the selected year
  const fetchHolidays = async (year: number) => {
    setIsLoading(true);
    try {
      const { data: holidaysData, error: holidaysError } = await supabase
        .from('nd_leave_public_holiday')
        .select('*')
        .eq('year', year)
        .eq('status', 1);

      if (holidaysError) throw holidaysError;

      // For each holiday, fetch the states
      const holidaysWithStates = await Promise.all(
        (holidaysData || []).map(async (holiday) => {
          const { data: stateAssignments, error: stateError } = await supabase
            .from('nd_leave_public_holiday_state')
            .select('state_id')
            .eq('public_holiday_id', holiday.id);

          if (stateError) throw stateError;

          // Get state details for each assignment
          const stateIds = stateAssignments?.map(assignment => assignment.state_id) || [];
          
          if (stateIds.length === 0) {
            return {
              ...holiday,
              states: []
            };
          }
          
          const { data: stateDetails, error: detailsError } = await supabase
            .from('nd_state')
            .select('id, name')
            .in('id', stateIds);

          if (detailsError) throw detailsError;

          return {
            ...holiday,
            states: stateDetails || []
          };
        })
      );

      setHolidays(holidaysWithStates);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast({
        variant: "destructive",
        title: "Failed to load holidays",
        description: "There was an error loading the holiday data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all states
  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('nd_state')
        .select('id, name, code, abbr, region_id')
        .order('name');

      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error('Error fetching states:', error);
      toast({
        variant: "destructive",
        title: "Failed to load states",
        description: "There was an error loading the state data.",
      });
    }
  };

  useEffect(() => {
    fetchHolidays(currentYear);
    fetchStates();
  }, [currentYear]);

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleAddHoliday = () => {
    setSelectedHoliday(null);
    setIsDialogOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDialogOpen(true);
  };

  const handleDeleteHoliday = async (holidayId: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      // First, delete the state assignments
      const { error: stateError } = await supabase
        .from('nd_leave_public_holiday_state')
        .delete()
        .eq('public_holiday_id', holidayId);

      if (stateError) throw stateError;

      // Then, delete the holiday
      const { error: holidayError } = await supabase
        .from('nd_leave_public_holiday')
        .delete()
        .eq('id', holidayId);

      if (holidayError) throw holidayError;

      toast({
        title: "Holiday deleted",
        description: "The holiday has been successfully deleted.",
      });

      // Refresh the holiday list
      fetchHolidays(currentYear);
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete holiday",
        description: "There was an error deleting the holiday.",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof holidayFormSchema>) => {
    try {
      const formattedDate = format(values.date, 'yyyy-MM-dd');
      const year = values.date.getFullYear();
      
      let holidayId;
      
      if (selectedHoliday) {
        // Update existing holiday
        const { error } = await supabase
          .from('nd_leave_public_holiday')
          .update({
            desc: values.desc,
            date: formattedDate,
            year: year,
            status: values.status
          })
          .eq('id', selectedHoliday.id);

        if (error) throw error;
        holidayId = selectedHoliday.id;
        
        // Delete existing state assignments before adding new ones
        const { error: deleteError } = await supabase
          .from('nd_leave_public_holiday_state')
          .delete()
          .eq('public_holiday_id', holidayId);
          
        if (deleteError) throw deleteError;
      } else {
        // Create new holiday
        const { data, error } = await supabase
          .from('nd_leave_public_holiday')
          .insert({
            desc: values.desc,
            date: formattedDate,
            year: year,
            status: values.status
          })
          .select();

        if (error) throw error;
        holidayId = data[0].id;
      }

      // Add state assignments if states were selected
      if (values.states && values.states.length > 0) {
        const stateAssignments = values.states.map(stateId => ({
          public_holiday_id: holidayId,
          state_id: stateId,
          created_by: user?.id,
          created_at: new Date()
        }));

        const { error: statesError } = await supabase
          .from('nd_leave_public_holiday_state')
          .insert(stateAssignments);

        if (statesError) throw statesError;
      }

      toast({
        title: selectedHoliday ? "Holiday updated" : "Holiday created",
        description: `The holiday has been successfully ${selectedHoliday ? 'updated' : 'created'}.`,
      });

      // Refresh the holiday list
      fetchHolidays(currentYear);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving holiday:', error);
      toast({
        variant: "destructive",
        title: `Failed to ${selectedHoliday ? 'update' : 'create'} holiday`,
        description: "There was an error saving the holiday data.",
      });
    }
  };

  // Get holidays for the selected date
  const getHolidaysForDate = (date: Date | undefined) => {
    if (!date) return [];
    const formattedDate = format(date, 'yyyy-MM-dd');
    return holidays.filter(holiday => holiday.date === formattedDate);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">State Holidays Management</h1>
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
              ? `Holidays for ${format(selectedDate, 'PPP')}` 
              : 'Select a date to view holidays'}
            holidays={getHolidaysForDate(selectedDate)}
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
