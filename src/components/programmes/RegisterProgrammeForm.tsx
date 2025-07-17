import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  supabase,
  BUCKET_NAME_UTILITIES,
} from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import TimeInput from "@/components/ui/TimePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDuration } from "@/utils/date-utils";
import { format } from "date-fns";
import { BadgeInfo, Vote, Users, Video, Info, CircleUser } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// Import Quill styles if not already imported globally
import "react-quill/dist/quill.snow.css";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Programme name is required" }),
  description: z.string().optional(),
  state: z.string().optional(),
  location: z.string().optional(),
  site_id: z.array(z.string()).optional(),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  trainer_name: z.string().optional(),
  files: z.any().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  pillar: z.string().min(1, { message: "Pillar is required" }),
  programme: z.string().min(1, { message: "Programme is required" }),
  module: z.string().min(1, { message: "Module is required" }),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  dayTimes: z.array(z.object({
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
  })).optional(),
  event_type: z.string().min(1, { message: "Event type is required" }),
  is_group_event: z.boolean().default(false),
  target_participants: z
    .enum(["umum", "komuniti_madani", "both"])
    .default("umum"),
  mode: z.enum(["Physical", "Online"]),
  max_participants: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProgrammeData {
  id: string;
  program_name: string;
  description: string | null;
  location_event: string | null;
  state_id: string | null;
  site_id: string | null;
  start_datetime: string;
  end_datetime: string;
  duration: number;
  trainer_name: string;
  category_id: string;
  subcategory_id: string;
  program_id: string;
  module_id: string;
  program_method: number;
  is_group_event: boolean;
  total_participant: number | null;
  target_participants: boolean;
  status_id: number;
}

interface RegisterProgrammeFormProps {
  programmeData?: ProgrammeData | null;
  isEditMode?: boolean;
}

