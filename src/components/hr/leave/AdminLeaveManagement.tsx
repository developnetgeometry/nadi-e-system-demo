import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLeaveApplications } from "./AdminLeaveApplications";
import { AdminLeaveSettings } from "./AdminLeaveSettings";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Clock,
  Check,
  X,
  Loader,
  Download,
  CalendarDays,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Building2,
  SlidersHorizontal,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { AddLeaveRequestDialog } from "@/components/hr/AddLeaveRequestDialog";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useSuperAdmin, SiteInfo } from "@/hooks/useSuperAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExportButton from "@/components/member/ExportButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const LeaveManagement = () => {};
export function AdminLeaveManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<number[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    site: "",
    phase: "",
    state: "",
    department: "",
    position: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    duration: "",
    approvedBy: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    site: "",
    phase: "",
    state: "",
    department: "",
    position: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    duration: "",
    approvedBy: "",
  });
  const [viewAllDialogOpen, setViewAllDialogOpen] = useState(false);
  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const { isSuperAdmin, selectedSite, availableSites, changeSite } =
    useSuperAdmin();
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 201,
      employee: "Kavitha Rajan",
      avatar: "/placeholder.svg",
      position: "Community Engagement Officer",
      department: "Community",
      type: "Annual Leave",
      startDate: "2023-05-15",
      endDate: "2023-05-19",
      status: "Approved",
      approvedBy: "Ahmad Razali",
      approvedDate: "2023-05-10",
      reason: "Family vacation",
    },
    {
      id: 202,
      employee: "Tan Wei Ling",
      avatar: "/placeholder.svg",
      position: "IT Specialist",
      department: "IT Support",
      type: "Sick Leave",
      startDate: "2023-05-16",
      endDate: "2023-05-17",
      status: "Pending",
      reason: "Not feeling well, doctor's appointment scheduled",
    },
    {
      id: 203,
      employee: "Mohamed Ibrahim",
      avatar: "/placeholder.svg",
      position: "Programme Coordinator",
      department: "Programmes",
      type: "Emergency Leave",
      startDate: "2023-05-20",
      endDate: "2023-05-20",
      status: "Pending",
      reason: "Family emergency",
    },
    {
      id: 204,
      employee: "Priya Sharma",
      avatar: "/placeholder.svg",
      position: "Assistant Manager",
      department: "Administration",
      type: "Annual Leave",
      startDate: "2023-05-25",
      endDate: "2023-05-26",
      status: "Pending",
      reason: "Personal matters",
    },
    {
      id: 205,
      employee: "Chong Wei Ming",
      avatar: "/placeholder.svg",
      position: "Technical Support",
      department: "IT Support",
      type: "Medical Leave",
      startDate: "2023-05-10",
      endDate: "2023-05-14",
      status: "Approved",
      approvedBy: "Ahmad Razali",
      approvedDate: "2023-05-09",
      reason: "Surgery recovery",
    },
    {
      id: 206,
      employee: "Nurul Huda",
      avatar: "/placeholder.svg",
      position: "Administrative Assistant",
      department: "Administration",
      type: "Unpaid Leave",
      startDate: "2023-06-01",
      endDate: "2023-06-10",
      status: "Rejected",
      approvedBy: "Ahmad Razali",
      approvedDate: "2023-05-12",
      reason: "Personal travel",
      comments: "Insufficient staffing during requested period",
    },
  ]);
  const [leaveBalances, setLeaveBalances] = useState([
    {
      id: 1,
      employee: "Ahmad Razali",
      avatar: "/placeholder.svg",
      position: "Department Head",
      annualLeave: {
        balance: 12,
        total: 18,
      },
      sickLeave: {
        balance: 10,
        total: 14,
      },
      emergencyLeave: {
        balance: 2,
        total: 3,
      },
    },
    {
      id: 2,
      employee: "Kavitha Rajan",
      avatar: "/placeholder.svg",
      position: "Community Engagement Officer",
      annualLeave: {
        balance: 8,
        total: 14,
      },
      sickLeave: {
        balance: 12,
        total: 14,
      },
      emergencyLeave: {
        balance: 3,
        total: 3,
      },
    },
    {
      id: 3,
      employee: "Tan Wei Ling",
      avatar: "/placeholder.svg",
      position: "IT Specialist",
      annualLeave: {
        balance: 10,
        total: 14,
      },
      sickLeave: {
        balance: 8,
        total: 14,
      },
      emergencyLeave: {
        balance: 2,
        total: 3,
      },
    },
    {
      id: 4,
      employee: "Mohamed Ibrahim",
      avatar: "/placeholder.svg",
      position: "Programme Coordinator",
      annualLeave: {
        balance: 5,
        total: 14,
      },
      sickLeave: {
        balance: 10,
        total: 14,
      },
      emergencyLeave: {
        balance: 1,
        total: 3,
      },
    },
    {
      id: 5,
      employee: "Priya Sharma",
      avatar: "/placeholder.svg",
      position: "Assistant Manager",
      annualLeave: {
        balance: 7,
        total: 16,
      },
      sickLeave: {
        balance: 14,
        total: 14,
      },
      emergencyLeave: {
        balance: 3,
        total: 3,
      },
    },
  ]);
  const employees = [
    {
      id: 1,
      name: "Ahmad Razali",
    },
    {
      id: 2,
      name: "Priya Sharma",
    },
    {
      id: 3,
      name: "Tan Wei Ling",
    },
    {
      id: 4,
      name: "Mohamed Ibrahim",
    },
    {
      id: 5,
      name: "Kavitha Rajan",
    },
    {
      id: 6,
      name: "Chong Wei Ming",
    },
    {
      id: 7,
      name: "Nurul Huda",
    },
  ];
  const calculateDuration = (
    startDate: string | Date,
    endDate: string | Date
  ) => {
    const start =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  const formatDate = (dateInput: string | Date): string => {
    if (!dateInput) return "";
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return format(date, "MMM d, yyyy");
  };
  const handleAddLeaveRequest = (data) => {
    const newLeaveRequest = {
      id: leaveRequests.length + 201,
      employee: data.employee,
      avatar: "/placeholder.svg",
      position: "Staff",
      department: "Department",
      type: data.type,
      startDate: data.startDate.toISOString().split("T")[0],
      endDate: data.endDate.toISOString().split("T")[0],
      status: "Pending",
      reason: data.reason,
    };
    setLeaveRequests([newLeaveRequest, ...leaveRequests]);
    toast.success(`Leave request for ${data.employee} submitted successfully`);
  };
  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    const matchesSearch =
      leave.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.type === typeFilter;
    if (appliedFilters.site && leave.department !== appliedFilters.site)
      return false;
    if (
      appliedFilters.department &&
      leave.department !== appliedFilters.department
    )
      return false;
    if (appliedFilters.position && leave.position !== appliedFilters.position)
      return false;
    if (
      appliedFilters.startDate &&
      new Date(leave.startDate) < appliedFilters.startDate
    )
      return false;
    if (
      appliedFilters.endDate &&
      new Date(leave.endDate) > appliedFilters.endDate
    )
      return false;
    if (appliedFilters.duration) {
      const duration = calculateDuration(leave.startDate, leave.endDate);
      if (appliedFilters.duration === "short" && duration > 3) return false;
      if (
        appliedFilters.duration === "medium" &&
        (duration <= 3 || duration > 7)
      )
        return false;
      if (appliedFilters.duration === "long" && duration <= 7) return false;
    }
    if (
      appliedFilters.approvedBy &&
      leave.approvedBy !== appliedFilters.approvedBy
    )
      return false;
    return matchesSearch && matchesStatus && matchesType;
  });
  const pendingRequests = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;
  const approvedRequests = leaveRequests.filter(
    (leave) => leave.status === "Approved"
  ).length;
  const rejectedRequests = leaveRequests.filter(
    (leave) => leave.status === "Rejected"
  ).length;
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeaves(filteredLeaveRequests.map((leave) => leave.id));
    } else {
      setSelectedLeaves([]);
    }
  };
  const handleSelectLeave = (leaveId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeaves([...selectedLeaves, leaveId]);
    } else {
      setSelectedLeaves(selectedLeaves.filter((id) => id !== leaveId));
    }
  };
  const handleSiteChange = (siteId: number) => {
    if (changeSite(siteId)) {
      toast.success(`Switched to ${selectedSite.name}`);
    }
  };
  const handleApproveLeave = (leaveId: number) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Approved",
              approvedBy: "Current User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : leave
      )
    );
    toast.success("Leave request approved successfully");
  };
  const handleRejectLeave = (leaveId: number) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: "Rejected",
              approvedBy: "Current User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : leave
      )
    );
    toast.error("Leave request rejected");
  };
  const handleViewLeave = (leaveId: number) => {
    const leave = leaveRequests.find((l) => l.id === leaveId);
    if (leave) {
      setSelectedLeaveDetails(leave);
      setDetailsDialogOpen(true);
    }
  };
  const handleFilterChange = (filter: string, value: any) => {
    setTempFilters({
      ...tempFilters,
      [filter]: value,
    });
  };
  const handleApplyFilters = () => {
    setAppliedFilters({
      ...tempFilters,
    });
    setAdvancedFilterOpen(false);
    toast.success("Filters applied successfully");
  };
  const handleResetFilters = () => {
    setTempFilters({
      site: "",
      phase: "",
      state: "",
      department: "",
      position: "",
      startDate: null,
      endDate: null,
      duration: "",
      approvedBy: "",
    });
    setAppliedFilters({
      site: "",
      phase: "",
      state: "",
      department: "",
      position: "",
      startDate: null,
      endDate: null,
      duration: "",
      approvedBy: "",
    });
    setStatusFilter("all");
    setTypeFilter("all");
    toast.info("Filters have been reset");
  };
  const handleBulkAction = () => {
    toast.info(
      `Selected ${selectedLeaves.length} leave request(s) for processing`
    );
  };
  const handleViewAllScheduled = () => {
    setViewAllDialogOpen(true);
  };
  const departments = Array.from(
    new Set(leaveRequests.map((leave) => leave.department))
  );
  const positions = Array.from(
    new Set(leaveRequests.map((leave) => leave.position))
  );
  const approvers = Array.from(
    new Set(
      leaveRequests
        .filter((leave) => leave.approvedBy)
        .map((leave) => leave.approvedBy)
    )
  );
  const leaveTypes = Array.from(
    new Set(leaveRequests.map((leave) => leave.type))
  );
  return (
    <div className="p-6 mx-auto space-y-6 w-full max-w-none overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-xl">Leave Management</h1>
          <p className="text-muted-foreground">
            Process and track staff leave requests
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building2 size={16} />
                  {selectedSite.name}
                  <span className="sr-only">Select site</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Switch Site</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableSites.map((site) => (
                  <DropdownMenuItem
                    key={site.id}
                    onClick={() => handleSiteChange(site.id)}
                    className={selectedSite.id === site.id ? "bg-muted" : ""}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>{site.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({site.location})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </p>
                <h3 className="text-2xl font-bold mt-1">{pendingRequests}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved
                </p>
                <h3 className="text-2xl font-bold mt-1">{approvedRequests}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rejected
                </p>
                <h3 className="text-2xl font-bold mt-1">{rejectedRequests}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto md:min-w-[320px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, department, leave type..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdvancedFilterOpen(true)}
            className="h-9 bg-white flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
          </Button>
          <ExportButton
            data={filteredLeaveRequests}
            title="Leave Requests Report"
          />
          {useUserMetadata()?.user_group === 6 && (
            <Button
              onClick={() => setIsAddLeaveOpen(true)}
              className="bg-[#8079b9]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {leaveTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {Object.entries(appliedFilters).some(
            ([key, value]) =>
              value !== "" &&
              value !== null &&
              key !== "site" &&
              key !== "phase" &&
              key !== "state"
          ) && (
            <Button
              variant="outline"
              className="h-9 bg-purple-100 text-purple-700 border-purple-200"
              onClick={handleResetFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      <AddLeaveRequestDialog
        open={isAddLeaveOpen}
        onOpenChange={setIsAddLeaveOpen}
        onAddLeaveRequest={handleAddLeaveRequest}
        employees={employees}
      />

      <Dialog open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Filter leave requests with multiple criteria
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={tempFilters.department}
                  onValueChange={(value) =>
                    handleFilterChange("department", value)
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={tempFilters.position}
                  onValueChange={(value) =>
                    handleFilterChange("position", value)
                  }
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilters.startDate ? (
                        formatDate(tempFilters.startDate)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilters.startDate || undefined}
                      onSelect={(date) => handleFilterChange("startDate", date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilters.endDate ? (
                        formatDate(tempFilters.endDate)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilters.endDate || undefined}
                      onSelect={(date) => handleFilterChange("endDate", date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Leave Duration</Label>
              <RadioGroup
                value={tempFilters.duration}
                onValueChange={(value) => handleFilterChange("duration", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-duration" />
                  <Label htmlFor="all-duration">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short (1-3 days)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium (4-7 days)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long (&gt;7 days)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvedBy">Approved By</Label>
              <Select
                value={tempFilters.approvedBy}
                onValueChange={(value) =>
                  handleFilterChange("approvedBy", value)
                }
              >
                <SelectTrigger id="approvedBy">
                  <SelectValue placeholder="Any approver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Approver</SelectItem>
                  {approvers.map((approver) => (
                    <SelectItem key={approver} value={approver}>
                      {approver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdvancedFilterOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {Object.entries(appliedFilters).some(
        ([key, value]) => value !== "" && value !== null
      ) && (
        <div className="flex flex-wrap gap-2 bg-muted/50 p-2 rounded-md">
          <div className="text-sm font-medium mr-2">Applied filters:</div>
          {appliedFilters.department && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Department: {appliedFilters.department}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    department: "",
                  });
                  setTempFilters({
                    ...tempFilters,
                    department: "",
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedFilters.position && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Position: {appliedFilters.position}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    position: "",
                  });
                  setTempFilters({
                    ...tempFilters,
                    position: "",
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedFilters.startDate && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              From: {formatDate(appliedFilters.startDate)}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    startDate: null,
                  });
                  setTempFilters({
                    ...tempFilters,
                    startDate: null,
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedFilters.endDate && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              To: {formatDate(appliedFilters.endDate)}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    endDate: null,
                  });
                  setTempFilters({
                    ...tempFilters,
                    endDate: null,
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedFilters.duration && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Duration:{" "}
              {appliedFilters.duration === "short"
                ? "Short (1-3 days)"
                : appliedFilters.duration === "medium"
                ? "Medium (4-7 days)"
                : "Long (>7 days)"}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    duration: "",
                  });
                  setTempFilters({
                    ...tempFilters,
                    duration: "",
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {appliedFilters.approvedBy && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Approved by: {appliedFilters.approvedBy}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  setAppliedFilters({
                    ...appliedFilters,
                    approvedBy: "",
                  });
                  setTempFilters({
                    ...tempFilters,
                    approvedBy: "",
                  });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Status: {statusFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setStatusFilter("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {typeFilter !== "all" && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Type: {typeFilter}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setTypeFilter("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12 p-2 pl-4">
                  <Checkbox
                    checked={
                      filteredLeaveRequests.length > 0 &&
                      selectedLeaves.length === filteredLeaveRequests.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="p-2 pl-4">
                      <Checkbox
                        checked={selectedLeaves.includes(leave.id)}
                        onCheckedChange={(checked) =>
                          handleSelectLeave(leave.id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      L{String(leave.id).padStart(3, "0")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={leave.avatar}
                            alt={leave.employee}
                          />
                          <AvatarFallback>
                            {leave.employee.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {leave.employee}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {leave.position}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {leave.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {calculateDuration(leave.startDate, leave.endDate)} days
                    </TableCell>
                    <TableCell>
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {leave.department?.includes(" ")
                        ? leave.department.split(" ")[0]
                        : "Main"}
                    </TableCell>
                    <TableCell>{leave.department || "Community"}</TableCell>
                    <TableCell>
                      {leave.status === "Pending" ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                            onClick={() => handleApproveLeave(leave.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleRejectLeave(leave.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewLeave(leave.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    <p className="text-muted-foreground">
                      No leave requests found matching your criteria.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {selectedLeaves.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-md flex items-center justify-between">
            <span>
              {selectedLeaves.length} leave request
              {selectedLeaves.length > 1 ? "s" : ""} selected
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLeaves([])}
              >
                Clear Selection
              </Button>
              <Button variant="secondary" size="sm" onClick={handleBulkAction}>
                Action
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Leave Policy Summary</CardTitle>
            <CardDescription>
              Quick reference for leave management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-indigo-600" />
                Annual Leave Policy
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>
                  Full-time employees are entitled to 14-18 days of annual leave
                  depending on years of service
                </li>
                <li>
                  Requests should be submitted at least 2 weeks in advance
                </li>
                <li>Leave can be carried forward up to a maximum of 5 days</li>
                <li>Leave days can be accumulated for up to 2 years</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Sick Leave Policy
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>
                  Full-time employees are entitled to 14 days of sick leave per
                  year
                </li>
                <li>
                  Medical certificate is required for sick leave of more than 2
                  consecutive days
                </li>
                <li>Notify supervisor as soon as possible</li>
                <li>Unused sick leave cannot be carried forward or encashed</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Other Leave Types
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">Emergency Leave:</span> 3 days
                  per year for urgent personal matters
                </li>
                <li>
                  <span className="font-medium">Maternity Leave:</span> 90
                  calendar days as per government regulations
                </li>
                <li>
                  <span className="font-medium">Paternity Leave:</span> 7
                  working days
                </li>
                <li>
                  <span className="font-medium">Compassionate Leave:</span> Up
                  to 3 days for immediate family
                </li>
                <li>
                  <span className="font-medium">Unpaid Leave:</span> At
                  management discretion, no benefits accrue
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leaves</CardTitle>
            <CardDescription>Next 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests
                .filter(
                  (leave) =>
                    leave.status === "Approved" &&
                    new Date(leave.startDate) <=
                      new Date(
                        new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                      ) &&
                    new Date(leave.endDate) >= new Date()
                )
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime()
                )
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-start p-3 border rounded-md"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={leave.avatar} alt={leave.employee} />
                      <AvatarFallback>
                        {leave.employee.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{leave.employee}</div>
                      <div className="text-sm flex items-center">
                        <Badge variant="outline" className="mr-2 font-normal">
                          {leave.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(leave.startDate)} -{" "}
                          {formatDate(leave.endDate)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {calculateDuration(leave.startDate, leave.endDate)} days
                      </div>
                    </div>
                  </div>
                ))}

              {leaveRequests.filter(
                (leave) =>
                  leave.status === "Approved" &&
                  new Date(leave.startDate) <=
                    new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000) &&
                  new Date(leave.endDate) >= new Date()
              ).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No upcoming leaves in the next 14 days</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewAllScheduled}
            >
              View All Scheduled Leaves
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeaveDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedLeaveDetails.avatar}
                    alt={selectedLeaveDetails.employee}
                  />
                  <AvatarFallback>
                    {selectedLeaveDetails.employee.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedLeaveDetails.employee}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeaveDetails.position} •{" "}
                    {selectedLeaveDetails.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Leave Type
                  </p>
                  <p>{selectedLeaveDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`${
                      selectedLeaveDetails.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : selectedLeaveDetails.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedLeaveDetails.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </p>
                  <p>{formatDate(selectedLeaveDetails.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    End Date
                  </p>
                  <p>{formatDate(selectedLeaveDetails.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration
                  </p>
                  <p>
                    {calculateDuration(
                      selectedLeaveDetails.startDate,
                      selectedLeaveDetails.endDate
                    )}{" "}
                    days
                  </p>
                </div>
                {selectedLeaveDetails.approvedBy && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Reviewed By
                    </p>
                    <p>{selectedLeaveDetails.approvedBy}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reason
                </p>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedLeaveDetails.reason}
                </p>
              </div>

              {selectedLeaveDetails.comments && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Comments
                  </p>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedLeaveDetails.comments}
                  </p>
                </div>
              )}

              {selectedLeaveDetails.status === "Pending" && (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                    onClick={() => {
                      handleRejectLeave(selectedLeaveDetails.id);
                      setDetailsDialogOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveLeave(selectedLeaveDetails.id);
                      setDetailsDialogOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={viewAllDialogOpen} onOpenChange={setViewAllDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>All Scheduled Leaves</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-3 mt-4">
            {leaveRequests
              .filter((leave) => leave.status === "Approved")
              .sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-start p-3 border rounded-md"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={leave.avatar} alt={leave.employee} />
                    <AvatarFallback>
                      {leave.employee.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{leave.employee}</div>
                    <div className="text-sm flex items-center flex-wrap gap-2">
                      <Badge variant="outline" className="mr-2 font-normal">
                        {leave.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(leave.startDate)} -{" "}
                        {formatDate(leave.endDate)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {calculateDuration(leave.startDate, leave.endDate)} days •{" "}
                      {leave.department}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setSelectedLeaveDetails(leave);
                      setViewAllDialogOpen(false);
                      setDetailsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}

            {leaveRequests.filter((leave) => leave.status === "Approved")
              .length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No scheduled leaves found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
