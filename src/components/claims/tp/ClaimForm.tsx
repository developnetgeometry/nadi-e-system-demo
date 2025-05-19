import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMultistepFormClaim } from "../hook/useMultipleFormClaim";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ClaimDateForm } from "../form/ClaimDateForm";
import { ClaimApplicationForm } from "../form/ClaimApplicationForm";
import { ClaimRequestForm } from "../form/ClaimRequestForm";
import { ClaimReportGenerateForm } from "../form/ClaimReportGenerateForm";
import { insertClaimData } from "./hooks/insert-claim";


type ItemData = {
  id: number;
  name: string;
  need_support_doc: boolean;
  need_summary_report: boolean;
}

type CategoryData = {
  id: number;
  name: string;
  item_ids: ItemData[];
}

type ReportData = {
  category_ids: CategoryData[];
  report_file: Uint8Array | null; // New state for the report
  status_item: boolean;
}

type FormData = {
  phase_id: number;
  year: number;
  quarter: number;
  month: number;
  ref_no: string;
  tp_dusp_id: string;
  site_profile_ids: number[];
  tp_name: string; //additional
  dusp_name: string; //additional

  category_ids: CategoryData[];

  reports: ReportData[]; // New state for the report

};


const INITIAL_DATA: FormData = {
  phase_id: null,
  year: new Date().getFullYear(),
  quarter: null,
  month: null,
  ref_no: "",
  tp_dusp_id: null,
  site_profile_ids: [],
  tp_name: "",
  dusp_name: "",

  category_ids: [],

  reports: [], // New state for the report
};

const ClaimFormDialog = ({
  isOpen,
  onClose,
  duspTpData,
  organizationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  duspTpData: {
    id: string;
    type: string;
    name: string;
    parent_id: {
      id: string;
      name: string;
      type: string;
    }
  }
  organizationId: string;
}) => {
  const [data, setData] = useState({
    ...INITIAL_DATA,
    tp_name: duspTpData.name || "",
    dusp_name: duspTpData.parent_id.name || "",
    tp_dusp_id: organizationId || "",
  });

  const [loading, setLoading] = useState(false); // Add loading state
  const { toast } = useToast();

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  const showValidationError = (description: string) => {
    toast({
      title: "Validation Error",
      description,
      variant: "destructive",
    });
  };

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, reset } = useMultistepFormClaim([
    <ClaimDateForm  {...data} updateFields={updateFields} />,
    <ClaimApplicationForm {...data} updateFields={updateFields} />,
    <ClaimRequestForm  {...data} updateFields={updateFields} />,
    <ClaimReportGenerateForm {...data} updateFields={updateFields} />,
  ]);

  const steps = [
    { label: "Initialization", validate: () => data.year && data.month },
    { label: "NADI Sites", validate: () => data.phase_id && data.site_profile_ids.length > 0 },
    { label: "Claim Application", validate: () => data.category_ids.length > 0 },
    { label: "Report Generator", validate: () => data.reports.length > 0 },

  ];

  function isStepComplete(index: number) {
    return steps[index].validate();
  }

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      if (!data.year) { showValidationError("Year is required"); return; }
      if (!data.month) { showValidationError("Month is required"); return; }
      if (!data.tp_dusp_id) { showValidationError("TP DUSP ID is required"); return; }
    }

    if (currentStepIndex === 1) {
      if (!data.phase_id) { showValidationError("Phase is required"); return; }
      if (data.site_profile_ids.length === 0) { showValidationError("Site Profile is required"); return; }
    }

    if (currentStepIndex === 2) {
      if (data.category_ids.length === 0) { showValidationError("Item is required"); return; }
    }

    if (currentStepIndex === 3) {
      if (data.reports.length === 0) { showValidationError("Report file is required"); return; }
    }

    if (!isLastStep) {
      next();
    } else {
      try {
        setLoading(true); // Start loading
        await insertClaimData(data); // Call the insertClaimData function
        toast({
          title: "Success",
          description: "The new claim has been drafted.",
          variant: "default",
        });
        setData(INITIAL_DATA);
        reset();
        onClose();
      } catch (error: any) {
        console.error("Error saving data:", error);
        toast({
          title: "Error",
          description: "Failed to save data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };


  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setData(INITIAL_DATA); // Reset the form data
        reset(); // Reset the multistep form (if applicable)
        onClose(); // Call the original onClose function
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
            <span className="ml-3 text-lg font-semibold">Registering...</span>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Claim</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            Fill in the details for the new claim
          </DialogDescription>
          <div className="flex bg-muted rounded-lg overflow-hidden">
            {steps.map((step, index) => {
              const isActive = currentStepIndex === index;
              const isCompleted = isStepComplete(index);

              return (
                <div
                  key={index}
                  className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 text-sm transition-all 
                  ${isActive ? "bg-white font-semibold text-foreground shadow-sm dark:text-black" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </DialogHeader>
        <form onSubmit={(e: FormEvent) => e.preventDefault()}>
          <div >{step}</div>
          <DialogFooter className="flex justify-between w-full mt-4">
            {!isFirstStep ? (
              <Button type="button" onClick={back} variant="outline" disabled={loading}>
                Back
              </Button>
            ) : (
              <div /> // Placeholder to maintain spacing
            )}

            <Button
              type="button"
              onClick={handleNext}
            >
              {isLastStep ? "Create Draft Claim" : "Next"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimFormDialog;