import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useInsertSiteClosureData, useUpdateSiteClosureData } from './submit-siteclosure-data';

type FormData = {
  remark: string;
  close_start: string;
  close_end: string;
  start_time: string;
  end_time: string;
  category_id: string;
  subcategory_id: string;
  affectArea: string[];
  session: string;
  status: string;
};

type ValidationErrors = {
  close_start?: string;
  close_end?: string;
  session?: string;
  start_time?: string;
  end_time?: string;
  category_id?: string;
  subcategory_id?: string;
  remark?: string;
  affectArea?: string;
};

type SubmissionType = "draft" | "submit" | null;

export const useSiteClosureForm = (
  siteId: string,
  siteCode: string,
  editData: any,
  isSuperAdmin: boolean,
  onSuccess?: () => void,
  onOpenChange?: (open: boolean) => void
) => {
  const { toast } = useToast();
  const { insertSiteClosureData, loading: isInserting } = useInsertSiteClosureData();
  const { updateSiteClosureData, loading: isUpdating } = useUpdateSiteClosureData();
  
  // Combined loading state
  const isSubmitting = isInserting || isUpdating;
  
  // Form state
  const [formState, setFormState] = useState<FormData>({
    remark: "",
    close_start: "",
    close_end: "",
    start_time: "",
    end_time: "",
    category_id: "",
    subcategory_id: "",
    affectArea: [],
    session: "",
    status: "2", // Default status is 2 for submit
  });
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // File handling state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<string[]>([]);
  const [wasFormCleared, setWasFormCleared] = useState(false);
  
  // Submission state
  const [activeSubmission, setActiveSubmission] = useState<SubmissionType>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Initialize or reset form based on whether we're editing
  useEffect(() => {
    console.log("Setting form state based on editData:", editData ? "editing" : "new form");
    
    // Reset all state first to avoid any lingering values
    setSelectedFiles([]);
    setWasFormCleared(false);
    setValidationErrors({});
    
    if (editData) {
      // Populate form for editing
      setFormState({
        remark: editData.remark || "",
        close_start: editData.close_start || "",
        close_end: editData.close_end || "",
        start_time: editData.start_time || "",
        end_time: editData.end_time || "",
        category_id: editData.category_id || "",
        subcategory_id: editData.subcategory_id || "",
        affectArea: editData.affectArea || [],
        session: editData.session || "",
        status: "1", // Keep as draft
      });
      
      // Set attachment states
      if (editData.existingAttachments && Array.isArray(editData.existingAttachments)) {
        console.log("Setting existing attachments:", editData.existingAttachments.length);
        setExistingAttachments([...editData.existingAttachments]);
        setOriginalAttachments([...editData.existingAttachments]);
      } else {
        console.log("No existing attachments found in edit data");
        setExistingAttachments([]);
        setOriginalAttachments([]);
      }
    } else {
      // Initialize empty form for new request
      console.log("Initializing empty form for new request");
      setFormState({
        remark: "",
        close_start: "",
        close_end: "",
        start_time: "",
        end_time: "",
        category_id: "",
        subcategory_id: "",
        affectArea: [],
        session: "",
        status: "2", // Default status is 2 for submit
      });
      
      // Clear attachment states
      setExistingAttachments([]);
      setOriginalAttachments([]);
    }
  }, [editData]);

  const setField = useCallback((field: string, value: any) => {
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    setFormState(prevState => ({ ...prevState, [field]: value }));
  }, []);
  
  const isDateWithinAllowedRange = useCallback((dateString: string) => {
    if (!dateString || isSuperAdmin) return true;
    
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 6);
    oneWeekFromToday.setHours(23, 59, 59, 999);
    
    return selectedDate <= oneWeekFromToday;
  }, [isSuperAdmin]);

  const handleDateChange = useCallback((field: string, value: string) => {
    if (field === "close_start" && value === "" && formState.close_end) {
      setFormState(prev => ({
        ...prev,
        close_start: "",
        close_end: "",
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
      setFormState(prevState => ({ ...prevState, [field]: value }));
      
      if (field === "close_start" && !isDateWithinAllowedRange(value)) {
        setValidationErrors(prev => ({
          ...prev,
          close_start: "Closure date cannot be more than 1 week in advance"
        }));
      }
    }
  }, [formState.close_end, isDateWithinAllowedRange]);

  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};
    
    if (!formState.close_start) {
      errors.close_start = "Start date is required";
    } else if (!isSuperAdmin && !isDateWithinAllowedRange(formState.close_start)) {
      errors.close_start = "Closure date cannot be more than 1 week in advance";
    }
    
    if (!formState.close_end) {
      errors.close_end = "End date is required";
    }
    
    if (!formState.session) {
      errors.session = "Session is required";
    }
    
    if (!formState.category_id) {
      errors.category_id = "Category is required";
    }
    
    if (!formState.remark) {
      errors.remark = "Reason is required";
    }
    
    if (!formState.affectArea.length) {
      errors.affectArea = "At least one affected area must be selected";
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  }, [formState, isSuperAdmin, isDateWithinAllowedRange]);

  const resetForm = useCallback(() => {
    setFormState({
      remark: "",
      close_start: "",
      close_end: "",
      start_time: "",
      end_time: "",
      category_id: "",
      subcategory_id: "",
      affectArea: [],
      session: "",
      status: "2",
    });
    setValidationErrors({});
    setSelectedFiles([]);
    
    // Track if we're clearing an edit form with existing attachments
    if (editData?.id && existingAttachments.length > 0) {
      setWasFormCleared(true);
    }
    
    setExistingAttachments([]);
  }, [editData?.id, existingAttachments.length]);

  const handleSubmitAsDraft = useCallback(async () => {
    setActiveSubmission("draft");
    setFormState(prev => ({ ...prev, status: "1" }));
    
    const formData = { 
      site_id: siteId, 
      ...formState, 
      status: "1",
      ...(editData?.id ? { 
        id: editData.id,
        existingAttachments: existingAttachments,
        originalAttachments: originalAttachments,
        wasFormCleared: wasFormCleared
      } : {})
    };
    
    try {
      const operation = editData?.id 
        ? updateSiteClosureData(formData, selectedFiles, siteCode)
        : insertSiteClosureData(formData, selectedFiles, siteCode);
      
      const result = await operation;
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Site closure saved as draft successfully."
        });
        if (onSuccess) onSuccess();
        if (onOpenChange) onOpenChange(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the draft.",
        variant: "destructive",
      });
    } finally {
      setActiveSubmission(null);
    }
  }, [
    siteId, formState, editData?.id, existingAttachments, originalAttachments,
    wasFormCleared, selectedFiles, siteCode, updateSiteClosureData,
    insertSiteClosureData, toast, onSuccess, onOpenChange
  ]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmDialog(true);
  }, [validateForm, toast]);

  const processSubmit = useCallback(async () => {
    setActiveSubmission("submit");
    setFormState(prev => ({ ...prev, status: "2" }));

    try {
      let result;
      
      if (editData?.id) {
        const closureData = { 
          site_id: siteId, 
          ...formState, 
          status: "2", 
          id: editData.id,
          existingAttachments: existingAttachments,
          originalAttachments: originalAttachments,
          wasFormCleared: wasFormCleared
        };
        result = await updateSiteClosureData(closureData, selectedFiles, siteCode);
      } else {
        const closureData = { site_id: siteId, ...formState, status: "2" };
        result = await insertSiteClosureData(closureData, selectedFiles, siteCode);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: "Site closure submitted successfully.",
        });
        if (onSuccess) onSuccess();
        if (onOpenChange) onOpenChange(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting site closure:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the site closure.",
        variant: "destructive",
      });
    } finally {
      setActiveSubmission(null);
    }
  }, [
    siteId, formState, editData?.id, existingAttachments, originalAttachments, 
    wasFormCleared, selectedFiles, siteCode, updateSiteClosureData, 
    insertSiteClosureData, toast, onSuccess, onOpenChange
  ]);

  const handleAttachmentsChange = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleExistingAttachmentsChange = useCallback((updatedAttachments: Array<{url: string, name: string}>, supabaseUrl: string) => {
    const updatedPaths = updatedAttachments.map(file => 
      file.url.startsWith(supabaseUrl) ? file.url.substring(supabaseUrl.length) : file.url
    );
    setExistingAttachments(updatedPaths);
  }, []);

  const resetCleanupFlags = useCallback(() => {
    setWasFormCleared(false);
  }, []);

  const cleanupState = useCallback(() => {
    console.log("Cleaning up form state completely");
    setFormState({
      remark: "",
      close_start: "",
      close_end: "",
      start_time: "",
      end_time: "",
      category_id: "",
      subcategory_id: "",
      affectArea: [],
      session: "",
      status: "2",
    });
    setValidationErrors({});
    setSelectedFiles([]);
    setExistingAttachments([]);
    setOriginalAttachments([]);
    setWasFormCleared(false);
    setActiveSubmission(null);
    setShowConfirmDialog(false);
  }, []);

  return {
    formState,
    setFormState,
    setField,
    validationErrors,
    isSubmitting,
    activeSubmission,
    selectedFiles,
    existingAttachments,
    wasFormCleared,
    showConfirmDialog,
    handleDateChange,
    validateForm,
    resetForm,
    handleSubmitAsDraft,
    handleFormSubmit,
    processSubmit,
    handleAttachmentsChange,
    handleExistingAttachmentsChange,
    resetCleanupFlags,
    setShowConfirmDialog,
    cleanupState,
  };
};
