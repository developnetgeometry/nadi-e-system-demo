import React from "react";
import { RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DuspFilter } from "./DuspFilter";
import { FilterBadge } from "./component/FilterBadge";
import { NadiFilter } from "./NadiFilter";
import { DateFilter } from "./DateFilter";
import { PhaseFilter } from "./PhaseFilter";
import { TPFilter } from "./TPFilter";
import { PillarFilter } from "./PillarFilter";
import { ProgramFilter } from "./ProgramFilter";
import { DUSP, Phase, NADISite } from "@/hooks/report/use-report-filters";

type ModularReportFiltersProps = {
    // Configuration to show/hide filters
    showFilters: {
        dusp?: boolean;
        phase?: boolean;
        nadi?: boolean;
        tp?: boolean;
        date?: boolean;
        pillar?: boolean; // nd_event_subcategory
        program?: boolean; // nd_event_program
    };

    // Filter state (all optional based on showFilters)
    duspFilter?: (string | number)[];
    setDuspFilter?: (value: (string | number)[]) => void;
    phaseFilter?: string | number | null;
    setPhaseFilter?: (value: string | number | null) => void;
    nadiFilter?: (string | number)[];
    setNadiFilter?: (value: (string | number)[]) => void;
    tpFilter?: (string | number)[];
    setTpFilter?: (value: (string | number)[]) => void;
    monthFilter?: string | number | null;
    setMonthFilter?: (value: string | number | null) => void;
    yearFilter?: string | number | null;
    setYearFilter?: (value: string | number | null) => void;
    pillarFilter?: (string | number)[];
    setPillarFilter?: (value: (string | number)[]) => void;
    pillarOptions?: { id: string | number; name: string }[];
    programFilter?: (string | number)[];
    setProgramFilter?: (value: (string | number)[]) => void;
    programOptions?: { id: string | number; name: string }[];

    // Filter data (all optional based on showFilters)
    dusps?: DUSP[];
    phases?: Phase[];
    nadiSites?: NADISite[];
    tpOptions?: { id: string | number; name: string }[];
    monthOptions?: { id: string | number; label: string }[];
    yearOptions?: { id: string | number; label: string }[];

    // Loading state
    isLoading?: boolean;
};

