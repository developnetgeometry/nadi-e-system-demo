import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";

// Mock data for staff members
const staffData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Site Engineer",
    employDate: "2023-05-15",
    status: "Active",
    siteLocation: "Kuala Lumpur Central",
    phone_number: "+60123456789",
    ic_number: "901234-56-7890",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "Site Manager",
    employDate: "2022-11-03",
    status: "Active",
    siteLocation: "Penang Heights",
    phone_number: "+60123456788",
    ic_number: "890123-45-6789",
  },
  {
    id: "3",
    name: "Raj Patel",
    email: "raj.patel@example.com",
    position: "Maintenance Specialist",
    employDate: "2023-02-20",
    status: "On Leave",
    siteLocation: "Johor Bahru South",
    phone_number: "+60123456787",
    ic_number: "780912-34-5678",
  },
  {
    id: "4",
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    position: "Technical Assistant",
    employDate: "2021-07-12",
    status: "Active",
    siteLocation: "Ipoh Central",
    phone_number: "+60123456786",
    ic_number: "670891-23-4567",
  },
  {
    id: "5",
    name: "Ahmad Hassan",
    email: "ahmad.hassan@example.com",
    position: "Site Coordinator",
    employDate: "2022-09-08",
    status: "Inactive",
    siteLocation: "Kuching Main",
    phone_number: "+60123456785",
    ic_number: "560789-12-3456",
  },
];

// Status badge color mapping
const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

const Employees = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffList, setStaffList] = useState(staffData);
  const userMetadataString = useUserMetadata();
  const [organizationInfo, setOrganizationInfo] = useState<{
    organization_id: string | null;
    organization_name: string | null;
  }>({
    organization_id: null,
    organization_name: null,
  });

  useEffect(() => {
    if (userMetadataString) {
      try {
        const metadata = JSON.parse(userMetadataString);
        setOrganizationInfo({
          organization_id: metadata.organization_id || null,
          organization_name: metadata.organization_name || null,
        });
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadataString]);

  // Filter staff based on search query and filters
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.siteLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.email && staff.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      locationFilter === "all" || staff.siteLocation === locationFilter;

    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  // Get unique location and status options for filters
  const locationOptions = [...new Set(staffList.map((staff) => staff.siteLocation))];
  const statusOptions = [...new Set(staffList.map((staff) => staff.status))];

  const handleAddStaff = () => {
    if (!organizationInfo.organization_id) {
      toast({
        title: "Organization Not Found",
        description: "You need to be associated with an organization to add staff.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddStaffOpen(true);
  };

  const handleStaffAdded = (newStaff: any) => {
    setStaffList((prevStaff) => [newStaff, ...prevStaff]);
    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been added successfully.`,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Site Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {organizationInfo.organization_name && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-800">
              Managing staff for organization: <strong>{organizationInfo.organization_name}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, position, or location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employ Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{formatDate(staff.employDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[staff.status]}>
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.siteLocation}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No staff members found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {organizationInfo.organization_id && (
        <StaffFormDialog
          open={isAddStaffOpen}
          onOpenChange={setIsAddStaffOpen}
          organizationId={organizationInfo.organization_id}
          organizationName={organizationInfo.organization_name || "Your Organization"}
          onStaffAdded={handleStaffAdded}
          siteLocations={locationOptions}
        />
      )}
    </DashboardLayout>
  );
};

export default Employees;