const RegisterProgrammeForm: React.FC<RegisterProgrammeFormProps> = ({
  programmeData = null,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isUploading, uploadFile } = useFileUpload();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duration, setDuration] = useState("");
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  // States for database values
  const [eventCategories, setEventCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [pillars, setPillars] = useState<
    { value: string; label: string; categoryId: string }[]
  >([]);
  const [programmes, setProgrammes] = useState<
    { value: string; label: string; pillarId: string }[]
  >([]);
  const [modules, setModules] = useState<
    { value: string; label: string; programmeId: string }[]
  >([]);
  const [existingAttachments, setExistingAttachments] = useState<
    { id: string; file_path: string }[]
  >([]);
  const [siteOptions, setSiteOptions] = useState<
    { value: string; label: string; stateId: string; }[]
  >([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [siteCodes, setSiteCodes] = useState({});
  const [differentDays, setDifferentDays] = useState(0);
  const [dayTimes, setDayTimes] = useState([]);

  // Event types
  const eventTypes = [
    { value: "webinar", label: "Webinar", color: "bg-blue-500" },
    { value: "workshop", label: "Workshop", color: "bg-green-500" },
    { value: "conference", label: "Conference", color: "bg-purple-500" },
    { value: "training", label: "Training", color: "bg-yellow-500" },
    { value: "meetup", label: "Meetup", color: "bg-red-500" },
  ];

  const eventTypeToModeMap = {
    "webinar": 1,
    "workshop": 2,
    "conference": 3,
    "training": 3,
    "meetup": 3,
  }

  // Filtered options based on selections
  const [filteredSites, setFilteredSites] = useState([]);
  const [filteredPillars, setFilteredPillars] = useState<
    { value: string; label: string; categoryId: string }[]
  >([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<
    { value: string; label: string; pillarId: string }[]
  >([]);
  const [filteredModules, setFilteredModules] = useState<
    { value: string; label: string; programmeId: string }[]
  >([]);

  // Initialize form with default values or existing programme data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      state: "",
      site_id: [],
      start_date: "",
      end_date: "",
      trainer_name: "",
      files: undefined,
      category: "",
      pillar: "",
      programme: "",
      module: "",
      start_time: "",
      end_time: "",
      dayTimes: [],
      event_type: "",
      is_group_event: false,
      target_participants: "umum",
      mode: "Physical",
      max_participants: "",
      is_active: true,
    },
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from("nd_event_category")
          .select("id, name")
          .eq("is_active", true);

        if (categoryError) throw categoryError;

        const formattedCategories = categoryData.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }));

        setEventCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchPillars = async () => {
      try {
        const { data: pillarData, error: pillarError } = await supabase
          .from("nd_event_subcategory")
          .select("id, name, category_id")
          .eq("is_active", true);

        if (pillarError) throw pillarError;

        const formattedPillars = pillarData.map((pillar) => ({
          value: pillar.id.toString(),
          label: pillar.name,
          categoryId: pillar.category_id.toString(),
        }));

        setPillars(formattedPillars);
      } catch (error) {
        console.error("Error fetching pillars:", error);
      }
    };

    const fetchProgrammes = async () => {
      try {
        const { data: programmeData, error: programmeError } = await supabase
          .from("nd_event_program")
          .select("id, name, subcategory_id")
          .eq("is_active", true);

        if (programmeError) throw programmeError;

        const formattedProgrammes = programmeData.map((programme) => ({
          value: programme.id.toString(),
          label: programme.name,
          pillarId: programme.subcategory_id.toString(),
        }));

        setProgrammes(formattedProgrammes);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    const fetchModules = async () => {
      try {
        const { data: moduleData, error: moduleError } = await supabase
          .from("nd_event_module")
          .select("id, name, program_id")
          .eq("is_active", true);

        if (moduleError) throw moduleError;

        const formattedModules = moduleData.map((module) => ({
          value: module.id.toString(),
          label: module.name,
          programmeId: module.program_id.toString(),
        }));

        setModules(formattedModules);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    const fetchStates = async () => {
      try {
        const { data: stateData, error: stateError } = await supabase
          .from("nd_state")
          .select('*')
          .order('name');

        if (stateError) throw stateError;

        setStateOptions(stateData);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    const fetchSites = async () => {
      try {
        const { data: siteData, error: siteError } = await supabase
          .from("nd_site_profile")
          .select("id, sitename, state_id, nd_state (id, name)")
          .eq("is_active", true)
          .order("sitename");

        if (siteError) throw siteError;

        const formattedSites = siteData.map((site) => ({
          value: site.id.toString(),
          label: site.sitename,
          state: site.nd_state.name,
          stateId: site.state_id.toString(),
          siteId: site.id,
        }));

        setSiteOptions(formattedSites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    const fetchSiteCodes = async () => {
      try {
        const { data: siteCodeData, error: siteCodeError } = await supabase
          .from('nd_site')
          .select('*');

        if (siteCodeError) throw siteCodeError;

        const codeMap = {};
        siteCodeData.forEach(site => {
          codeMap[site.site_profile_id] = site.refid_mcmc;
        });

        setSiteCodes(codeMap);
      } catch (error) {
        console.error("Error fetching site codes:", error);
      }
    }

    fetchCategories();
    fetchPillars();
    fetchProgrammes();
    fetchModules();
    fetchSites();
    fetchStates();
    fetchSiteCodes();
  }, []);

  useEffect(() => {
    if (categoryParam && eventCategories.length > 0) {
      const isValidCategory = eventCategories.find(
        (cat) => cat.value === categoryParam
      );

      if (isValidCategory) {
        form.setValue("category", categoryParam);
      }
    }
  }, [categoryParam, eventCategories, form]);

  // Fetch attachments if in edit mode
  useEffect(() => {
    if (isEditMode && programmeData) {
      const fetchAttachments = async () => {
        try {
          const { data, error } = await supabase
            .from("nd_event_attachment")
            .select("id, file_path")
            .eq("event_id", programmeData.id);

          if (error) throw error;
          setExistingAttachments(data || []);
        } catch (error) {
          console.error("Error fetching attachments:", error);
        }
      };

      fetchAttachments();
    }
  }, [isEditMode, programmeData]);

  // Populate form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && programmeData && siteOptions.length > 0) {
      const startDateTime = new Date(programmeData.start_datetime);
      const endDateTime = new Date(programmeData.end_datetime);

      // Check if we have a site_id or custom location
      const hasSiteId = programmeData.site_id;
      const existingLocation = programmeData.location_event || "";

      // If there's a site_id, find the matching site
      const matchingSite = hasSiteId
        ? siteOptions.find(
            (site) => site.value === programmeData.site_id?.toString()
          )
        : null;

      const stateToSet = matchingSite ? matchingSite.stateId : (programmeData.state_id?.toString() || "");

      // If no site_id but has location_event, it's a custom location
      const shouldUseCustom = !hasSiteId && !!existingLocation;
      setIsCustomLocation(shouldUseCustom);

      form.reset({
        title: programmeData.program_name || "",
        description: programmeData.description || "",
        location: shouldUseCustom ? existingLocation : "",
        state: stateToSet,
        site_id: hasSiteId ? (Array.isArray(programmeData.site_id) ? programmeData.site_id.map(id => id.toString()) : [programmeData.site_id?.toString()]) : [],
        start_date: format(startDateTime, "yyyy-MM-dd"),
        end_date: format(endDateTime, "yyyy-MM-dd"),
        start_time: format(startDateTime, "HH:mm"),
        end_time: format(endDateTime, "HH:mm"),
        trainer_name: programmeData.trainer_name || "",
        category: programmeData.category_id?.toString() || "",
        pillar: programmeData.subcategory_id?.toString() || "",
        programme: programmeData.program_id?.toString() || "",
        module: programmeData.module_id?.toString() || "",
        event_type: "webinar", // This would need to be mapped from your data if available
        is_group_event: programmeData.is_group_event || false,
        target_participants: programmeData.target_participants
          ? "komuniti_madani"
          : "umum",
        mode: programmeData.program_method === 1 ? "Online" : "Physical",
        max_participants: programmeData.total_participant?.toString() || "",
        is_active: programmeData.status_id === 1, // Assuming status_id 1 is active
      });

      // Update filtered options based on loaded values
      if (programmeData.category_id) {
        const filteredPillars = pillars.filter(
          (pillar) => pillar.categoryId === programmeData.category_id.toString()
        );
        setFilteredPillars(filteredPillars);

        if (programmeData.subcategory_id) {
          const filteredProgrammes = programmes.filter(
            (prog) => prog.pillarId === programmeData.subcategory_id.toString()
          );
          setFilteredProgrammes(filteredProgrammes);

          if (programmeData.program_id) {
            const filteredModules = modules.filter(
              (mod) => mod.programmeId === programmeData.program_id.toString()
            );
            setFilteredModules(filteredModules);
          }
        }
      }
    }
  }, [
    isEditMode,
    programmeData,
    pillars,
    programmes,
    modules,
    siteOptions,
    form,
  ]);

  // Watch form fields to calculate duration and filter options
  const watchState = form.watch("state");
  const watchCategory = form.watch("category");
  const watchPillar = form.watch("pillar");
  const watchProgramme = form.watch("programme");
  const watchStartDate = form.watch("start_date");
  const watchEndDate = form.watch("end_date");
  const watchStartTime = form.watch("start_time");
  const watchEndTime = form.watch("end_time");
  const watchMode = form.watch("mode");

  // Filter sites based on selected state
  useEffect(() => {
    if (watchState && siteOptions.length > 0) {
      const filtered = siteOptions.filter(
        (site) => site.stateId === watchState
      );

      setFilteredSites(filtered);

      if(!isEditMode || !programmeData) {
        form.setValue("site_id", []);
        // form.setValue("location", "");
        setIsCustomLocation(false);
      }
    } else {
      setFilteredSites([]);

      if(!isEditMode || !programmeData) {
        form.setValue("site_id", []);
        // form.setValue("location", "");
        setIsCustomLocation(false);
      }
    }
  }, [watchState, siteOptions, form, isEditMode, programmeData]);

  // For single-day time changes
  useEffect(() => {
    if (differentDays === 1 && watchStartDate && watchEndDate && watchStartTime && watchEndTime) {
      const startDateTime = new Date(`${watchStartDate}T${watchStartTime}`);
      const endDateTime = new Date(`${watchEndDate}T${watchEndTime}`);
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      setDuration(formatDuration(durationHours));
    }
  }, [watchStartDate, watchEndDate, watchStartTime, watchEndTime, differentDays]);

  // Calculate duration and dynamic time when dates and times change
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      // const startDateTime = new Date(`${watchStartDate}T${watchStartTime}`);
      // const endDateTime = new Date(`${watchEndDate}T${watchEndTime}`);

      let startDate = new Date(watchStartDate).getTime();
      let endDate = new Date(watchEndDate).getTime();
      const diffDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1; // +1 to include both start and end days

      // Calculate duration in milliseconds
      // const durationMs = endDateTime.getTime() - startDateTime.getTime();

      // Convert to hours
      // const durationHours = durationMs / (1000 * 60 * 60);

      // Format the duration
      // const formattedDuration = formatDuration(durationHours);
      // setDuration(formattedDuration);

      if (diffDays !== differentDays) {
        setDifferentDays(diffDays);

        if (diffDays > 1) {
          // Multi-day event: clear single day times and set up dayTimes
          form.setValue("start_time", "");
          form.setValue("end_time", "");

          const newDayTimes = Array.from({ length: diffDays }, (_, index) => {
            // If had existing times for this day, preserve them
            const existingDay = dayTimes[index];
            return {
              day: index + 1,
              start_time: existingDay?.start_time || "",
              end_time: existingDay?.end_time || "",
            };
          });
  
          setDayTimes(newDayTimes);
          form.setValue("dayTimes", newDayTimes);
        } else {
          // Single day event: clear dayTimes
          setDayTimes([]);
          form.setValue("dayTimes", []);
        }
      }

      // Calculate duration based on times
      if (diffDays > 1) {
        // For multi-day, calculate total duration from all day times
        let totalDuration = 0;
        dayTimes.forEach((dayTime) => {
          if (dayTime.start_time && dayTime.end_time) {
            const dayStart = new Date(`2000-01-01T${dayTime.start_time}`);
            const dayEnd = new Date(`2000-01-01T${dayTime.end_time}`);
            const dayDuration = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
            totalDuration += dayDuration;
          }
        });

        if (totalDuration > 0) {
          setDuration(formatDuration(totalDuration));
        }
      } else {
        // For single day, use original time fields
        const startTime = form.getValues("start_time");
        const endTime = form.getValues("end_time");

        if (startTime && endTime) {
          const startDateTime = new  Date(`${watchStartDate}T${startTime}`);
          const endDateTime = new  Date(`${watchEndDate}T${endTime}`);
          const durationMs = endDateTime.getTime() - startDateTime.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          setDuration(formatDuration(durationHours));
        }
      }

    } else {
      setDifferentDays(0);
      setDayTimes([]);
      setDuration("");
    }
  }, [watchStartDate, watchEndDate, dayTimes, form, differentDays]);

  // Filter pillars based on selected category
  useEffect(() => {
    if (watchCategory) {
      const filtered = pillars.filter(
        (pillar) => pillar.categoryId === watchCategory
      );
      setFilteredPillars(filtered);
      if (!isEditMode || !programmeData) {
        form.setValue("pillar", "");
        form.setValue("programme", "");
        form.setValue("module", "");
      }
    } else {
      setFilteredPillars(pillars);
    }
  }, [watchCategory, pillars, form, isEditMode, programmeData]);

  // Filter programmes based on selected pillar
  useEffect(() => {
    if (watchPillar) {
      const filtered = programmes.filter(
        (programme) => programme.pillarId === watchPillar
      );
      setFilteredProgrammes(filtered);
      if (!isEditMode || !programmeData) {
        form.setValue("programme", "");
        form.setValue("module", "");
      }
    } else {
      setFilteredProgrammes(programmes);
    }
  }, [watchPillar, programmes, form, isEditMode, programmeData]);

  // Filter modules based on selected programme
  useEffect(() => {
    if (watchProgramme) {
      const filtered = modules.filter(
        (module) => module.programmeId === watchProgramme
      );
      setFilteredModules(filtered);
      if (!isEditMode || !programmeData) {
        form.setValue("module", "");
      }
    } else {
      setFilteredModules(modules);
    }
  }, [watchProgramme, modules, form, isEditMode, programmeData]);

  // Handle mode change and reset location-related states
  useEffect(() => {
    if (watchMode === "Physical") {
      // Reset custom location state when switching to Physical
      setIsCustomLocation(false);
      // Don't reset the location field value to preserve user input
    }
  }, [watchMode]);

  useEffect(() => {
    console.log("Current form errors:", form.formState.errors);
    console.log("Current form values:", form.getValues());
  }, [form.formState.errors]);

  const onSubmit = async (data: FormValues) => {

    if (differentDays > 1) {
      // For multi-day events, validate dayTimes array
      if(!data.dayTimes || data.dayTimes.length === 0) {
        toast({
          title: "Error",
          description: "Please fill in start and end times for each day.",
          variant: "destructive",
        });
        return;
      }

      // Check each day has both start and end times
      for (let i = 0; i < data.dayTimes.length; i++) {
        if (!data.dayTimes[i].start_time || !data.dayTimes[i].end_time) {
          toast({
            title: "Error",
            description: `Please fill in both start and end times for Day ${i + 1}`,
            variant: "destructive",
          });
          return;
        }
      }

    } else {
      // For single day events, validate start_time and end_time
      if (!data.start_time || !data.end_time) {
        toast({
          title: "Error",
          description: "Please fill in start and end times.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Get user ID from localStorage
      let userId = null;
      let userSiteProfileId = null;

      try {
        const storedUserMetadata = localStorage.getItem('user_metadata');
        if (storedUserMetadata) {
          const userData = JSON.parse(storedUserMetadata);
          userId = userData.group_profile?.user_id || null;
          userSiteProfileId = userData.group_profile?.site_profile_id || null;
        }
      } catch (error) {
        console.error("Error retrieving user data from localStorage:", error);
      }

      // Calculate duration
      // const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
      // const endDateTime = new Date(`${data.end_date}T${data.end_time}`);
      // const durationHours =
      //   (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

      let startDateTime, endDateTime, durationHours;

      if (differentDays > 1) {
        // For multi-day events, use the first day's start time and last day's end time
        const firstDay = dayTimes[0];
        const lastDay = dayTimes[dayTimes.length - 1];

        if (!firstDay?.start_time || !lastDay?.end_time) {
          toast({
            title: "Error",
            description: "Please fill in all start and end times for each day.",
            variant: "destructive",
          });
          return;
        }

        const startDateStr = `${data.start_date}T${firstDay.start_time}:00`;
        const endDateStr = `${data.end_date}T${lastDay.end_time}:00`;

        startDateTime = new Date(startDateStr);
        endDateTime = new Date(endDateStr);

        // Calculate total duration across all days
        let totalDuration = 0;
        dayTimes.forEach((dayTime, index) => {
          if (dayTime.start_time && dayTime.end_time) {
            const dayDate = new Date(new Date(data.start_date).getTime() + index * 24 * 60 * 60 * 1000);
            const dayStart = new Date(`${dayDate.toISOString().split('T')[0]}T${dayTime.start_time}:00`);
            const dayEnd = new Date(`${dayDate.toISOString().split('T')[0]}T${dayTime.end_time}:00`);
            const dayDuration = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
            totalDuration += dayDuration;
          }
        });

        durationHours = totalDuration;
      } else {
        // For single day events, use the original logic but get times from form
        const startTime = data.start_time;
        const endTime = data.end_time;

        if (!startTime || !endTime) {
          toast({
            title: "Error",
            description: "Please fill in start and end times.",
            variant: "destructive",
          });
          return;
        }

        const startDateStr = `${data.start_date}T${startTime}:00`;
        const endDateStr = `${data.end_date}T${endTime}:00`;

        startDateTime = new Date(startDateStr);
        endDateTime = new Date(endDateStr);
        durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      }

      let siteIdToUse = null;
      if (categoryParam === "2" || categoryParam === "3") {
        siteIdToUse = userSiteProfileId ? [userSiteProfileId] : null;
      } else {
        siteIdToUse = data.site_id && data.site_id.length > 0 ? data.site_id.map(id => parseInt(id)) : null;
      }

      // Calculate if this is a backdated programme
      const actualStartDate = differentDays > 1 ? new Date(data.start_date) : startDateTime;
      const today = new Date();
      today.setHours(0, 0, 0, 0,);
      const isBackdated = actualStartDate < today;

      let statusId;
      if (isBackdated) {
        statusId = 9; // Request approval for backdated programmes
      } else {
        statusId = actualStartDate >= new Date().setHours(0, 0, 0, 0) ? 2 : 1; // 2=Submitted if not backdated, 1=Draft if future
      }

      // Prepare event data
      const eventData = {
        program_name: data.title,
        description: data.description || "",
        location_event: data.location || "",
        site_id: siteIdToUse,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        duration: durationHours,
        trainer_name: data.trainer_name || "",
        created_by: userId,
        requester_id: user?.id,
        category_id: parseInt(data.category),
        subcategory_id: parseInt(data.pillar),
        program_id: parseInt(data.programme),
        module_id: parseInt(data.module),
        program_method: data.mode === "Online" ? 1 : 2, // 1=Online, 2=Physical
        program_mode: eventTypeToModeMap[data.event_type] || 3,
        total_participant: data.max_participants
          ? parseInt(data.max_participants)
          : null,
        status_id: statusId,
        is_active: data.is_active, // Boolean value
        is_group_event: data.is_group_event,
        target_participants: data.target_participants,
        updated_by: user?.id,
      };

      let eventId;

      if (isEditMode && programmeData) {
        // Update existing event
        const { data: updatedEvent, error: updateError } = await supabase
          .from("nd_event")
          .update(eventData)
          .eq("id", programmeData.id)
          .select();

        if (updateError) throw updateError;
        eventId = programmeData.id;

        toast({
          title: "Success",
          description: "Programme updated successfully",
          variant: "default",
        });
      } else {
        // Insert new event
        const { data: newEvent, error: insertError } = await supabase
          .from("nd_event")
          .insert(eventData)
          .select();

        if (insertError) throw insertError;
        eventId = newEvent?.[0]?.id;

        toast({
          title: "Success",
          description: "Programme registered successfully",
          variant: "default",
        });
      }

      // Save individual day schedules if multi-day event
      if (differentDays > 1 && dayTimes.length > 0) {
        const daySchedulePromises = dayTimes.map((dayTime, index) => {
          const dayDate = new Date(new Date(data.start_date).getTime() + index * 24 * 60 * 60 * 1000);
          const scheduleDateStr = dayDate.toISOString().split('T')[0];

          return supabase.from("nd_event_schedule").insert({
            event_id: eventId,
            day_number: index + 1,
            schedule_date: scheduleDateStr,
            start_time: dayTime.start_time,
            end_time: dayTime.end_time,
            created_by: userId,
          });
        });

        await Promise.all(daySchedulePromises);
      }

      // Handle file uploads if any files are present
      const fileInput = document.getElementById("files") as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        // Upload all files and track their paths
        const attachmentPromises = Array.from(fileInput.files).map(
          async (file) => {
            const filePath = await uploadFile(file, "program-attachments");

            if (filePath) {
              // Save attachment reference in nd_event_attachment table
              return supabase.from("nd_event_attachment").insert({
                event_id: eventId,
                file_path: filePath,
                created_by: user?.id,
              });
            }
          }
        );

        // Wait for all attachment uploads to complete
        await Promise.all(attachmentPromises);
      }

      // Redirect to programmes listing after successful submission
      navigate("/programmes");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to register programme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for label with tooltip
  const LabelWithTooltip = ({
    label,
    tooltip,
    children,
  }: {
    label: string;
    tooltip: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">{tooltip}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {children}
    </div>
  );

  const getSiteDisplayText = (site) => {
    const siteCode = siteCodes[site.siteId];
    return siteCode ? `${siteCode} - ${site.label}` : site.label;
  };

  // function to update specific day time
  const updateDayTime = (dayIndex, field, value) => {
    const updatedDayTimes = [...dayTimes];
    updatedDayTimes[dayIndex] = {
      ...updatedDayTimes[dayIndex],
      [field]: value,
    };

    setDayTimes(updatedDayTimes);
    form.setValue("dayTimes", updatedDayTimes);

    // Recalculate total duration
    let totalDuration = 0;
    updatedDayTimes.forEach((dayTime) => {
      if (dayTime.start_time && dayTime.end_time) {
        const dayStart = new Date(`2000-01-01T${dayTime.start_time}`);
        const dayEnd = new Date(`2000-01-01T${dayTime.end_time}`);
        const dayDuration = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
        totalDuration += dayDuration;
      }
    });

    if (totalDuration > 0) {
      setDuration(formatDuration(totalDuration));
    }
  };

  return (
    // Form Title : Programme Creation

    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Program Categorization Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Vote className="h-5 w-5 mr-2" />
              Program Categorization
            </h3>
            {/* Mode and Location/URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Mode*"
                        tooltip="Select whether the programme is held physically or online."
                      />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Physical" id="physical" />
                          <label
                            htmlFor="physical"
                            className="text-sm font-normal"
                          >
                            Physical
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Online" id="online" />
                          <label
                            htmlFor="online"
                            className="text-sm font-normal"
                          >
                            Online
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchMode === "Online" ? (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="Online URL"
                          tooltip="Provide the online meeting link or URL for the programme."
                        />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Programme online URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="Location"
                          tooltip="Provide the full address location for the programme."
                        />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Programme address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {categoryParam === "1" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="State"
                          tooltip="Select a state first to filter available locations."
                        />
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          >
                            <option value="">Select State</option>
                            {stateOptions.map((state) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="Site"
                          tooltip="Please select a state first. Select a site location."
                        />
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value=""
                            onChange={(e) => {
                              // Add the selected site if not already selected
                              const selectedValues = e.target.value;
                              const currentValues = field.value || [];

                              if(!currentValues.includes(selectedValues)) {
                                field.onChange([...currentValues, selectedValues]);
                              }
                            }}
                            disabled={!watchState}
                          >
                              <option value="">
                                {!watchState ? "Please select a state first" : "Choose a site to add..."}
                              </option>
                            {filteredSites
                              .filter(site => !field.value?.includes(site.value))
                              .map((site) => (
                                <option key={site.value} value={site.value}>
                                  {getSiteDisplayText(site)}
                                </option>
                            ))}
                          </select>

                          {/* Display selected sites */}
                          {field.value && field.value.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">
                                Selected Sites ({field.value.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((siteId) => {
                                  const site = filteredSites.find(s => s.value === siteId);
                                  return site ? (
                                    <span key={siteId} className="inline-flex items-center px-2 py-1 rounded-full text-xs">
                                      {getSiteDisplayText(site)}
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newValues = field.value.filter(id => id !== siteId);
                                          field.onChange(newValues);
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                      >
                                        x
                                      </button>
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {/* Category and Pillar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Category*"
                        tooltip="Select the main category for this programme."
                      />
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                        disabled={!!categoryParam}
                      >
                        <option value="">Select Category</option>
                        {eventCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                      <LabelWithTooltip
                        label="Pillar (Sub-category)*"
                        tooltip="Choose the pillar or sub-category under the selected category."
                      />
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                        disabled={!watchCategory}
                      >
                        <option value="">Select Pillar</option>
                        {filteredPillars.map((pillar) => (
                          <option key={pillar.value} value={pillar.value}>
                            {pillar.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Programme and Module */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Programme*"
                        tooltip="Select the specific programme under the chosen pillar."
                      />
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                        disabled={!watchPillar}
                      >
                        <option value="">Select Programme</option>
                        {filteredProgrammes.map((programme) => (
                          <option key={programme.value} value={programme.value}>
                            {programme.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                      <LabelWithTooltip
                        label="Module*"
                        tooltip="Select the module associated with this programme."
                      />
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                        disabled={!watchProgramme}
                      >
                        <option value="">Select Module</option>
                        {filteredModules.map((module) => (
                          <option key={module.value} value={module.value}>
                            {module.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Event Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Video className="h-5 w-5 mr-2" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Event Type*"
                        tooltip="Choose the type of event (e.g., Webinar, Workshop, etc.)."
                      />
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="">Select Event Type</option>
                        {eventTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="is_group_event"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between border rounded-md bg-white px-4 py-3 h-12">
                      <div className="flex items-center">
                        <CircleUser className="mr-2 h-5 w-5 text-muted-foreground" />
                        <LabelWithTooltip
                          label="Group Event"
                          tooltip="Enable if this event is intended for a group rather than individuals."
                        />
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="scale-125"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Start Date*"
                        tooltip="Select the date when the programme will start."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="End Date*"
                        tooltip="Select the date when the programme will end."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {differentDays > 1 ? (
              <div className="space-y-4">
                <h4 className="text-md font-medium">Daily Schedule ({differentDays} days)</h4>
                {Array.from({ length: differentDays }, (_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <h5 className="col-span-full text-sm font-medium text-gray-700">
                      Day {index + 1} - {format(new Date(new Date(watchStartDate).getTime() + index * 24 * 60 * 60 * 1000 ), "EEEE, dd/MM/yyyy")}
                    </h5>
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label={`Start Time Day ${index + 1}*`}
                          tooltip={`Specify the start time for day ${index + 1}.`}
                        />
                      </FormLabel>
                      <FormControl>
                        <TimeInput
                          id={`start_time_day_${index}`}
                          value={dayTimes[index]?.start_time || ""}
                          onChange={(value) => updateDayTime(index, "start_time", value)}
                          disallowSameAsValue=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label={`End Time Day ${index + 1}*`}
                          tooltip={`Specify the end time for day ${index + 1}.`}
                        />
                      </FormLabel>
                      <FormControl>
                        <TimeInput
                          id={`end_time_day_${index}`}
                          value={dayTimes[index]?.end_time || ""}
                          onChange={(value) => updateDayTime(index, "end_time", value)}
                          disallowSameAsValue=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="Start Time*"
                          tooltip="Specify the time the programme will begin."
                        />
                      </FormLabel>
                      <FormControl>
                        <TimeInput
                          id="start_time"
                          value={field.value}
                          onChange={field.onChange}
                          disallowSameAsValue=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTooltip
                          label="End Time*"
                          tooltip="Specify the time the programme will end."
                        />
                      </FormLabel>
                      <FormControl>
                        <TimeInput
                          id="end_time"
                          value={field.value}
                          onChange={field.onChange}
                          disallowSameAsValue=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium leading-none flex items-center gap-1">
                Duration (Hours)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-xs">
                        This field is auto-calculated based on the start and end
                        date/time.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-gray-500 flex items-center">
                {duration || "Will be calculated"}
              </div>
            </div>
          </div>
          {/* Program Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <BadgeInfo className="h-5 w-5 mr-2" />
              Program Information
            </h3>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Programme Name*"
                        tooltip="Enter the official name of the programme."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter programme name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Description"
                        tooltip="Provide a brief description or summary of the programme."
                      />
                    </FormLabel>
                    <FormControl>
                      <div className="min-h-[120px] w-full">
                        <ReactQuill
                          value={field.value || ""}
                          onChange={field.onChange}
                          theme="snow"
                          placeholder="Enter programme description"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Trainer/Organizer And Participants Detail Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Users className="h-5 w-5 mr-2" />
              Trainer/Organizer And Participants Detail
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="trainer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Trainer/Organizer Name"
                        tooltip="Enter the name of the trainer or organizing entity."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Trainer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="target_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Target Participants*"
                        tooltip="Select the intended audience for this programme."
                      />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="umum" id="umum" />
                          <label htmlFor="umum" className="text-sm font-normal">
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
                          <label htmlFor="both" className="text-sm font-normal">
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
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTooltip
                        label="Maximum Participants"
                        tooltip="Specify the maximum number of participants allowed."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Maximum number of participants"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditMode && existingAttachments.length > 0 && (
                <div className="space-y-2 col-span-2">
                  <h3 className="text-sm font-medium">Existing Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {existingAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <span className="text-sm truncate">
                          {attachment.file_path.split("/").pop()}
                        </span>
                        <a
                          href={`${BUCKET_NAME_UTILITIES}/${attachment.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="files"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <FormItem>
                    <FormLabel>
                      {isEditMode ? "Add More Attachments" : "Attachments"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal">
                        This programme is active
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Active programmes will be visible to users and can be
                        registered for.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full md:w-auto"
            >
              {isSubmitting || isUploading
                ? "Submitting..."
                : isEditMode
                ? "Update Programme"
                : "Register Programme"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterProgrammeForm;
