import React, { useEffect, useMemo, useRef } from "react";
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
import { useSiteCode } from "../hook/use-site-code";
import { SelectMany } from "@/components/ui/SelectMany";
import { fetchClosureCategories, fetchClosureSubCategories, fetchClosureAffectAreas, fetchClosureSession } from "../hook/use-siteclosure";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateInput } from "../../ui/date-input";
import { useDateRangeValidation } from "@/hooks/useDateRangeValidation";
import { useSessionVisibility } from "../hook/use-session-visibility";
import TimeInput from "../../ui/TimePicker";
import { useUserGroup } from "@/hooks/use-user-group";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { useSiteClosureForm } from "../hook/use-site-closure-form";
import { toast } from "@/hooks/use-toast";

interface SiteClosureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSuccess?: () => void;
  editData?: any;
  clearEditData?: () => void;
}

const SiteClosureForm: React.FC<SiteClosureFormProps> = ({
  open,
  onOpenChange,
  siteId,
  onSuccess,
  editData,
  clearEditData,
}) => {
  const { siteCode } = useSiteCode(siteId);
  const { isTP, isSuperAdmin } = useUserGroup();
  const fileUploadRef = useRef<any>(null);

  // Pass necessary validation states to the form hook
  const {
    formState,
    setFormState,
    setField,
    validationErrors,
    isSubmitting,
    activeSubmission,
    selectedFiles,
    existingAttachments,
    showConfirmDialog,
    handleDateChange,
    resetForm,
    handleSubmitAsDraft,
    handleFormSubmit,
    processSubmit,
    handleAttachmentsChange,
    handleExistingAttachmentsChange,
    resetCleanupFlags,
    setShowConfirmDialog,
    validateForm,
    cleanupFormState,
  } = useSiteClosureForm(siteId, siteCode, editData, isSuperAdmin, onSuccess, onOpenChange);

  // Track whether to show subcategory field based on category selection
  const [showSubcategory, setShowSubcategory] = React.useState(false);

  // Data queries for form fields
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

  // Format existing attachments for FileUpload component
  const formattedExistingFiles = useMemo(() => {
    if (!existingAttachments || existingAttachments.length === 0) return null;

    return existingAttachments.map(path => {
      const fileName = path.split('/').pop() || 'File';
      const fullUrl = path.startsWith('http') ? path : `${SUPABASE_URL}${path}`;
      return {
        url: fullUrl,
        name: fileName
      };
    });
  }, [existingAttachments]);

  // Date validation helpers
  const isDateRangeValid = useDateRangeValidation(
    formState.close_start,
    formState.close_end,
    0
  );

  // Show time inputs depending on selected session
  const { showTimeInputs, timeRange } = useSessionVisibility(formState.session);

  // Handle file upload component reset
  const handleReset = () => {
    resetForm();
    if (fileUploadRef.current && fileUploadRef.current.reset) {
      fileUploadRef.current.reset();
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetCleanupFlags();
      cleanupFormState();
    }
  }, [open, resetCleanupFlags, cleanupFormState]);

  // Clear edit data when dialog closes
  useEffect(() => {
    if (!open && clearEditData) {
      clearEditData();
    }
  }, [open, clearEditData]);

  // Reset session when date range is invalid
  useEffect(() => {
    if (!isDateRangeValid) {
      setField("session", "");
    }
  }, [isDateRangeValid, setField]);

  // Update time fields based on session selection
  useEffect(() => {
    if (formState.session) {
      let updatedState = {
        ...formState,
        start_time: "",
        end_time: "",
      };

      if (timeRange) {
        if (formState.session === "3" && timeRange.isFixed) {
          updatedState.start_time = timeRange.defaultStart || "08:00";
          updatedState.end_time = timeRange.defaultEnd || "18:00";
        } else if (timeRange.defaultStart && timeRange.defaultEnd) {
          updatedState.start_time = timeRange.defaultStart;
          updatedState.end_time = timeRange.defaultEnd;
        }
      }

      setField("start_time", updatedState.start_time);
      setField("end_time", updatedState.end_time);
    }
  }, [formState.session, timeRange, setField]);

  // Update subcategory visibility based on category selection
  useEffect(() => {
    const isSpecialCategory = formState.category_id === "6";
    setShowSubcategory(isSpecialCategory);
    if (!isSpecialCategory && formState.subcategory_id) {
      setField("subcategory_id", "");
    }
  }, [formState.category_id, setField]);

  // Validate time logic
  useEffect(() => {
    if (formState.start_time && formState.end_time && formState.start_time > formState.end_time) {
      setField("end_time", "");
    }
  }, [formState.start_time, formState.end_time, setField]);

  useEffect(() => {
    if (formState.start_time && formState.end_time && formState.end_time < formState.start_time) {
      setField("start_time", "");
    }
  }, [formState.end_time, formState.start_time, setField]);

  // Filter categories based on user permissions
  const filteredCategories = useMemo(() => {
    if (!closureCategories) return [];

    if (isSuperAdmin || isTP) return closureCategories;

    return closureCategories.filter(category => String(category.id) !== "1");
  }, [closureCategories, isTP, isSuperAdmin]);

  // Restrict category 1 to TP/SuperAdmin
  useEffect(() => {
    const selectedCategoryId = formState.category_id;
    if (selectedCategoryId === "1" && !(isTP || isSuperAdmin)) {
      setField("category_id", "");
      setField("subcategory_id", "");
    }
  }, [isTP, isSuperAdmin, formState.category_id, setField]);

  const today = new Date().toISOString().split("T")[0];

  const maxStartDate = useMemo(() => {
    if (isSuperAdmin) return undefined;

    const today = new Date();
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 6);
    return oneWeekFromToday.toISOString().split("T")[0];
  }, [isSuperAdmin]);

  // Update handleFormSubmit to include context information in validation
  const handleFormValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Modify validation context based on current state
    const isValid = validateForm({
      showSubcategory,
      isDateRangeValid,
      showTimeInputs
    });

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            console.log("Dialog closing - cleaning up state");
            resetCleanupFlags();
            cleanupFormState();
            if (fileUploadRef.current && fileUploadRef.current.reset) {
              fileUploadRef.current.reset();
            }
            if (clearEditData) {
              clearEditData();
            }
          }
          onOpenChange(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Draft Closure Request" : "Site Closure Form"}
            </DialogTitle>
            <DialogDescription>
              {editData
                ? "Edit your draft closure request details."
                : "Fill in the details for site closure."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormValidationSubmit} className="space-y-4" noValidate>
            {/* Site Code */}
            <div className="space-y-2">
              <Label htmlFor="siteId">Site Code</Label>
              <Input id="siteId" value={siteCode} readOnly />
            </div>

            {/* Date Range Fields */}
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

            {/* Session Selection */}
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

            {/* Time Selection Fields */}
            {showTimeInputs && (
              <div className="flex space-x-4">
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
              </div>
            )}

            {/* Category Selection */}
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

            {/* Subcategory Selection (conditional) */}
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

            {/* Affected Areas */}
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

            {/* Reason */}
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

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <FileUpload
                ref={fileUploadRef}
                maxFiles={6}
                acceptedFileTypes=".pdf"
                maxSizeInMB={2}
                buttonText="Choose File"
                onFilesSelected={handleAttachmentsChange}
                multiple={true}
                existingFiles={formattedExistingFiles}
                onExistingFilesChange={(files) => handleExistingAttachmentsChange(files, SUPABASE_URL)}
              />
            </div>

            {/* Form Buttons */}
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
                {isSubmitting && activeSubmission === "draft" ?
                  (editData?.id ? "Updating..." : "Saving...") :
                  (editData?.id ? "Update Draft" : "Save as Draft")}
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

      {/* Confirmation Dialog */}
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
