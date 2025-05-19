import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Users,
  Video,
  File,
  Clock,
  UserCheck,
  Vote,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TimeInput from "@/components/ui/TimePicker";
import { useFileUpload } from "@/hooks/use-file-upload";
import { getDuration } from "@/components/site/utils/duration";

// Mock data for dropdowns - in a real app, these would come from an API
const CATEGORIES = [
  { value: "technical", label: "Technical Skills" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "digital", label: "Digital Literacy" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
];

const PILLARS = [
  {
    value: "technical-1",
    label: "Programming & Development",
    categoryId: "technical",
  },
  {
    value: "technical-2",
    label: "Network & Security",
    categoryId: "technical",
  },
  { value: "soft-1", label: "Communication", categoryId: "soft-skills" },
  { value: "soft-2", label: "Leadership", categoryId: "soft-skills" },
  { value: "digital-1", label: "Basic Computer Skills", categoryId: "digital" },
  {
    value: "digital-2",
    label: "Internet & Social Media",
    categoryId: "digital",
  },
  {
    value: "entrepreneur-1",
    label: "Business Planning",
    categoryId: "entrepreneurship",
  },
  {
    value: "entrepreneur-2",
    label: "Marketing",
    categoryId: "entrepreneurship",
  },
];

const PROGRAMMES = [
  {
    value: "web-dev",
    label: "Web Development Fundamentals",
    pillarId: "technical-1",
  },
  {
    value: "mobile-dev",
    label: "Mobile App Development",
    pillarId: "technical-1",
  },
  {
    value: "cyber-security",
    label: "Cybersecurity Basics",
    pillarId: "technical-2",
  },
  {
    value: "network-admin",
    label: "Network Administration",
    pillarId: "technical-2",
  },
  { value: "public-speaking", label: "Public Speaking", pillarId: "soft-1" },
  { value: "business-writing", label: "Business Writing", pillarId: "soft-1" },
  { value: "team-management", label: "Team Management", pillarId: "soft-2" },
  {
    value: "project-management",
    label: "Project Management",
    pillarId: "soft-2",
  },
  { value: "computer-basics", label: "Computer Basics", pillarId: "digital-1" },
  { value: "email-basics", label: "Email Essentials", pillarId: "digital-1" },
  {
    value: "social-media",
    label: "Social Media for Business",
    pillarId: "digital-2",
  },
  {
    value: "online-research",
    label: "Online Research Techniques",
    pillarId: "digital-2",
  },
  {
    value: "business-plan",
    label: "Business Plan Creation",
    pillarId: "entrepreneur-1",
  },
  {
    value: "financial-planning",
    label: "Financial Planning",
    pillarId: "entrepreneur-1",
  },
  {
    value: "digital-marketing",
    label: "Digital Marketing",
    pillarId: "entrepreneur-2",
  },
  { value: "branding", label: "Branding Strategy", pillarId: "entrepreneur-2" },
];

const MODULES = [
  { value: "html-css", label: "HTML & CSS Basics", programmeId: "web-dev" },
  {
    value: "javascript",
    label: "JavaScript Fundamentals",
    programmeId: "web-dev",
  },
  {
    value: "react-intro",
    label: "Introduction to React",
    programmeId: "web-dev",
  },
  {
    value: "android-basics",
    label: "Android Development Basics",
    programmeId: "mobile-dev",
  },
  {
    value: "ios-basics",
    label: "iOS Development Basics",
    programmeId: "mobile-dev",
  },
  {
    value: "react-native",
    label: "React Native Development",
    programmeId: "mobile-dev",
  },
  // More modules would be added here
];

const TARGET_PARTICIPANTS = [
  { value: "beginners", label: "Beginners" },
  { value: "intermediates", label: "Intermediates" },
  { value: "advanced", label: "Advanced" },
  { value: "professionals", label: "Professionals" },
  { value: "seniors", label: "Senior Citizens" },
  { value: "youth", label: "Youth" },
  { value: "entrepreneurs", label: "Entrepreneurs" },
];

const EVENT_TYPES = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "conference", label: "Conference" },
  { value: "training", label: "Training" },
  { value: "webinar", label: "Webinar" },
  { value: "hackathon", label: "Hackathon" },
  { value: "course", label: "Course" },
];

