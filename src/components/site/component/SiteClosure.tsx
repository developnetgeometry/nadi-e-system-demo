import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useInsertSiteClosureData } from "../hook/submit-siteclosure-data";
import { useSiteCode } from "../hook/use-site-code";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import { SelectMany } from "@/components/ui/SelectMany";
import { fetchClosureCategories, fetchClosureSubCategories, fetchClosureAffectAreas, fetchClosureSession } from "../hook/use-siteclosure";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateInput } from "../../ui/date-input";
import { useDateRangeValidation } from "@/hooks/useDateRangeValidation";
import { useSessionVisibility } from "../hook/use-session-visibility";
import TimeInput from "../../ui/TimePicker";
import { useUserGroup } from "@/hooks/use-user-group";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";


interface SiteClosureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSuccess?: () => void;
}

const SiteClosureForm: React.FC<SiteClosureFormProps> = ({
  open,
  onOpenChange,
  siteId,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { insertSiteClosureData, loading: isSubmitting } = useInsertSiteClosureData();
  const { siteCode } = useSiteCode(siteId);
  const { isTP, isSuperAdmin } = useUserGroup();
  
  const [activeSubmission, setActiveSubmission] = useState<"draft" | "submit" | null>(null);

  
  const [formState, setFormState] = useState({
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
  const [validationErrors, setValidationErrors] = useState<{
    close_start?: string;
    close_end?: string;
    session?: string;
    start_time?: string;
    end_time?: string;
    category_id?: string;
    subcategory_id?: string;
    remark?: string;
    affectArea?: string;
  }>({});
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileUploadRef = React.useRef<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: closureCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['closureCategories'],
    queryFn: fetchClosureCategories,
  });

  const { data: closureSubCategories = [], isLoading: isLoadingSubCategories } = useQuery({
    queryKey: ['closureSubCategories'],
    queryFn: fetchClosureSubCategories,
  });

  const { data: closureAffectAreas = [], isLoading: isLoadingAffectAreas } = useQuery({
    queryKey: ['closureAffectAreas'],
    queryFn: fetchClosureAffectAreas,
  });

  const { data: closureSessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['closureSessions'],
    queryFn: fetchClosureSession,
  });

  const setField = (field: string, value: any) => {
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const isDateWithinAllowedRange = (dateString: string) => {
    if (!dateString || isSuperAdmin) return true;
    
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 6); // 6 days ahead for a total of 7 days including today
    oneWeekFromToday.setHours(23, 59, 59, 999); // End of the 7th day
    
    return selectedDate <= oneWeekFromToday;
  };

  const handleDateChange = (field: string, value: string) => {
    if (field === "close_start" && value === "" && formState.close_end) {
      setFormState(prev => ({
        ...prev,
        close_start: "",
        close_end: "",
      }));
    } else {
      setField(field, value);
      
      // Add validation for dates that are too far in the future
      if (field === "close_start" && !isDateWithinAllowedRange(value)) {
        setValidationErrors(prev => ({
          ...prev,
          close_start: "Closure date cannot be more than 1 week in advance"
        }));
      }
    }
  };

  const validateForm = () => {
    const errors: {
      close_start?: string;
      close_end?: string;
      session?: string;
      start_time?: string;
      end_time?: string;
      category_id?: string;
      subcategory_id?: string;
      remark?: string;
      affectArea?: string;
    } = {};
    
    if (!formState.close_start) {
      errors.close_start = "Start date is required";
    } else if (!isSuperAdmin && !isDateWithinAllowedRange(formState.close_start)) {
      errors.close_start = "Closure date cannot be more than 1 week in advance";
    }
    
    if (!formState.close_end) {
      errors.close_end = "End date is required";
    }
    
    if (isDateRangeValid && !formState.session) {
      errors.session = "Session is required";
    }
    
    if (showTimeInputs) {
      if (!formState.start_time) {
        errors.start_time = "Start time is required";
      }
      
      if (!formState.end_time) {
        errors.end_time = "End time is required";
      }
    }
    
    if (!formState.category_id) {
      errors.category_id = "Category is required";
    }
    
    if (showSubcategory && !formState.subcategory_id) {
      errors.subcategory_id = "Sub-category is required";
    }
    
    if (!formState.remark) {
      errors.remark = "Reason is required";
    }
    
    if (!formState.affectArea.length) {
      errors.affectArea = "At least one affected area must be selected";
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  const processSubmit = async () => {
    setActiveSubmission("submit");
    setFormState(prev => ({ ...prev, status: "2" }));

    try {
      console.log("Form State:", formState);
      const closureData = { site_id: siteId, ...formState, status: "2" };
      const result = await insertSiteClosureData(closureData, selectedFiles, siteCode);

      if (result.success) {
        toast({
          title: "Success",
          description: "Site closure submitted successfully.",
        });
        onSuccess?.(); // Call onSuccess callback if provided
        onOpenChange(false);
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
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const handleReset = () => {
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
    if (fileUploadRef.current && fileUploadRef.current.reset) {
      fileUploadRef.current.reset();
    }
  };

  useEffect(() => {
    if (!open) {
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
    }
  }, [open]);

  const isDateRangeValid = useDateRangeValidation(
    formState.close_start,
    formState.close_end,
    0
  );

  const { showTimeInputs, timeRange } = useSessionVisibility(formState.session);

  useEffect(() => {
    if (!isDateRangeValid) {
      setField("session", "");
    }
  }, [isDateRangeValid]);

  useEffect(() => {
    if (formState.session) {
      let updatedState = {
        ...formState,
        start_time: "",
        end_time: "",
      };
      
      // Check if timeRange exists and has the necessary properties
      if (timeRange) {
        if (formState.session === "3" && timeRange.isFixed) {
          // For full day with fixed time
          updatedState.start_time = timeRange.defaultStart || "08:00";
          updatedState.end_time = timeRange.defaultEnd || "18:00";
        } else if (timeRange.defaultStart && timeRange.defaultEnd) {
          // For other sessions with default times available
          updatedState.start_time = timeRange.defaultStart;
          updatedState.end_time = timeRange.defaultEnd;
        }
      }
      
      setFormState(updatedState);
    }
  }, [formState.session, timeRange]);

  useEffect(() => {
    if (formState.start_time && formState.end_time && formState.start_time > formState.end_time) {
      setFormState((prevState) => ({
        ...prevState,
        end_time: "",
      }));
    }
  }, [formState.start_time]);

  useEffect(() => {
    if (formState.start_time && formState.end_time && formState.end_time < formState.start_time) {
      setFormState((prevState) => ({
        ...prevState,
        start_time: "",
      }));
    }
  }, [formState.end_time]);

  useEffect(() => {
    setShowSubcategory(formState.category_id === "6");
    if (formState.category_id !== "6" && formState.subcategory_id) {
      setField("subcategory_id", "");
    }
  }, [formState.category_id]);

  const today = new Date().toISOString().split("T")[0];
  
  const maxStartDate = useMemo(() => {
    if (isSuperAdmin) return undefined;
    
    const today = new Date();
    const oneWeekFromToday = new Date();
    // Set to 6 days ahead, which becomes the 7th day (today + 6 more days)
    oneWeekFromToday.setDate(today.getDate() + 6);
    return oneWeekFromToday.toISOString().split("T")[0];
  }, [isSuperAdmin]);

  const filteredCategories = useMemo(() => {
    if (!closureCategories) return [];
    
    if (isSuperAdmin || isTP) return closureCategories;
    
    return closureCategories.filter(category => String(category.id) !== "1");
  }, [closureCategories, isTP, isSuperAdmin]);

  useEffect(() => {
    const selectedCategoryId = formState.category_id;
    if (selectedCategoryId === "1" && !(isTP || isSuperAdmin)) {
      setField("category_id", "");
      setField("subcategory_id", "");
    }
  }, [isTP, isSuperAdmin, formState.category_id]);

  const handleSubmitAsDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSubmission("draft");
    setFormState(prev => ({ ...prev, status: "1" }));
    
    setTimeout(() => {
      const formData = { site_id: siteId, ...formState, status: "1" };
      insertSiteClosureData(formData, selectedFiles, siteCode)
        .then((result) => {
          if (result.success) {
            toast({
              title: "Success",
              description: "Site closure saved as draft successfully."
            });
            onSuccess?.(); // Call onSuccess callback if provided
            onOpenChange(false);
          } else {
            throw new Error(result.error);
          }
        })
        .catch((error) => {
          console.error("Error saving draft:", error);
          toast({
            title: "Error",
            description: "An error occurred while saving the draft.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setActiveSubmission(null);
        });
    }, 0);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Site Closure Form</DialogTitle>
            <DialogDescription>Fill in the details for site closure.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="siteId">Site Code</Label>
              <Input id="siteId" value={siteCode} readOnly />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2 space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                  {!isSuperAdmin && (
                    <span className="text-gray-500 text-xs ml-2">(Max 1 week in advance)</span>
                  )}
                </Label>
                <DateInput
                  id="startDate"
                  value={formState.close_start}
                  onChange={(e) => handleDateChange("close_start", e.target.value)}
                  min={today}
                  max={isSuperAdmin ? (formState.close_end || undefined) : maxStartDate}
                  className={validationErrors.close_start ? "border-red-500" : ""}
                />
                {validationErrors.close_start && (
                  <p className="text-sm text-red-500">{validationErrors.close_start}</p>
                )}
              </div>
              <div className="w-1/2 space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <DateInput
                  id="endDate"
                  value={formState.close_end}
                  onChange={(e) => handleDateChange("close_end", e.target.value)}
                  min={formState.close_start || today}
                  max={undefined}
                  className={validationErrors.close_end ? "border-red-500" : ""}
                />
                {validationErrors.close_end && (
                  <p className="text-sm text-red-500">{validationErrors.close_end}</p>
                )}
              </div>
            </div>
            {isDateRangeValid && (
              <div className="space-y-2">
                <Label htmlFor="session">Session <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formState.session}
                  onValueChange={(value) => setField("session", value)}
                  className="flex flex-wrap gap-6"
                >
                  {closureSessions.map((session) => (
                    <div key={session.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(session.id)} id={`session-${session.id}`} />
                      <Label htmlFor={`session-${session.id}`} className="cursor-pointer">
                        {session.eng}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {validationErrors.session && (
                  <p className="text-sm text-red-500">{validationErrors.session}</p>
                )}
              </div>
            )}
            <div className="flex space-x-4">
              {showTimeInputs && (
                <>
                  <div className="w-1/2 space-y-2">
                    <Label htmlFor="startTime">
                      Start Time <span className="text-red-500">*</span> 
                      <span className="text-gray-500">(24hrs-format)</span>
                      {timeRange?.isFixed && (
                        <span className="text-blue-500 ml-2">(Fixed)</span>
                      )}
                    </Label>
                    <div className={timeRange?.isFixed ? "opacity-70 pointer-events-none" : ""}>
                      <TimeInput
                        id="startTime"
                        value={formState.start_time}
                        onChange={(val) => setField("start_time", val)}
                        min={timeRange?.min}
                        max={formState.end_time || timeRange?.max}
                        disallowSameAsValue={formState.end_time}
                        className={validationErrors.start_time ? "border-red-500" : ""}
                      />
                    </div>
                    {validationErrors.start_time && (
                      <p className="text-sm text-red-500">{validationErrors.start_time}</p>
                    )}
                  </div>
                  <div className="w-1/2 space-y-2">
                    <Label htmlFor="endTime">
                      End Time <span className="text-red-500">*</span> 
                      <span className="text-gray-500">(24hrs-format)</span>
                      {timeRange?.isFixed && (
                        <span className="text-blue-500 ml-2">(Fixed)</span>
                      )}
                    </Label>
                    <div className={timeRange?.isFixed ? "opacity-70 pointer-events-none" : ""}>
                      <TimeInput
                        id="endTime"
                        value={formState.end_time}
                        onChange={(val) => setField("end_time", val)}
                        min={formState.start_time || timeRange?.min}
                        max={timeRange?.max}
                        disallowSameAsValue={formState.start_time}
                        className={validationErrors.end_time ? "border-red-500" : ""}
                      />
                    </div>
                    {validationErrors.end_time && (
                      <p className="text-sm text-red-500">{validationErrors.end_time}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Closure Category <span className="text-red-500">*</span></Label>
              <Select
                name="category"
                value={formState.category_id}
                onValueChange={(value) => setField("category_id", value)}
                disabled={isLoadingCategories}
              >
                <SelectTrigger className={validationErrors.category_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category_id && (
                <p className="text-sm text-red-500">{validationErrors.category_id}</p>
              )}
            </div>
            {showSubcategory && (
              <div className="space-y-2">
                <Label htmlFor="subCategory">Closure Sub-Category <span className="text-red-500">*</span></Label>
                <Select
                  name="subCategory"
                  value={formState.subcategory_id}
                  onValueChange={(value) => setField("subcategory_id", value)}
                  disabled={isLoadingSubCategories}
                >
                  <SelectTrigger className={validationErrors.subcategory_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {closureSubCategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                        {subCategory.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.subcategory_id && (
                  <p className="text-sm text-red-500">{validationErrors.subcategory_id}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="affectArea">Closure Affect Area <span className="text-red-500">*</span></Label>
              <SelectMany
                options={closureAffectAreas.map((area) => ({
                  id: String(area.id),
                  label: area.eng,
                }))}
                value={formState.affectArea}
                onChange={(value) => setField("affectArea", value)}
                placeholder="Select affected areas"
                disabled={isLoadingAffectAreas}
                className={validationErrors.affectArea ? "border-red-500" : ""}
              />
              {validationErrors.affectArea && (
                <p className="text-sm text-red-500">{validationErrors.affectArea}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason <span className="text-red-500">*</span></Label>
              <Textarea
                id="reason"
                value={formState.remark}
                onChange={(e) => setField("remark", e.target.value)}
                className={validationErrors.remark ? "border-red-500" : ""}
              />
              {validationErrors.remark && (
                <p className="text-sm text-red-500">{validationErrors.remark}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <FileUpload
                ref={fileUploadRef}
                maxFiles={6}
                acceptedFileTypes=".pdf"
                maxSizeInMB={2}
                buttonText="Choose File"
                onFilesSelected={(files) => setSelectedFiles(files)}
                multiple={true}
              />
            </div>
            <DialogFooter className="flex justify-between sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Clear form
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSubmitAsDraft}
                disabled={isSubmitting}
              >
                {isSubmitting && activeSubmission === "draft" ? "Saving..." : "Save as Draft"}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && activeSubmission === "submit" ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirm Submission"
        description={
          <div className="space-y-2">
            <p>Are you sure you want to submit this site closure request?</p>
            <p>Once submitted, you cannot edit the request.</p>
            <p className="text-sm text-muted-foreground">
              Tip: You can save as draft first if you're not ready to submit.
            </p>
          </div>
        }
        cancelText="Cancel"
        confirmText="Yes, Submit"
        onConfirm={processSubmit}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
};

export default SiteClosureForm;
