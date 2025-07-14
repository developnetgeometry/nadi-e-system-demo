import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Download } from "lucide-react";
import { PayrollFilter, StaffEmployee } from "@/types/payroll";

interface EnhancedPayrollFiltersProps {
  filters: PayrollFilter;
  onFiltersChange: (filters: PayrollFilter) => void;
  employees: StaffEmployee[];
  organizations?: { id: string; name: string }[];
  sites?: { id: number; name: string }[];
  onExport?: () => void;
  isTPUser?: boolean;
}

export function EnhancedPayrollFilters({
  filters,
  onFiltersChange,
  employees,
  organizations = [],
  sites = [],
  onExport,
  isTPUser = false,
}: EnhancedPayrollFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = <K extends keyof PayrollFilter>(
    key: K,
    value: PayrollFilter[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      organizationId: undefined,
      siteId: undefined,
      month: undefined,
      year: undefined,
      status: undefined,
      staffId: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.organizationId ||
    filters.siteId ||
    filters.month ||
    filters.year ||
    filters.status ||
    filters.staffId;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "paid", label: "Paid" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Quick Actions */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="search"
                  placeholder="Search by employee name, position..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <Filter size={16} />
              {isExpanded ? "Hide Filters" : "More Filters"}
              {hasActiveFilters && !isExpanded && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={resetFilters} className="gap-2">
                <RotateCcw size={16} />
                Reset
              </Button>
            )}

            {onExport && (
              <Button variant="outline" onClick={onExport} className="gap-2">
                <Download size={16} />
                Export
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-4 border-t">
              {/* Employee Filter */}
              <div>
                <Label>Employee</Label>
                <Select
                  value={filters.staffId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "staffId",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Organization Filter (only for super admin or MCMC users) */}
              {isTPUser && organizations.length > 0 && (
                <div>
                  <Label>Organization</Label>
                  <Select
                    value={filters.organizationId || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "organizationId",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All organizations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Organizations</SelectItem>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Site Filter */}
              {sites.length > 0 && (
                <div>
                  <Label>Site</Label>
                  <Select
                    value={filters.siteId?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "siteId",
                        value === "all" ? undefined : parseInt(value)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All sites" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Month Filter */}
              <div>
                <Label>Month</Label>
                <Select
                  value={filters.month?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "month",
                      value === "all" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <Label>Year</Label>
                <Select
                  value={filters.year?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "year",
                      value === "all" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "status",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