const FormSchema = z.object({
  programmeName: z.string().min(3, {
    message: "Programme name must be at least 3 characters.",
  }),
  programmeCode: z.string().min(2, {
    message: "Programme code must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z
    .date({
      required_error: "End date is required.",
    })
    .optional(),
  location: z
    .string()
    .min(3, {
      message: "Location must be at least 3 characters.",
    })
    .optional(),
  maxParticipants: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Maximum participants must be a number.",
  }),
  isActive: z.boolean().default(true),

  // New fields
  category: z.string({
    required_error: "Category is required.",
  }),
  pillar: z.string({
    required_error: "Pillar is required.",
  }),
  programme: z.string({
    required_error: "Programme is required.",
  }),
  module: z.string().optional(),
  startTime: z.string({
    required_error: "Start time is required.",
  }),
  endTime: z.string({
    required_error: "End time is required.",
  }),
  eventType: z.string({
    required_error: "Event type is required.",
  }),
  isGroupEvent: z.boolean().default(false),
  mode: z.enum(["Online", "Physical"], {
    required_error: "Mode is required.",
  }),
  targetParticipant: z.string({
    required_error: "Target participant is required.",
  }),
  trainerName: z.string().min(3, {
    message: "Trainer name must be at least 3 characters.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

const RegisterProgrammeForm: React.FC = () => {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useFileUpload();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [filteredPillars, setFilteredPillars] = useState(PILLARS);
  const [filteredProgrammes, setFilteredProgrammes] = useState(PROGRAMMES);
  const [filteredModules, setFilteredModules] = useState(MODULES);
  const [duration, setDuration] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      programmeName: "",
      programmeCode: "",
      description: "",
      location: "",
      maxParticipants: "50",
      isActive: true,
      isGroupEvent: false,
      mode: "Physical",
    },
  });

  const watchCategory = form.watch("category");
  const watchPillar = form.watch("pillar");
  const watchProgramme = form.watch("programme");
  const watchMode = form.watch("mode");
  const watchStartTime = form.watch("startTime");
  const watchEndTime = form.watch("endTime");
  const watchStartDate = form.watch("startDate");
  const watchEndDate = form.watch("endDate");

  // Calculate duration whenever start or end time changes
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const startDateTime = watchStartDate
        ? `${format(watchStartDate, "yyyy-MM-dd")}T${watchStartTime}:00`
        : `2023-01-01T${watchStartTime}:00`;

      const endDateTime = watchEndDate
        ? `${format(watchEndDate, "yyyy-MM-dd")}T${watchEndTime}:00`
        : watchStartDate
        ? `${format(watchStartDate, "yyyy-MM-dd")}T${watchEndTime}:00`
        : `2023-01-01T${watchEndTime}:00`;

      setDuration(getDuration(startDateTime, endDateTime));
    }
  }, [watchStartTime, watchEndTime, watchStartDate, watchEndDate]);

  // Filter pillars when category changes
  useEffect(() => {
    if (watchCategory) {
      const filtered = PILLARS.filter(
        (pillar) => pillar.categoryId === watchCategory
      );
      setFilteredPillars(filtered);
      form.setValue("pillar", "");
      form.setValue("programme", "");
      form.setValue("module", "");
    }
  }, [watchCategory, form]);

  // Filter programmes when pillar changes
  useEffect(() => {
    if (watchPillar) {
      const filtered = PROGRAMMES.filter(
        (programme) => programme.pillarId === watchPillar
      );
      setFilteredProgrammes(filtered);
      form.setValue("programme", "");
      form.setValue("module", "");
    }
  }, [watchPillar, form]);

  // Filter modules when programme changes
  useEffect(() => {
    if (watchProgramme) {
      const filtered = MODULES.filter(
        (module) => module.programmeId === watchProgramme
      );
      setFilteredModules(filtered);
      form.setValue("module", "");
    }
  }, [watchProgramme, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileUpload = async () => {
    try {
      const uploadPromises = files.map((file) =>
        uploadFile(file, "programme-attachments")
      );

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as string[];

      if (successfulUploads.length > 0) {
        setUploadedFiles((prev) => [...prev, ...successfulUploads]);
        toast({
          title: "Files uploaded successfully",
          description: `${successfulUploads.length} files have been uploaded.`,
        });
        setFiles([]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your files.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(data: FormValues) {
    // Process file uploads first if there are any
    if (files.length > 0) {
      await handleFileUpload();
    }

    // Add duration to the data
    const submissionData = {
      ...data,
      duration,
      attachments: uploadedFiles,
    };

    console.log("Form submitted:", submissionData);
    toast({
      title: "Programme registered successfully",
      description: `${data.programmeName} has been registered.`,
    });
  }

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="programmeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter programme name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the programme as it will appear to users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programmeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NADI-2025" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique code to identify this programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Vote className="h-5 w-5 mr-2" />
              Categorization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      The main category of the programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pillar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pillar (Sub-category)*</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        disabled={!watchCategory}
                        {...field}
                      >
                        <option value="">Select a pillar</option>
                        {filteredPillars.map((pillar) => (
                          <option key={pillar.value} value={pillar.value}>
                            {pillar.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      The pillar/sub-category of the programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme*</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        disabled={!watchPillar}
                        {...field}
                      >
                        <option value="">Select a programme</option>
                        {filteredProgrammes.map((programme) => (
                          <option key={programme.value} value={programme.value}>
                            {programme.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>The specific programme.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="module"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        disabled={!watchProgramme}
                        {...field}
                      >
                        <option value="">Select a module</option>
                        {filteredModules.map((module) => (
                          <option key={module.value} value={module.value}>
                            {module.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Optional: The specific module within the programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date*</FormLabel>
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
                              <span>Select date</span>
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
                    <FormDescription>
                      The date when the programme starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
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
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            form.getValues("startDate") &&
                            date < form.getValues("startDate")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Optional: The date when the programme ends.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time*</FormLabel>
                    <FormControl>
                      <TimeInput
                        id="start-time"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      The time when the programme starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time*</FormLabel>
                    <FormControl>
                      <TimeInput
                        id="end-time"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      The time when the programme ends.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Display */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Duration:</span>
                  <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {duration || "Please select start and end times"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type*</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>The type of event.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isGroupEvent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Group Event</FormLabel>
                      <FormDescription>Is this a group event?</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Mode*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Physical" id="physical" />
                          <label htmlFor="physical">Physical</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Online" id="online" />
                          <label htmlFor="online">Online</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Is this programme conducted physically or online?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchMode === "Physical" && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g. Kuala Lumpur"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Where the programme will take place.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Participants & Instructor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Participants*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The maximum number of participants allowed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetParticipant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Participant*</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Select target participants</option>
                        {TARGET_PARTICIPANTS.map((target) => (
                          <option key={target.value} value={target.value}>
                            {target.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      The target audience for this programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer / Organization Name*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserCheck className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter trainer name"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Name of the trainer or organization running this
                      programme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter programme description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the programme.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <File className="h-5 w-5 mr-2" />
              File Attachments
            </h3>
            <div className="border border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <File className="h-10 w-10 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOCX, XLSX, JPG, PNG up to 10MB each
                  </p>
                </div>
                <Input
                  type="file"
                  className="max-w-sm"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Display selected files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <span>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 p-0 text-red-500"
                        onClick={() => {
                          setFiles(files.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded files:</p>
                <ul className="text-sm space-y-1">
                  {uploadedFiles.map((url, index) => (
                    <li key={index} className="flex items-center">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {url.split("/").pop()}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 p-0 text-red-500"
                        onClick={() => {
                          setUploadedFiles(
                            uploadedFiles.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    This programme will be visible and open for registration.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading files..." : "Register Programme"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterProgrammeForm;
