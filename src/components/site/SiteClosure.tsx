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
import { useInsertSiteClosureData } from "./hook/submit-siteclosure-data";
import { useSiteCode } from "./hook/use-site-code";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import { SelectMany } from "@/components/ui/SelectMany";
import { fetchClosureCategories, fetchClosureSubCategories, fetchClosureAffectAreas, fetchClosureSession } from "./hook/use-siteclosure";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateInput } from "../ui/date-input";
import { useDateRangeValidation } from "@/hooks/useDateRangeValidation";
import { useSessionVisibility } from "./hook/use-session-visibility";
import TimeInput from "../ui/TimePicker";
import { useUserGroup } from "@/hooks/use-user-group";

interface SiteClosureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  siteDetails: string;
  location: string;
}

const SiteClosureForm: React.FC<SiteClosureFormProps> = ({
  open,
  onOpenChange,
  siteId,
  siteDetails,
  location,
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
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Form State:", formState);
      const closureData = { site_id: siteId, ...formState };
      const result = await insertSiteClosureData(closureData, selectedFile, siteCode);

      if (result.success) {
        toast({
          title: "Success",
          description: formState.status === "1"
            ? "Site closure saved as draft successfully."
            : "Site closure submitted successfully.",
        });
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
      status: "2", // Reset status to default 2
    });
    setSelectedFile(null);
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
        status: "2", // Reset status to default 2
      });
      setSelectedFile(null);
    }
  }, [open]);

  const isDateRangeValid = useDateRangeValidation(
    formState.close_start,
    formState.close_end,
    0
  );

  useEffect(() => {
    if (!isDateRangeValid) {
      setField("session", "");
    }
  }, [isDateRangeValid]);

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      start_time: "",
      end_time: "",
    }));
  }, [formState.session]);

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

  const { showTimeInputs, timeRange } = useSessionVisibility(formState.session);

  const filteredCategories = useMemo(() => {
    if (!closureCategories) return [];
    
    // Both Super Admin and TP users can see all categories
    if (isSuperAdmin || isTP) return closureCategories;
    
    // For other users, filter out category with ID 1
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
    setFormState(prev => ({ ...prev, status: "1" })); // Set status to draft (1)
    
    // For draft, bypass validation by submitting directly
    setTimeout(() => {
      // Create a hidden form and submit it to bypass validation
      const formData = { site_id: siteId, ...formState, status: "1" };
      insertSiteClosureData(formData, selectedFile, siteCode)
        .then((result) => {
          if (result.success) {
            toast({
              title: "Success",
              description: "Site closure saved as draft successfully."
            });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Site Closure Form</DialogTitle>
          <DialogDescription>Fill in the details for site closure.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteId">Site Code</Label>
            <Input id="siteId" value={siteCode} readOnly />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2 space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DateInput
                id="startDate"
                value={formState.close_start}
                onChange={(e) => setField("close_start", e.target.value)}
                min={today}
                max={formState.close_end || undefined}
                required
              />
            </div>
            <div className="w-1/2 space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DateInput
                id="endDate"
                value={formState.close_end}
                onChange={(e) => setField("close_end", e.target.value)}
                min={formState.close_start || today}
                required
              />
            </div>
          </div>
          {isDateRangeValid && (
            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
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
            </div>
          )}
          <div className="flex space-x-4">
            {showTimeInputs && (
              <>
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="startTime">Start Time <span className="text-gray-500">(24hrs-format)</span></Label>
                  <TimeInput
                    id="startTime"
                    value={formState.start_time}
                    onChange={(val) => setField("start_time", val)}
                    min={timeRange?.min}
                    max={formState.end_time || timeRange?.max}
                    disallowSameAsValue={formState.end_time}
                    required
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="endTime">End Time <span className="text-gray-500">(24hrs-format)</span></Label>
                  <TimeInput
                    id="endTime"
                    value={formState.end_time}
                    onChange={(val) => setField("end_time", val)}
                    min={formState.start_time || timeRange?.min}
                    max={timeRange?.max}
                    disallowSameAsValue={formState.start_time}
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Closure Category</Label>
            <Select
              name="category"
              value={formState.category_id}
              onValueChange={(value) => setField("category_id", value)}
              required
              disabled={isLoadingCategories}
            >
              <SelectTrigger>
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
          </div>
          {showSubcategory && (
            <div className="space-y-2">
              <Label htmlFor="subCategory">Closure Sub-Category</Label>
              <Select
                name="subCategory"
                value={formState.subcategory_id}
                onValueChange={(value) => setField("subcategory_id", value)}
                required
                disabled={isLoadingSubCategories}
              >
                <SelectTrigger>
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
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="affectArea">Closure Affect Area</Label>
            <SelectMany
              options={closureAffectAreas.map((area) => ({
                id: String(area.id),
                label: area.eng,
              }))}
              value={formState.affectArea}
              onChange={(value) => setField("affectArea", value)}
              placeholder="Select affected areas"
              disabled={isLoadingAffectAreas}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formState.remark}
              onChange={(e) => setField("remark", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <FileUpload
              maxFiles={1}
              acceptedFileTypes=".pdf"
              maxSizeInMB={2}
              buttonText="Choose File"
              onFilesSelected={(files) => setSelectedFile(files[0])}
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
  );
};

export default SiteClosureForm;
