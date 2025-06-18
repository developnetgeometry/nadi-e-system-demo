"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxFilterFinanceProps {
    filterValues: string[];
    label: string;
    key: string;
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    className?: string
}

export function ComboBoxFilterFinance({
    filterValues,
    label,
    key,
    value,
    setValue,
    className
}: ComboBoxFilterFinanceProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    {label
                        ? label
                        : "Select framework..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[200px] p-0 !top-full !mt-0"
                side="bottom" sideOffset={0}
                avoidCollisions={false}
            >
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {filterValues.map((filter) => (
                                <CommandItem
                                    key={filter}
                                    value={filter}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue);
                                        setOpen(false)
                                    }}
                                >
                                    {filter}
                                    <Check
                                        className={`ml-auto", ${value === String(filter) ? "opacity-100" : "opacity-0"}`}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
};