export const ModularReportFilters = ({
    // Configuration
    showFilters = { dusp: false, phase: false, nadi: false, tp: false, date: false, pillar: false, program: false },

    // Filter state
    duspFilter = [],
    setDuspFilter = () => { },
    phaseFilter = null,
    setPhaseFilter = () => { },
    nadiFilter = [],
    setNadiFilter = () => { },
    tpFilter = [],
    setTpFilter = () => { },
    monthFilter = null,
    setMonthFilter = () => { },
    yearFilter = null,
    setYearFilter = () => { },
    // Destructure new filter props
    pillarFilter = [],
    setPillarFilter = () => { },
    pillarOptions = [],
    programFilter = [],
    setProgramFilter = () => { },
    programOptions = [],

    // Filter data
    dusps = [],
    phases = [],
    nadiSites = [],
    tpOptions = [],
    monthOptions = [],
    yearOptions = [],

    // Loading state
    isLoading = false
}: ModularReportFiltersProps) => {    // Calculate if there are any active filters
    const hasActiveFilters =
        (showFilters.dusp && duspFilter.length > 0) ||
        (showFilters.phase && phaseFilter !== null) ||
        (showFilters.nadi && nadiFilter.length > 0) ||
        (showFilters.tp && tpFilter.length > 0) ||
        (showFilters.date && (monthFilter !== null || yearFilter !== null)) ||
        (showFilters.pillar && pillarFilter.length > 0) ||
        (showFilters.program && programFilter.length > 0);

    // Reset only the filters that are enabled
    const resetFilters = () => {
        if (showFilters.dusp) setDuspFilter([]);
        if (showFilters.phase) setPhaseFilter(null);
        if (showFilters.nadi) setNadiFilter([]);
        if (showFilters.tp) setTpFilter([]);
        if (showFilters.date) {
            setMonthFilter(null);
            setYearFilter(null);
        }
        if (showFilters.pillar) setPillarFilter([]);
        if (showFilters.program) setProgramFilter([]);

    };

    return (
        <>
            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
                {/* DUSP Filter */}
                {showFilters.dusp && (
                    <DuspFilter
                        duspFilter={duspFilter}
                        setDuspFilter={setDuspFilter}
                        dusps={dusps}
                        isLoading={isLoading}
                    />
                )}

                {/* TP Filter */}
                {showFilters.tp && (
                    <TPFilter
                        selectedItems={tpFilter}
                        setSelectedItems={setTpFilter}
                        tpOptions={tpOptions}
                        isLoading={isLoading}
                    />
                )}

                {/* Phase Filter */}
                {showFilters.phase && (
                    <PhaseFilter
                        phaseFilter={phaseFilter}
                        setPhaseFilter={setPhaseFilter}
                        phases={phases}
                        isLoading={isLoading}
                    />
                )}

                {/* NADI Filter */}
                {showFilters.nadi && (
                    <NadiFilter
                        selectedItems={nadiFilter}
                        setSelectedItems={setNadiFilter}
                        nadiSites={nadiSites}
                        isLoading={isLoading}
                    />
                )}

                {/* Pillar Filter */}
                {showFilters.pillar && (
                    <PillarFilter
                        pillarFilter={pillarFilter || []}
                        setPillarFilter={setPillarFilter || (() => { })}
                        pillarOptions={pillarOptions || []}
                        isLoading={isLoading}
                    />
                )}

                {/* Program Filter */}
                {showFilters.program && (
                    <ProgramFilter
                        programFilter={programFilter || []}
                        setProgramFilter={setProgramFilter || (() => { })}
                        programOptions={programOptions || []}
                        isLoading={isLoading}
                    />
                )}


                {/* Month and Year Filters */}
                {showFilters.date && (
                    <DateFilter
                        monthFilter={monthFilter}
                        setMonthFilter={setMonthFilter}
                        monthOptions={monthOptions}
                        yearFilter={yearFilter}
                        setYearFilter={setYearFilter}
                        yearOptions={yearOptions}
                        isLoading={false}
                    />
                )}


                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Reset Button */}
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex items-center gap-2 h-10 text-sm px-4 shadow-sm hover:bg-slate-100"
                    disabled={!hasActiveFilters}
                >
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
                    </div>

                    {showFilters.dusp && duspFilter.length > 0 && (
                        <FilterBadge
                            label="DUSP"
                            value={duspFilter.length > 1
                                ? `${duspFilter.length} selected`
                                : dusps.find(d => String(d.id) === String(duspFilter[0]))?.name || String(duspFilter[0])}
                            onClear={() => setDuspFilter([])}
                        />
                    )}

                    {showFilters.phase && phaseFilter !== null && (
                        <FilterBadge
                            label="Phase"
                            value={phases.find(p => p.id === phaseFilter)?.name || String(phaseFilter)}
                            onClear={() => setPhaseFilter(null)}
                        />
                    )}                    {showFilters.nadi && nadiFilter.length > 0 && (
                        <FilterBadge
                            label="NADI"
                            value={nadiFilter.length > 1
                                ? `${nadiFilter.length} selected`
                                : nadiSites.find(s => s.id === nadiFilter[0])?.sitename || String(nadiFilter[0])}
                            onClear={() => setNadiFilter([])}
                        />
                    )}

                    {showFilters.tp && tpFilter.length > 0 && (
                        <FilterBadge
                            label="TP"
                            value={tpFilter.length > 1
                                ? `${tpFilter.length} selected`
                                : tpOptions.find(t => t.id === tpFilter[0])?.name || String(tpFilter[0])}
                            onClear={() => setTpFilter([])}
                        />
                    )}

                    {showFilters.date && monthFilter !== null && (
                        <FilterBadge
                            label="Month"
                            value={monthOptions.find(m => m.id === monthFilter)?.label || String(monthFilter)}
                            onClear={() => setMonthFilter(null)}
                        />
                    )}

                    {showFilters.date && yearFilter !== null && (
                        <FilterBadge
                            label="Year"
                            value={yearOptions.find(y => y.id === yearFilter)?.label || String(yearFilter)}
                            onClear={() => setYearFilter(null)}
                        />
                    )}

                    {showFilters.pillar && pillarFilter && pillarFilter.length > 0 && (
                        <FilterBadge
                            label="Pillar"
                            value={pillarFilter.length > 1
                                ? `${pillarFilter.length} selected`
                                : (pillarOptions || []).find(p => p.id === pillarFilter[0])?.name || String(pillarFilter[0])}
                            onClear={() => setPillarFilter && setPillarFilter([])}
                        />
                    )}

                    {showFilters.program && programFilter && programFilter.length > 0 && (
                        <FilterBadge
                            label="Program"
                            value={programFilter.length > 1
                                ? `${programFilter.length} selected`
                                : (programOptions || []).find(p => p.id === programFilter[0])?.name || String(programFilter[0])}
                            onClear={() => setProgramFilter && setProgramFilter([])}
                        />
                    )}
                </div>
            )}
        </>
    );
};