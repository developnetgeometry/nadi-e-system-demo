
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CalendarManagement = () => {
  const [selectedState, setSelectedState] = useState<string>("State1");
  const [holidays, setHolidays] = useState<{ [key: string]: Date[] }>({
    State1: [new Date(2023, 11, 25)], // Example holiday for State1
    State2: [new Date(2023, 0, 1)], // Example holiday for State2
  });
  const [newHoliday, setNewHoliday] = useState<Date | undefined>(undefined);
  const [newState, setNewState] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [years, setYears] = useState<number[]>([2023, 2024]);
  const [newYear, setNewYear] = useState<number | "">("");

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(Number(year));
  };

  const handleAddHoliday = () => {
    if (newHoliday) {
      setHolidays((prev) => ({
        ...prev,
        [selectedState]: [...(prev[selectedState] || []), newHoliday],
      }));
      setNewHoliday(undefined);
      toast({
        title: "Holiday added",
        description: `Holiday added for ${selectedState} on ${format(
          newHoliday,
          "PPP"
        )}`,
      });
    } else {
      toast({
        title: "No date selected",
        description: "Please select a date before adding a holiday.",
      });
    }
  };

  const handleRemoveHoliday = (holiday: Date) => {
    setHolidays((prev) => ({
      ...prev,
      [selectedState]: (prev[selectedState] || []).filter(
        (h) => h.getTime() !== holiday.getTime()
      ),
    }));
    toast({
      title: "Holiday removed",
      description: `Holiday removed for ${selectedState} on ${format(
        holiday,
        "PPP"
      )}`,
    });
  };

  const handleAddState = () => {
    if (newState && !holidays[newState]) {
      setHolidays((prev) => ({
        ...prev,
        [newState]: [],
      }));
      setNewState("");
      toast({
        title: "State added",
        description: `State ${newState} has been added.`,
      });
    } else {
      toast({
        title: "Invalid state",
        description: "State is either empty or already exists.",
      });
    }
  };

  const handleAddYear = () => {
    if (newYear && !years.includes(newYear)) {
      setYears((prev) => [...prev, newYear]);
      setNewYear("");
      toast({
        title: "Year added",
        description: `Year ${newYear} has been added.`,
      });
    } else {
      toast({
        title: "Invalid year",
        description: "Year is either empty or already exists.",
      });
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Manage Holidays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={handleYearChange} defaultValue={String(selectedYear)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="number"
            value={newYear}
            onChange={(e) => setNewYear(Number(e.target.value))}
            placeholder="Add new year"
            className="border rounded p-2 flex-1"
          />
          <Button onClick={handleAddYear}>Add Year</Button>
        </div>
        <div className="mb-4">
          <Select
            onValueChange={handleStateChange}
            defaultValue={selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(holidays).map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            placeholder="Add new state"
            className="border rounded p-2 flex-1"
          />
          <Button onClick={handleAddState}>Add State</Button>
        </div>
        <div className="mb-4">
          <Calendar
            mode="single"
            selected={newHoliday}
            onSelect={setNewHoliday}
            className="rounded-md border shadow"
          />
          <Button onClick={handleAddHoliday} className="mt-2">
            Add Holiday
          </Button>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">
            Holidays for {selectedState}:
          </h3>
          <ul>
            {(holidays[selectedState] || []).map((holiday) => (
              <li
                key={holiday.getTime()}
                className="flex items-center justify-between"
              >
                <span>{format(holiday, "PPP")}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveHoliday(holiday)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarManagement;
