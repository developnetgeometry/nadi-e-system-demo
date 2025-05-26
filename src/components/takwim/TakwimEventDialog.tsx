import { useState, useEffect } from "react";
import { format, differenceInMinutes } from "date-fns";
import {
  CalendarIcon,
  Clock,
  ListFilter,
  List,
  Users,
  User,
  MessageSquare,
  CircleUser,
  Globe,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  EventType,
  TakwimEvent,
  EventCategory,
  Pillar,
  Programme,
  Module,
} from "@/types/takwim";
import { formatDuration } from "@/utils/date-utils";

interface TakwimEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: Omit<TakwimEvent, "id">;
  eventTypes: EventType[];
  onSubmit: (event: Omit<TakwimEvent, "id">) => void;
  categories: EventCategory[];
  pillars: Pillar[];
  programmes: Programme[];
  modules: Module[];
}

const formSchema = z
  .object({
    title: z.string().min(1, { message: "Programme name is required" }),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    type: z.string().min(1, { message: "Event type is required" }),
    description: z.string().optional(),
    location: z.string().optional(),
    category: z.string().min(1, { message: "Category is required" }),
    pillar: z.string().min(1, { message: "Pillar is required" }),
    programme: z.string().min(1, { message: "Programme is required" }),
    module: z.string().min(1, { message: "Module is required" }),
    isGroupEvent: z.boolean().default(false),
    mode: z.enum(["Online", "Physical"], {
      required_error: "Mode is required",
    }),
    targetParticipant: z
      .enum(["umum", "komuniti_madani", "both"])
      .default("umum"),
    trainerName: z
      .string()
      .min(1, { message: "Trainer/organization name is required" }),
  })
  .refine(
    (data) => {
      // Check if end date is at least the same as start date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // If dates are the same, check times
      if (data.startDate.toDateString() === data.endDate.toDateString()) {
        const [startHour, startMinute] = data.startTime.split(":").map(Number);
        const [endHour, endMinute] = data.endTime.split(":").map(Number);

        if (startHour > endHour) return false;
        if (startHour === endHour && startMinute >= endMinute) return false;
      }

      return true;
    },
    {
      message: "End time must be after start time on the same day",
      path: ["endTime"],
    }
  );

