import { useState, useEffect, useMemo } from "react";
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
import {
  UserPlus,
  Search,
  Filter,
  Building,
  Eye,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { createStaffMember } from "@/lib/staff";
import { useSiteStaffData } from "@/hooks/hr/use-site-staff-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

const SiteStaff = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const userMetadataString = useUserMetadata();
  const { user } = useAuth();
  const { userType } = useUserAccess();

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

  const {
    staffList,
    isLoading,
    locationOptions,
    statusOptions,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
  } = useSiteStaffData(user, organizationInfo);

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.userType &&
          staff.userType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (staff.siteLocation &&
          staff.siteLocation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (staff.email &&
          staff.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation =
        locationFilter === "all" || staff.siteLocation === locationFilter;

      const matchesStatus =
        statusFilter === "all" || staff.status === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [staffList, searchQuery, locationFilter, statusFilter]);

  const handleEditStaff = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setIsEditStaffOpen(true);
    }
  };

  const handleViewStaff = (staffId) => {
    navigate(`/dashboard/hr/staff/${staffId}`);
  };

  const handleDeleteStaff = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      setStaffToDelete(staff);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaffMember(staffToDelete.id);
      removeStaffMember(staffToDelete.id);

      toast({
        title: "Staff Deleted",
        description: `${staffToDelete.name} has been removed successfully.`,
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;

    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await updateStaffStatus(staffId, newStatus);
      updateStaffMember({
        ...staff,
        status: newStatus,
      });

      toast({
        title: "Status Updated",
        description: `${staff.name}'s status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update staff status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddStaff = () => {
    if (!organizationInfo.organization_id) {
      toast({
        title: "Organization Not Found",
        description:
          "You need to be associated with an organization to add staff.",
        variant: "destructive",
      });
      return;
    }

    const allowedUserTypes = ["tp_admin", "tp_hr", "super_admin"];
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast({
        title: "Permission Denied",
        description:
          "Only TP Admin, HR, and Super Admin users can add staff members.",
        variant: "destructive",
      });
      return;
    }

    setIsAddStaffOpen(true);
  };

  const handleStaffAdded = async (newStaff: any) => {
    try {
      console.log("Adding new site staff member with data:", newStaff);

      if (newStaff.id) {
        // If the staff already has an ID, it was created on the server
        addStaffMember(newStaff);

        toast({
          title: "Staff Added",
          description: `${
            newStaff.name || newStaff.fullname
          } has been added successfully as ${(newStaff.userType || "").replace(
            /_/g,
            " "
          )} at ${newStaff.siteLocationName || "Unknown site"}.`,
        });
      } else {
        // Create staff member on the server
        const result = await createStaffMember(newStaff);

        addStaffMember({
          ...newStaff,
          id: result.data.id,
        });

        toast({
          title: "Staff Added",
          description: `${
            newStaff.name
          } has been added successfully as ${newStaff.userType.replace(
            /_/g,
            " "
          )} at ${newStaff.siteLocationName || "Unknown site"}.`,
        });
      }
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStaffEdited = async (updatedStaff) => {
    try {
      // Update staff on the server would go here
      updateStaffMember(updatedStaff);

      toast({
        title: "Staff Updated",
        description: `${updatedStaff.name}'s information has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditStaffOpen(false);
      setSelectedStaff(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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
          <h1 className="text-xl font-bold">Site Staff Management</h1>
          <Button onClick={handleAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Site Staff
          </Button>
        </div>

        {organizationInfo.organization_name && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-800 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Managing site staff for organization:{" "}
              <strong className="ml-1">
                {organizationInfo.organization_name}
              </strong>
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, user type, or location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <TableHead>User Type</TableHead>
                <TableHead>Employ Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Loading Site staff data...
                    </p>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>
                      {staff.userType?.replace(/_/g, " ") || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {staff.employDate ? formatDate(staff.employDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[staff.status]}
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.siteLocation}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewStaff(staff.id)}
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStaff(staff.id)}
                          title="Edit Staff"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleToggleStatus(staff.id, staff.status)
                          }
                          title={
                            staff.status === "Active"
                              ? "Set Inactive"
                              : "Set Active"
                          }
                        >
                          {staff.status === "Active" ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStaff(staff.id)}
                          title="Delete Staff"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No site staff members found matching your criteria
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
          organizationName={
            organizationInfo.organization_name || "Your Organization"
          }
          onStaffAdded={handleStaffAdded}
          siteLocations={locationOptions}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {staffToDelete?.name}'s record from
              the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStaff}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default SiteStaff;
