import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { createStaffMember } from "@/lib/staff";
import { StaffHeader } from "@/components/hr/StaffHeader";
import { StaffFilters } from "@/components/hr/StaffFilters";
import { StaffTable } from "@/components/hr/StaffTable";
import { useStaffData } from "@/hooks/hr/use-staff-data";
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

const Employees = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
    statusOptions,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
  } = useStaffData(user, organizationInfo);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.userType &&
        staff.userType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (staff.email &&
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      console.log("Adding new staff member with data:", newStaff);

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
          )}.`,
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
          )}.`,
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
        <StaffHeader
          organizationName={organizationInfo.organization_name}
          onAddStaff={handleAddStaff}
        />

        <StaffFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
        />

        <StaffTable
          isLoading={isLoading}
          filteredStaff={filteredStaff}
          formatDate={formatDate}
          statusColors={statusColors}
        />
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
          siteLocations={[]}
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

export default Employees;