export function TakwimEventDialog({
  open,
  onOpenChange,
  eventToEdit,
  eventTypes,
  onSubmit,
  categories,
  pillars,
  programmes,
  modules,
}: TakwimEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredPillars, setFilteredPillars] = useState<Pillar[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [duration, setDuration] = useState<string>("0h");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: eventToEdit?.title || "",
      startDate: eventToEdit?.startDate || new Date(),
      endDate: eventToEdit?.endDate || new Date(),
      startTime: eventToEdit?.startTime || "09:00",
      endTime: eventToEdit?.endTime || "10:00",
      type: eventToEdit?.type || "meeting",
      description: eventToEdit?.description || "",
      location: eventToEdit?.location || "",
      category: eventToEdit?.category || "",
      pillar: eventToEdit?.pillar || "",
      programme: eventToEdit?.programme || "",
      module: eventToEdit?.module || "",
      isGroupEvent: eventToEdit?.isGroupEvent || false,
      mode: eventToEdit?.mode || "Physical",
      targetParticipant: eventToEdit?.targetParticipant || "umum",
      trainerName: eventToEdit?.trainerName || "",
    },
  });

  // Filter pillars based on category
  useEffect(() => {
    const selectedCategory = form.watch("category");
    if (selectedCategory) {
      const filtered = pillars.filter(
        (pillar) => pillar.categoryId === selectedCategory
      );
      setFilteredPillars(filtered);
      form.setValue("pillar", "");
      form.setValue("programme", "");
      form.setValue("module", "");
    }
  }, [form.watch("category"), pillars]);

  // Filter programmes based on pillar
  useEffect(() => {
    const selectedPillar = form.watch("pillar");
    if (selectedPillar) {
      const filtered = programmes.filter(
        (programme) => programme.pillarId === selectedPillar
      );
      setFilteredProgrammes(filtered);
      form.setValue("programme", "");
      form.setValue("module", "");
    }
  }, [form.watch("pillar"), programmes]);

  // Filter modules based on programme
  useEffect(() => {
    const selectedProgramme = form.watch("programme");
    if (selectedProgramme) {
      const filtered = modules.filter(
        (module) => module.programmeId === selectedProgramme
      );
      setFilteredModules(filtered);
      form.setValue("module", "");
    }
  }, [form.watch("programme"), modules]);

  // Calculate duration when start or end time/date changes
  useEffect(() => {
    const startTime = form.watch("startTime");
    const endTime = form.watch("endTime");
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    if (startTime && endTime && startDate && endDate) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const start = new Date(startDate);
      start.setHours(startHour, startMinute, 0);

      const end = new Date(endDate);
      end.setHours(endHour, endMinute, 0);

      // Handle case where end time is before start time (invalid)
      if (end < start) {
        setDuration("Invalid time range");
        return;
      }

      const diffInMinutes = Math.abs(differenceInMinutes(end, start));
      const formattedDuration = formatDuration(diffInMinutes / 60);
      setDuration(formattedDuration);
    }
  }, [
    form.watch("startTime"),
    form.watch("endTime"),
    form.watch("startDate"),
    form.watch("endDate"),
  ]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const newEvent: Omit<TakwimEvent, "id"> = {
      title: values.title,
      startDate: values.startDate,
      endDate: values.endDate,
      startTime: values.startTime,
      endTime: values.endTime,
      type: values.type,
      description: values.description,
      location: values.location,
      category: values.category,
      pillar: values.pillar,
      programme: values.programme,
      module: values.module,
      isGroupEvent: values.isGroupEvent,
      mode: values.mode,
      targetParticipant: values.targetParticipant,
      trainerName: values.trainerName,
      duration: duration,
    };

    // Submit the event
    onSubmit(newEvent);

    // Reset and close the dialog
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  }

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span>
      {children} <span className="text-destructive">*</span>
    </span>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            Add event details to schedule in the Takwim calendar.
            <span className="text-destructive text-sm block mt-1">
              Fields marked with * are required
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Programme Name */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      <RequiredLabel>Programme Name</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter programme name"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Section */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                CATEGORIZATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Category</RequiredLabel>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <ListFilter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pillar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Pillar (Sub Category)</RequiredLabel>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("category")}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <ListFilter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select pillar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPillars.map((pillar) => (
                            <SelectItem key={pillar.value} value={pillar.value}>
                              {pillar.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="programme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Programme</RequiredLabel>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("pillar")}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <List className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select programme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredProgrammes.map((programme) => (
                            <SelectItem
                              key={programme.value}
                              value={programme.value}
                            >
                              {programme.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="module"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Module</RequiredLabel>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("programme")}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <List className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredModules.map((module) => (
                            <SelectItem key={module.value} value={module.value}>
                              {module.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                DATE & TIME
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Start Date</RequiredLabel>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal bg-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select start date</span>
                              )}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>End Date</RequiredLabel>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal bg-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select end date</span>
                              )}
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
                            disabled={(date) =>
                              date < form.getValues("startDate")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Start Time</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="time"
                            {...field}
                            className="pl-9 bg-white"
                          />
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>End Time</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="time"
                            {...field}
                            className="pl-9 bg-white"
                          />
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col">
                  <FormLabel>Duration (Auto Calculated)</FormLabel>
                  <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-white">
                    {duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                EVENT DETAILS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Event Type</RequiredLabel>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                <span
                                  className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    type.color.split(" ")[0]
                                  )}
                                ></span>
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Event location (optional)"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isGroupEvent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 bg-white">
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center">
                          <CircleUser className="mr-2 h-4 w-4" />
                          <RequiredLabel>Group Event</RequiredLabel>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-3 rounded-md border p-4 bg-white">
                      <FormLabel>
                        <Globe className="inline-block mr-2 h-4 w-4" />
                        <RequiredLabel>Mode</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Online" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Online
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Physical" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Physical
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Participants Section */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                PARTICIPANTS & INSTRUCTOR
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="targetParticipant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Users className="inline-block mr-2 h-4 w-4" />
                        <RequiredLabel>Target Participant</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="umum" id="umum" />
                            <label
                              htmlFor="umum"
                              className="text-sm font-normal"
                            >
                              Umum
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="komuniti_madani"
                              id="komuniti_madani"
                            />
                            <label
                              htmlFor="komuniti_madani"
                              className="text-sm font-normal"
                            >
                              Komuniti Madani
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <label
                              htmlFor="both"
                              className="text-sm font-normal"
                            >
                              Both
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <User className="inline-block mr-2 h-4 w-4" />
                        <RequiredLabel>
                          Trainer / Organization Name
                        </RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter trainer or organization name"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <MessageSquare className="inline-block mr-2 h-4 w-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Event description (optional)"
                        className="resize-none bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : eventToEdit
                  ? "Update Event"
                  : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
