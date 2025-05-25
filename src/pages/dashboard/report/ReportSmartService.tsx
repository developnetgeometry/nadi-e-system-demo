import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw, Building, Calendar, Download, Upload, ChevronsUpDown, Check, Users, CalendarDays, BookOpen } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModularReportFilters } from "@/components/reports/filters";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import ReportSmartServiceByPhase from "./Tab/ReportSmartService-ByPhase";
import ReportSmartServicePillarByProgramme from "./Tab/ReportSmartService-PillarByProgramme";
import ReportSmartServiceByMonth from "./Tab/ReportSmartService-ByMonth";

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

// Dummy data for programs and participants
const singleNadiData = [
  { category: 'Entrepreneur', programs: 6, participants: 94 },
  { category: 'Lifelong Learning', programs: 8, participants: 31 },
  { category: 'Wellbeing', programs: 6, participants: 61 },
  { category: 'Awareness', programs: 3, participants: 76 },
  { category: 'Govt Initiative', programs: 9, participants: 57 },
];

const ReportSmartService = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("phase");
  // Filter states
  const [duspFilter, setDuspFilter] = useState<(string | number)[]>([]);
  const [phaseFilter, setPhaseFilter] = useState<string | number | null>(null);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [tpFilter, setTpFilter] = useState<(string | number)[]>([]);
  const [pillarFilter, setPillarFilter] = useState<(string | number)[]>([]);
  const [programFilter, setprogramFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null)

  // Use unified report filter data
  const {
    dusps,
    phases,
    nadiSites,
    tpProviders,
    pillarOptions,
    programOptions,
    loading: filtersLoading,
  } = useReportFilters();

  const resetFilters = () => {
    setDuspFilter([]);
    setPhaseFilter(null);
    setNadiFilter([]);
    setTpFilter([]);
    setMonthFilter(null);
    setYearFilter(null);
    setPillarFilter([]);
    setprogramFilter([]);
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Smart Services</h1>
            <p className="text-gray-500 mt-1">View and analyze smart service programs and participation data</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button> */}
            {activeTab === "phase" ? (
              <Button
                variant="secondary"
                className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Phase
              </Button>
            ) : activeTab === "pillar" ? (
              <Button
                variant="secondary"
                className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Pillar
              </Button>
            ) : activeTab === "month" ? (
              <Button
                variant="secondary"
                className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Monthly
              </Button>
            ): null}
          </div>
        </div>

        <Tabs defaultValue="phase" value={activeTab} onValueChange={(tab) => { resetFilters(); setActiveTab(tab); }} className="w-full">
          <TabsList className="grid w-[550px] grid-cols-3">
            <TabsTrigger value="phase">By Phase</TabsTrigger>
            <TabsTrigger value="pillar">Pillar by Programme</TabsTrigger>
            <TabsTrigger value="month">By Month</TabsTrigger>
          </TabsList>

          <ModularReportFilters
            showFilters={{
              dusp: true,
              phase: activeTab === "phase",
              nadi: activeTab === "pillar" || activeTab === "month",
              tp: true,
              date: true,
              pillar: activeTab === "pillar",
              program: activeTab === "pillar",

            }}

            // Filter state
            duspFilter={duspFilter}
            setDuspFilter={setDuspFilter}
            phaseFilter={phaseFilter}
            setPhaseFilter={setPhaseFilter}
            nadiFilter={nadiFilter}
            setNadiFilter={setNadiFilter}
            tpFilter={tpFilter}
            setTpFilter={setTpFilter}
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            pillarFilter={pillarFilter}
            setPillarFilter={setPillarFilter}
            programFilter={programFilter}
            setProgramFilter={setprogramFilter}

            // Filter data
            dusps={dusps}
            phases={phases}
            nadiSites={nadiSites}
            tpOptions={tpProviders}
            monthOptions={monthOptions}
            yearOptions={yearOptions}
            pillarOptions={pillarOptions}
            programOptions={programOptions}

            // Loading state
            isLoading={filtersLoading}
          />

          {/* By Phase Tab */}
          <TabsContent value="phase" className="mt-4">

            {/* Main Content for Phase tab - Combined Bar and Line Chart */}
            <ReportSmartServiceByPhase
              duspFilter={duspFilter}
              phaseFilter={phaseFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
            />
          </TabsContent>

          {/* By Pillar & Programme Tab */}
          <TabsContent value="pillar" className="mt-4">

            {/* Summary Cards */}
            <ReportSmartServicePillarByProgramme
              duspFilter={duspFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
              pillarFilter={pillarFilter}
              programFilter={programFilter}
            />
          </TabsContent>

          {/* By Month Tab */}
          <TabsContent value="month" className="mt-4">

            {/* Main Content for Month tab - Bar Chart  */}
            <ReportSmartServiceByMonth
              duspFilter={duspFilter}
              nadiFilter={nadiFilter}
              tpFilter={tpFilter}
              monthFilter={monthFilter}
              yearFilter={yearFilter}
            
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportSmartService;