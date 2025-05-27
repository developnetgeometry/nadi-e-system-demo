import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Download,
  Train
} from "lucide-react";
import { TotalNadiCard } from "@/components/reports/component/training/TotalNadiCard";
import { NumberEmployeeCard } from "@/components/reports/component/training/NumberEmployeeCard";
import { UpscalingTrainingCard } from "@/components/reports/component/training/UpscalingTrainingCard";
import { RefreshTrainingCard } from "@/components/reports/component/training/RefreshTrainingCard";
import { ModularReportFilters } from "@/components/reports/filters";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useTrainingData } from "@/hooks/report/use-training-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import { T } from "vitest/dist/chunks/reporters.d.DG9VKi4m.js";
import { TrainingReportDownloadButton } from "@/components/reports/pdftemplate/components/TrainingReportDownloadButton";
import { useDuspLogo, useMcmcLogo } from "@/hooks/use-brand";

// Define month options
const monthOptions = [
  { id: 1, label: "January" },
  { id: 2, label: "February" },
  { id: 3, label: "March" },
  { id: 4, label: "April" },
  { id: 5, label: "May" },
  { id: 6, label: "June" },
  { id: 7, label: "July" },
  { id: 8, label: "August" },
  { id: 9, label: "September" },
  { id: 10, label: "October" },
  { id: 11, label: "November" },
  { id: 12, label: "December" },
];

// Define year options (current year plus 3 years back)
const currentYear = new Date().getFullYear();
const yearOptions = [
  { id: currentYear, label: currentYear.toString() },
  { id: currentYear - 1, label: (currentYear - 1).toString() },
  { id: currentYear - 2, label: (currentYear - 2).toString() },
  { id: currentYear - 3, label: (currentYear - 3).toString() },
];


const ReportTraining = () => {
  // Filter states

  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null);

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);


  const { phases, dusps, tpProviders, loading: filtersLoading } = useReportFilters();

  // Fetch training data based on filters 
  const {
    trainingData,
    loading: trainingLoading
  } = useTrainingData(duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter);

  // Get MCMC and DUSP logos for the PDF report
  const mcmcLogo = useMcmcLogo();
  const duspLogo = useDuspLogo();

  // Handle PDF generation events
  const handleGenerationStart = () => {
    setIsGeneratingPdf(true);
  };

  const handleGenerationComplete = (success: boolean) => {
    setIsGeneratingPdf(false);
    if (!success) {
      console.error("Failed to generate PDF");
      // Could add toast notification here
    }
  };

  return (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Training</h1>
            <p className="text-gray-500 mt-1">
              View and analyze NADI staff training data across all sites
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrainingReportDownloadButton

              duspLabel={duspFilter.length === 1
                ? dusps.find(d => d.id === duspFilter[0])?.name || ""
                : duspFilter.length > 1
                  ? `${duspFilter.length} DUSPs selected`
                  : ""}
              phaseLabel={phaseFilter !== null
                ? phases.find(p => p.id === phaseFilter)?.name || "All Phases"
                : "All Phases"}
              periodType={monthFilter ? "MONTH / YEAR" : "All Time"}
              periodValue={monthFilter ? `${monthFilter || ""} / ${yearFilter || ""}` : "All Records"}
              duspFilter={duspFilter}
              tpFilter={tpFilter}
              phaseFilter={phaseFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              mcmcLogo={mcmcLogo}
              duspLogo={duspLogo}
              onGenerationStart={handleGenerationStart}
              onGenerationComplete={handleGenerationComplete}

            />
          </div>
        </div>

        <ModularReportFilters
          // Show all filters for site management report
          showFilters={{
            dusp: true,
            phase: true,
            nadi: false,
            tp: true,
            date: true
          }}

          // Filter state
          duspFilter={duspFilter}
          setDuspFilter={setDuspFilter}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          tpFilter={tpFilter}
          setTpFilter={setTpFilter}
          monthFilter={monthFilter}
          setMonthFilter={setMonthFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}

          // Filter data
          dusps={dusps}
          phases={phases}
          tpOptions={tpProviders}
          monthOptions={monthOptions}
          yearOptions={yearOptions}

          // Loading state
          isLoading={filtersLoading}
        />

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TotalNadiCard />

          {/* Number of Employees Card */}
          <NumberEmployeeCard />

          {/* Upscaling Training Card */}
          <UpscalingTrainingCard />

          {/* Refresh Training Card */}
          <RefreshTrainingCard />

        </div>
      </div>
    </div>
  );
};

export default ReportTraining;
