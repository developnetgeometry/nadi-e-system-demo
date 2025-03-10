
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";

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

  const form = useForm<z.infer<typeof holidayFormSchema>>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      desc: "",
      states: [],
      status: 1
    },
  });

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
          const { data: stateDetails, error: detailsError } = await supabase
            .from('nd_state')
            .select('id, name')
            .in('id', stateIds.length > 0 ? stateIds : [0]);

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
    form.reset({
      desc: "",
      date: new Date(),
      states: [],
      status: 1
    });
    setSelectedHoliday(null);
    setIsDialogOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    const stateIds = holiday.states?.map(state => state.id) || [];
    
    form.reset({
      desc: holiday.desc,
      date: new Date(holiday.date),
      states: stateIds,
      status: holiday.status
    });
    
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

  // Check if a date is a holiday
  const isHoliday = (date: Date | undefined) => {
    if (!date) return false;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return holidays.some(holiday => holiday.date === formattedDate);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col ml-[240px]">
          <DashboardNavbar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <CalendarIcon className="h-8 w-8 text-primary" />
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
                <Card className="p-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Holiday Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border bg-white pointer-events-auto"
                      modifiers={{
                        holiday: (date) => isHoliday(date)
                      }}
                      modifiersClassNames={{
                        holiday: "bg-red-100 text-red-600 font-bold"
                      }}
                    />
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate 
                        ? `Holidays for ${format(selectedDate, 'PPP')}` 
                        : 'Select a date to view holidays'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDate && getHolidaysForDate(selectedDate).length === 0 && (
                        <p className="text-muted-foreground">No holidays found for this date.</p>
                      )}
                      
                      {selectedDate && getHolidaysForDate(selectedDate).map((holiday) => (
                        <div key={holiday.id} className="border rounded-md p-4 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{holiday.desc}</h3>
                              <p className="text-sm text-muted-foreground">{format(new Date(holiday.date), 'PPP')}</p>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                {holiday.states && holiday.states.map((state) => (
                                  <Badge key={state.id} variant="outline">{state.name}</Badge>
                                ))}
                                
                                {(!holiday.states || holiday.states.length === 0) && (
                                  <Badge variant="outline">All States</Badge>
                                )}
                              </div>
                            </div>
                            
                            {isSuperAdmin && (
                              <div className="flex gap-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleEditHoliday(holiday)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-destructive" 
                                  onClick={() => handleDeleteHoliday(holiday.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>All Holidays in {currentYear}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading holidays...</p>
                  ) : holidays.length === 0 ? (
                    <p className="text-muted-foreground">No holidays found for {currentYear}.</p>
                  ) : (
                    <div className="space-y-4">
                      {holidays.map((holiday) => (
                        <div key={holiday.id} className="border rounded-md p-4 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{holiday.desc}</h3>
                              <p className="text-sm text-muted-foreground">{format(new Date(holiday.date), 'PPP')}</p>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                {holiday.states && holiday.states.map((state) => (
                                  <Badge key={state.id} variant="outline">{state.name}</Badge>
                                ))}
                                
                                {(!holiday.states || holiday.states.length === 0) && (
                                  <Badge variant="outline">All States</Badge>
                                )}
                              </div>
                            </div>
                            
                            {isSuperAdmin && (
                              <div className="flex gap-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleEditHoliday(holiday)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-destructive" 
                                  onClick={() => handleDeleteHoliday(holiday.id)}
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
            </div>
          </main>
        </div>
      </div>

      {/* Holiday form dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holiday Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter holiday name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <div className="grid gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="states"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Apply to States</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Select the states this holiday applies to. If none selected, it applies to all states.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded p-2">
                      {states.map((state) => (
                        <FormField
                          key={state.id}
                          control={form.control}
                          name="states"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={state.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(state.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValue, state.id]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter((id) => id !== state.id)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {state.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedHoliday ? 'Update' : 'Create'} Holiday
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default StateHolidays;
