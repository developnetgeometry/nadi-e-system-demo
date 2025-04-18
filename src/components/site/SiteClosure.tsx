import React, { useState, useEffect } from "react";
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
import { useInsertSiteClosureData } from "./hook/use-siteclosure-data";
import { useSiteCode } from "./hook/use-site-code";

interface SiteClosureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  siteDetails: string;
  location: string;
}

// ==================================================================================

const closureCategories = [
  { value: "permanent", label: "Permanent Closure" },
  { value: "temporary", label: "Temporary Closure" },
];

const closureSubCategories = [
  { value: "maintenance", label: "Maintenance" },
  { value: "naturalDisaster", label: "Natural Disaster" },
  { value: "other", label: "Other" },
];

const closureAffectAreas = [
  { value: "zone1", label: "Zone 1" },
  { value: "zone2", label: "Zone 2" },
  { value: "zone3", label: "Zone 3" },
];

// ==================================================================================

const SiteClosureForm: React.FC<SiteClosureFormProps> = ({
  open,
  onOpenChange,
  siteId,
  siteDetails,
  location,
}) => {
  const { toast } = useToast();
  const { insertSiteClosureData, loading: isSubmitting } = useInsertSiteClosureData();
  const { siteCode } = useSiteCode(siteId); // Use the hook here
  const [formState, setFormState] = useState({
    reason: "",
    closureDate: "",
    category: "",
    subCategory: "",
    affectArea: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const setField = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const closureData = { site_id: siteId, ...formState };
      const result = await insertSiteClosureData(closureData, selectedFile, siteCode); // Pass siteCode

      if (result.success) {
        toast({
          title: "Success",
          description: "Site closure submitted successfully.",
        });
        onOpenChange(false); // Close the dialog
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
    }
  };

  useEffect(() => {
    if (!open) {
      setFormState({
        reason: "",
        closureDate: "",
        category: "",
        subCategory: "",
        affectArea: "",
      });
      setSelectedFile(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Site Closure Form</DialogTitle>
          <DialogDescription>Fill in the details for site closure.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteId">Site ID</Label>
            <Input id="siteId" value={siteId} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDetails">Site Details</Label>
            <Input id="siteDetails" value={siteDetails} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Closure</Label>
            <Textarea
              id="reason"
              value={formState.reason}
              onChange={(e) => setField("reason", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closureDate">Closure Date</Label>
            <Input
              id="closureDate"
              type="date"
              value={formState.closureDate}
              onChange={(e) => setField("closureDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Closure Category</Label>
            <Select
              name="category"
              value={formState.category}
              onValueChange={(value) => setField("category", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {closureCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCategory">Closure Sub-Category</Label>
            <Select
              name="subCategory"
              value={formState.subCategory}
              onValueChange={(value) => setField("subCategory", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sub-category" />
              </SelectTrigger>
              <SelectContent>
                {closureSubCategories.map((subCategory) => (
                  <SelectItem key={subCategory.value} value={subCategory.value}>
                    {subCategory.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="affectArea">Closure Affect Area</Label>
            <Select
              name="affectArea"
              value={formState.affectArea}
              onValueChange={(value) => setField("affectArea", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an affected area" />
              </SelectTrigger>
              <SelectContent>
                {closureAffectAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteClosureForm;
