import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Download
} from "lucide-react";
import { TotalNadiCard } from "@/components/reports/component/training/TotalNadiCard";
import { NumberEmployeeCard } from "@/components/reports/component/training/NumberEmployeeCard";
import { UpscalingTrainingCard } from "@/components/reports/component/training/UpscalingTrainingCard";
import { RefreshTrainingCard } from "@/components/reports/component/training/RefreshTrainingCard";
import { ModularReportFilters } from "@/components/reports/filters";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useTrainingData } from "@/hooks/report/use-training-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";

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


  const { phases, dusps, tpProviders, loading: filtersLoading } = useReportFilters();

  // Fetch training data based on filters 
  const { 
    trainingData, 
    loading: trainingLoading 
  } = useTrainingData(duspFilter,phaseFilter,monthFilter,yearFilter,tpFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Training</h1>
            <p className="text-gray-500 mt-1">View and analyze NADI staff training data across all sites</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button> */}
            <Button variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
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
          {/* Total NADI Card */}
          <TotalNadiCard />

          {/* Number of Employees Card */}
          <NumberEmployeeCard />

          {/* Upscaling Training Card */}
          <UpscalingTrainingCard />

          {/* Refresh Training Card */}
          <RefreshTrainingCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportTraining;