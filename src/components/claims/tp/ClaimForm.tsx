import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useMultistepFormClaim } from "../hook/useMultipleFormClaim";
import { ClaimDateForm } from "../form/ClaimDateForm";
import { ClaimApplicationForm } from "../form/ClaimApplicationForm";
import { ClaimRequestForm } from "../form/ClaimRequestForm";
import { ClaimReportGenerateForm } from "../form/ClaimReportGenerateForm";
import { insertClaimData } from "./hooks/insert-claim";
import { useNavigate } from "react-router-dom";
import { useDuspTpData } from "../hook/use-claim-data";

type ItemData = {
  id: number;
  name: string;
  need_support_doc: boolean;
  need_summary_report: boolean;
};

type CategoryData = {
  id: number;
  name: string;
  item_ids: ItemData[];
};

type ReportData = {
  category_ids: CategoryData[];
  report_file: Uint8Array | null; // New state for the report
  status_item: boolean;
};

type FormData = {
  phase_id: number;
  year: number;
  quarter: number;
  month: number;
  ref_no: string;
  tp_dusp_id: string;
  site_profile_ids: number[];
  tp_name: string; // additional
  dusp_name: string; // additional

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

const ClaimFormPage = () => {

  const { duspTpData, isLoading, error } = useDuspTpData();
  const [data, setData] = useState({
    ...INITIAL_DATA,
    tp_name: "", // Initialize as empty
    dusp_name: "", // Initialize as empty
    tp_dusp_id: "", // Initialize as null
  });

  const [loading, setLoading] = useState(false); // Add loading state
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (duspTpData) {
      setData((prev) => ({
        ...prev,
        tp_name: duspTpData.name,
        dusp_name: duspTpData.parent_id?.name,
        tp_dusp_id: duspTpData.id,
      }));
    }
  }, [duspTpData]);

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
    <ClaimDateForm {...data} updateFields={updateFields} />,
    <ClaimRequestForm {...data} updateFields={updateFields} />,
    <ClaimApplicationForm {...data} updateFields={updateFields} />,
    <ClaimReportGenerateForm {...data} updateFields={updateFields} />,
  ]);

  const steps = [
    { label: "Initialization", validate: () => data.year && data.month },
    { label: "Claim Application", validate: () => data.category_ids.length > 0 },
    { label: "NADI Sites", validate: () => data.phase_id && data.site_profile_ids.length > 0 },
    { label: "Report Generator", validate: () => data.reports.length > 0 },
  ];

  function isStepComplete(index: number) {
    return steps[index].validate();
  }

  const handleNext = async () => {
    if (currentStepIndex === 0) {
      if (!data.year) {
        showValidationError("Year is required");
        return;
      }
      if (!data.month) {
        showValidationError("Month is required");
        return;
      }
      if (!data.tp_dusp_id) {
        showValidationError("TP DUSP ID is required");
        return;
      }
    }

    if (currentStepIndex === 1) {
      if (data.category_ids.length === 0) {
        showValidationError("Item is required");
        return;
      }
    }

    if (currentStepIndex === 2) {
      if (!data.phase_id) {
        showValidationError("Phase is required");
        return;
      }
      if (data.site_profile_ids.length === 0) {
        showValidationError("Site Profile is required");
        return;
      }
    }

    if (currentStepIndex === 3) {
      if (data.reports.length === 0) {
        showValidationError("Report file is required");
        return;
      }
    }

    if (!isLastStep) {
      next();
    } else {
      try {
        setLoading(true); // Start loading
        // console.log("Data to be saved:", data);
        await insertClaimData(data); // Call the insertClaimData function
        toast({
          title: "Success",
          description: "The new claim has been drafted.",
          variant: "default",
        });
        setData(INITIAL_DATA);
        reset();
        navigate("/claim/register");
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
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Claim Registration</h1>
      <Card>
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
            <span className="ml-3 text-lg font-semibold">Registering...</span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Claim</CardTitle>
          <p className="text-muted-foreground">Fill in the details for the new claim</p>
        </CardHeader>
        <CardContent>
          <div className="flex bg-muted rounded-lg overflow-hidden mt-4">
            {steps.map((step, index) => {
              const isActive = currentStepIndex === index;
              const isCompleted = isStepComplete(index);

              return (
                <div
                  key={index}
                  className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 text-sm transition-all border rounded-md
              ${isActive ? "bg-white font-semibold text-foreground shadow-sm dark:text-black" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
          <form onSubmit={(e: FormEvent) => e.preventDefault()} className="mt-4">
            <div>{step}</div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between w-full mt-4">
          {!isFirstStep ? (
            <Button type="button" onClick={back} variant="outline" disabled={loading}>
              Back
            </Button>
          ) : (
            <div /> // Placeholder to maintain spacing
          )}

          <Button type="button" onClick={handleNext}>
            {isLastStep ? "Create Draft Claim" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClaimFormPage;