
import { useState, useCallback } from "react";
import { Search, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface State {
  id: number;
  name: string;
  code?: string;
  abbr?: string;
  [key: string]: any;
}

interface SelectStatesListProps {
  states: State[];
  selectedStates: number[];
  onChange: (selectedIds: number[]) => void;
  className?: string;
  label?: string;
  helpText?: string;
  maxHeight?: string;
}

export function SelectStatesList({
  states,
  selectedStates,
  onChange,
  className,
  label = "Select States",
  helpText,
  maxHeight = "200px"
}: SelectStatesListProps) {
  const [filter, setFilter] = useState("");

  const filteredStates = states.filter(state => 
    state.name.toLowerCase().includes(filter.toLowerCase()) ||
    state.code?.toLowerCase().includes(filter.toLowerCase()) ||
    state.abbr?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleStateToggle = useCallback((stateId: number, checked: boolean) => {
    if (checked) {
      onChange([...selectedStates, stateId]);
    } else {
      onChange(selectedStates.filter(id => id !== stateId));
    }
  }, [selectedStates, onChange]);

  const handleSelectAll = useCallback(() => {
    const allFilteredIds = filteredStates.map(state => state.id);
    // If all filtered states are already selected, deselect them
    if (filteredStates.every(state => selectedStates.includes(state.id))) {
      onChange(selectedStates.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Add all filtered states that aren't already selected
      const newSelected = [...selectedStates];
      allFilteredIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      onChange(newSelected);
    }
  }, [filteredStates, selectedStates, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-base">{label}</Label>}
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
      
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search states..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {filteredStates.length > 0 && (
        <div className="flex items-center mb-2">
          <Checkbox 
            id="select-all"
            checked={filteredStates.length > 0 && filteredStates.every(state => selectedStates.includes(state.id))}
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="ml-2 cursor-pointer font-medium">
            {filteredStates.every(state => selectedStates.includes(state.id)) 
              ? "Deselect All" 
              : "Select All"}
          </Label>
        </div>
      )}
      
      <ScrollArea className={`border rounded p-2 max-h-[${maxHeight}]`}>
        <div className="grid grid-cols-2 gap-2">
          {filteredStates.length > 0 ? (
            filteredStates.map((state) => (
              <div key={state.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state.id}`}
                  checked={selectedStates.includes(state.id)}
                  onCheckedChange={(checked) => handleStateToggle(state.id, !!checked)}
                />
                <Label 
                  htmlFor={`state-${state.id}`} 
                  className="font-normal cursor-pointer text-sm flex items-center"
                >
                  {selectedStates.includes(state.id) && (
                    <Check className="h-3 w-3 mr-1 text-primary" />
                  )}
                  {state.name}
                  {state.abbr && <span className="text-muted-foreground ml-1">({state.abbr})</span>}
                </Label>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-muted-foreground">
              No states match your search
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
