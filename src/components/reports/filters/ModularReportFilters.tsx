import React from "react";
import { RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DuspFilter } from "./DuspFilter";
import { FilterBadge } from "./component/FilterBadge";
import { NadiFilter } from "./NadiFilter";
import { DateFilter } from "./DateFilter";
import { PhaseFilter } from "./PhaseFilter";
import { TPFilter } from "./TPFilter";
import { DUSP, Phase, NADISite } from "@/hooks/report/use-report-filters";

type ModularReportFiltersProps = {
    // Configuration to show/hide filters
    showFilters: {
        dusp?: boolean;
        phase?: boolean;
        nadi?: boolean;
        tp?: boolean;
        date?: boolean;
    };

    // Filter state (all optional based on showFilters)
    duspFilter?: (string | number)[];
    setDuspFilter?: (value: (string | number)[]) => void;
    phaseFilter?: string | number | null;
    setPhaseFilter?: (value: string | number | null) => void;    nadiFilter?: (string | number)[];
    setNadiFilter?: (value: (string | number)[]) => void;
    tpFilter?: (string | number)[];
    setTpFilter?: (value: (string | number)[]) => void;
    monthFilter?: string | number | null;
    setMonthFilter?: (value: string | number | null) => void;
    yearFilter?: string | number | null;
    setYearFilter?: (value: string | number | null) => void;

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
    showFilters = { dusp: true, phase: true, nadi: true, tp: false, date: true },

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
        (showFilters.date && (monthFilter !== null || yearFilter !== null));

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

                {/* Phase Filter */}
                {showFilters.phase && (
                    <PhaseFilter
                        phaseFilter={phaseFilter}
                        setPhaseFilter={setPhaseFilter}
                        phases={phases}
                        isLoading={isLoading}
                    />
                )}                {/* NADI Filter */}
                {showFilters.nadi && (
                    <NadiFilter
                        selectedItems={nadiFilter}
                        setSelectedItems={setNadiFilter}
                        nadiSites={nadiSites}
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
                </div>
            )}
        </>
    );
};