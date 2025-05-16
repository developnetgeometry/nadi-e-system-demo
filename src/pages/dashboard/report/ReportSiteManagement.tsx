import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, Filter, RotateCcw, Users, Building, Building2, Calendar, Download, Upload, ChevronsUpDown, Check,
  Shield, ClipboardCheck, FileText, Zap, AlertCircle, CheckCircle, Clock
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useReportFilters } from "@/hooks/report/use-report-filters";
import { useSiteManagementData } from "@/hooks/report/use-site-management-data";
import { useStableLoading } from "@/hooks/report/use-stable-loading";
import {
  SiteOverviewCard,
  InsuranceCard,
  AuditCard,
  AgreementCard,
  UtilitiesCard,
  LocalAuthorityCard,
  AwarenessProgrammeCard
} from "@/components/reports";

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

const ReportSiteManagement = () => {
  // Filter states
  const [duspFilter, setDuspFilter] = useState<string | number | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<(string | number)[]>([]);
  const [nadiFilter, setNadiFilter] = useState<(string | number)[]>([]);
  const [monthFilter, setMonthFilter] = useState<string | number | null>(null);
  const [yearFilter, setYearFilter] = useState<string | number | null>(null); // Default to null instead of current year

  // Fetch filter options from API
  const { phases, dusps, nadiSites, loading: filtersLoading } = useReportFilters();

  // Fetch site management data based on filters
  const { 
    sites, 
    utilities, 
    insurance, 
    audits, 
    agreements, 
    loading: dataLoading 
  } = useSiteManagementData(duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter);  // Calculate utilities summary from the utilities data we already have
  const utilitiesSummary = useMemo(() => {
    // Calculate totals
    const totalCount = utilities.length;
    const totalAmount = utilities.reduce((sum, u) => sum + (u.amount_bill || 0), 0);
    
    // Group utilities by type
    const typeGroups = utilities.reduce((groups, utility) => {
      const type = utility.type_name;
      if (!groups[type]) {
        groups[type] = {
          type,
          count: 0,
          amount: 0
        };
      }
      groups[type].count += 1;
      groups[type].amount += utility.amount_bill || 0;
      return groups;
    }, {});
    
    return {
      totalCount,
      totalAmount,
      byType: Object.values(typeGroups)
    };
  }, [utilities]);
  const hasActiveFilters = 
    duspFilter !== null || 
    phaseFilter.length > 0 || 
    nadiFilter.length > 0 ||
    monthFilter !== null || 
    yearFilter !== null;  const resetFilters = () => {
    setDuspFilter(null);
    setPhaseFilter([]);
    setNadiFilter([]);
    setMonthFilter(null);
    setYearFilter(null);
  };
  // Log filtering stats to help debug
  try {
    console.log('Site filtering stats:', {
      total: sites.length,
      withDusp: sites.filter(s => s.hasDusp !== undefined ? s.hasDusp : Boolean(s.dusp_id)).length,
      withoutDusp: sites.filter(s => s.hasDusp !== undefined ? !s.hasDusp : !Boolean(s.dusp_id)).length,
      uniqueDusps: new Set(sites.filter(s => s.dusp_id).map(s => s.dusp_id)).size,
      hasHasDuspProperty: sites.length > 0 ? 'hasDusp' in sites[0] : false,
      firstSiteData: sites.length > 0 ? { 
        id: sites[0].id,
        sitename: sites[0].sitename,
        hasDusp: sites[0].hasDusp !== undefined ? sites[0].hasDusp : 'property missing',
        dusp_id: sites[0].dusp_id,
        dusp_name: sites[0].dusp_name
      } : 'No sites',
      allPropertyNames: sites.length > 0 ? Object.keys(sites[0]) : []
    });
  } catch (err) {
    console.error('Error in site filtering stats:', err);
  }
  
  // Calculate stats for cards
  const activeInsurance = insurance.filter(i => i.status === 'Active').length;
  const expiringInsurance = insurance.filter(i => i.status === 'Expiring Soon').length;
  const expiredInsurance = insurance.filter(i => i.status === 'Expired').length;
  
  const pendingAudits = audits.filter(a => a.status === 'Pending').length;
  const inProgressAudits = audits.filter(a => a.status === 'In Progress').length;
  const completedAudits = audits.filter(a => a.status === 'Completed').length;
    const activeAgreements = agreements.filter(a => a.status === 'Active').length;
  const expiringAgreements = agreements.filter(a => a.status === 'Expiring Soon').length;    // Use individual stable loading states for each component
  const filtersStableLoading = useStableLoading(filtersLoading);
  const dataStableLoading = useStableLoading(dataLoading);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Site Management</h1>
            <p className="text-gray-500 mt-1">View and analyze site management data across all NADI sites</p>
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

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">          {/* DUSP Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={duspFilter !== null ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2 h-10",
                  duspFilter !== null && "bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-200"
                )}
              >
                <Building className={cn("h-4 w-4", duspFilter !== null ? "text-purple-600" : "text-gray-500")} />
                {duspFilter !== null 
                  ? (duspFilter === 'unassigned' ? 'Not Assigned' : 'DUSP Filtered') 
                  : 'DUSP'}
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search DUSP..." />
                <CommandList>
                  <CommandEmpty>No DUSP found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filtersLoading ? (
                      <CommandItem disabled>Loading DUSP options...</CommandItem>
                    ) : (
                      <>
                        <CommandItem
                          key="unassigned"
                          onSelect={() => {
                            const newFilter = duspFilter === "unassigned" ? null : "unassigned";
                            console.log('DUSP filter changed for unassigned:', { 
                              old: duspFilter, 
                              new: newFilter
                            });
                            setDuspFilter(newFilter);
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                              duspFilter === "unassigned" ? "bg-primary border-primary" : "opacity-50"
                            )}
                          >
                            {duspFilter === "unassigned" && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-600">Not Assigned</span>
                        </CommandItem>
                        {dusps.map((dusp) => (
                          <CommandItem
                            key={dusp.id}
                            onSelect={() => {
                              // Compare as strings to handle different types
                              const newFilter = String(duspFilter) === String(dusp.id) ? null : dusp.id;
                              console.log('DUSP filter changed:', { 
                                old: duspFilter, 
                                new: newFilter,
                                duspName: dusp.name
                              });
                              setDuspFilter(newFilter);
                            }}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                                String(duspFilter) === String(dusp.id) ? "bg-primary border-primary" : "opacity-50"
                              )}
                            >
                              {String(duspFilter) === String(dusp.id) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            {dusp.name}
                          </CommandItem>
                        ))}
                      </>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Phase Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >                <Users className="h-4 w-4 text-gray-500" />
                Phase {phaseFilter.length > 0 && `(${phaseFilter.length})`}
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search phases..." />
                <CommandList>
                  <CommandEmpty>No phases found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filtersLoading ? (
                      <CommandItem disabled>Loading phase options...</CommandItem>
                    ) : (
                      phases.map((phase) => (
                        <CommandItem
                          key={phase.id}
                          onSelect={() => {
                            setPhaseFilter(
                              phaseFilter.includes(phase.id)
                                ? phaseFilter.filter(id => id !== phase.id)
                                : [...phaseFilter, phase.id]
                            );
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                              phaseFilter.includes(phase.id) ? "bg-primary border-primary" : "opacity-50"
                            )}
                          >
                            {phaseFilter.includes(phase.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {phase.name}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* NADI Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >                <Building2 className="h-4 w-4 text-gray-500" />
                NADI {nadiFilter.length > 0 && `(${nadiFilter.length})`}
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search NADI sites..." />
                <CommandList>
                  <CommandEmpty>No NADI sites found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filtersLoading ? (
                      <CommandItem disabled>Loading NADI site options...</CommandItem>
                    ) : (
                      nadiSites.map((site) => (
                        <CommandItem
                          key={site.id}
                          onSelect={() => {
                            setNadiFilter(
                              nadiFilter.includes(site.id)
                                ? nadiFilter.filter(id => id !== site.id)
                                : [...nadiFilter, site.id]
                            );
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                              nadiFilter.includes(site.id) ? "bg-primary border-primary" : "opacity-50"
                            )}
                          >
                            {nadiFilter.includes(site.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {site.sitename} {site.standard_code ? `(${site.standard_code})` : ''}
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Month Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                Month
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search months..." />
                <CommandList>
                  <CommandEmpty>No month found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {monthOptions.map((month) => (
                      <CommandItem
                        key={month.id}
                        onSelect={() => setMonthFilter(monthFilter === month.id ? null : month.id)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            monthFilter === month.id ? "bg-primary border-primary" : "opacity-50"
                          )}
                        >
                          {monthFilter === month.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {month.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Year Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                Year
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder="Search years..." />
                <CommandList>
                  <CommandEmpty>No year found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {yearOptions.map((year) => (
                      <CommandItem
                        key={year.id}
                        onSelect={() => setYearFilter(yearFilter === year.id ? null : year.id)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/30",
                            yearFilter === year.id ? "bg-primary border-primary" : "opacity-50"
                          )}
                        >
                          {yearFilter === year.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {year.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Reset Button */}
          <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2 h-10 text-sm px-4 shadow-sm hover:bg-slate-100">
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-3 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="mr-1 flex items-center">
              <Filter className="h-4 w-4 text-slate-500 mr-1" />
              <span className="text-xs font-medium text-slate-500">Active Filters:</span>
            </div>            {duspFilter !== null && (
              <Badge variant="outline" className="gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50">
                <span className="font-medium">
                  DUSP: {duspFilter === "unassigned" 
                    ? "Not Assigned" 
                    : dusps.find(d => d.id === duspFilter)?.name || duspFilter}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
                  onClick={() => setDuspFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {phaseFilter.length > 0 && (
              <Badge variant="outline" className="gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50">
                <span className="font-medium">
                  Phase: {phaseFilter.length > 1 
                    ? `${phaseFilter.length} selected` 
                    : phases.find(p => p.id === phaseFilter[0])?.name || phaseFilter[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
                  onClick={() => setPhaseFilter([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {nadiFilter.length > 0 && (
              <Badge variant="outline" className="gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50">
                <span className="font-medium">
                  NADI: {nadiFilter.length > 1 
                    ? `${nadiFilter.length} sites selected` 
                    : nadiSites.find(s => s.id === nadiFilter[0])?.sitename || nadiFilter[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
                  onClick={() => setNadiFilter([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}            {monthFilter !== null && (
              <Badge variant="outline" className="gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50">
                <span className="font-medium">Month: {monthOptions.find(opt => opt.id === monthFilter)?.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
                  onClick={() => setMonthFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}            {yearFilter !== null && (
              <Badge variant="outline" className="gap-2 px-3 py-1 h-7 bg-white shadow-sm hover:bg-slate-50">
                <span className="font-medium">Year: {yearFilter}</span>
                <Button
                  variant="ghost"
                  size="sm"                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-slate-200"
                  onClick={() => setYearFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}        {/* Statistics Cards Grid */}        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          
          
          <SiteOverviewCard
            loading={filtersStableLoading || dataStableLoading}
            siteCount={sites.length}
            activeSiteCount={sites.filter(s => s.is_active).length}
            uniquePhaseCount={new Set(sites.map(s => s.phase_id)).size}
            uniqueDuspCount={new Set(sites
              .filter(s => s.dusp_id !== null && s.dusp_id !== undefined && s.dusp_id !== "")
              .map(s => s.dusp_id)).size}
            totalSiteCount={nadiSites?.length || 0}
          />

          <InsuranceCard
            loading={dataStableLoading}
            siteCount={sites.length}
            insuredSiteCount={new Set(insurance.map(i => i.site_id)).size}
            activeCount={activeInsurance}
            expiringCount={expiringInsurance}
            expiredCount={expiredInsurance}
          />          
          
          <AuditCard
            loading={dataStableLoading}
            siteCount={sites.length}
            auditedSiteCount={0} // Data not available yet
            completedCount={0}
            inProgressCount={0}
            pendingCount={0}
          />

          <AgreementCard
            loading={dataStableLoading}
            siteCount={sites.length}
            agreementSiteCount={0} // Data not available yet
            activeCount={0}
            expiringCount={0}
          />          
            <UtilitiesCard
            loading={dataStableLoading}
            siteCount={sites.length}
            utilitySiteCount={new Set(utilities.map(u => u.site_id)).size}
            totalBills={utilitiesSummary.totalCount}
            totalAmount={utilitiesSummary.totalAmount}
            utilityTypes={(utilitiesSummary.byType as any[]).map(t => t.type)}
          />
          
          <LocalAuthorityCard
            loading={dataStableLoading}
            siteCount={sites.length}
            laRecordSiteCount={0} // No data available yet
            compliantCount={0}
            pendingCount={0}
            inProgressCount={0}
          />

          <AwarenessProgrammeCard
            loading={dataStableLoading}
            siteCount={sites.length}
            programmesSiteCount={0} // No data available yet
            totalProgrammes={0}
            completedCount={0}
            upcomingCount={0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportSiteManagement;