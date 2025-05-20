import React from "react";
import { Users } from "lucide-react";
import { FilterPopover } from "./component/FilterPopover";
import { FilterCommand } from "./component/FilterCommand";
import { Phase } from "@/hooks/report/use-report-filters";

type PhaseFilterProps = {
    phaseFilter: string | number | null;
    setPhaseFilter: (value: string | number | null) => void;
    phases: Phase[];
    isLoading?: boolean;
};

export const PhaseFilter = ({
    phaseFilter,
    setPhaseFilter,
    phases,
    isLoading = false
}: PhaseFilterProps) => {
    const handleSelect = (id: string | number) => {
        setPhaseFilter(phaseFilter === id ? null : id);
    };

    // Create a list of Phase items
    const items = phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        label: phase.name
    }));

    return (
        <FilterPopover
            isActive={phaseFilter !== null}
            icon={Users}
            label="Phase"
            value={phaseFilter !== null ? items.find(item => item.id === phaseFilter)?.label : undefined}
        >
            <FilterCommand
                items={items}
                selectedItems={phaseFilter !== null ? [phaseFilter] : []}
                searchPlaceholder="Search phases..."
                emptyMessage="No phases found."
                isLoading={isLoading}
                isMultiSelect={false}
                onSelect={handleSelect}
            />
        </FilterPopover>
    );
};
