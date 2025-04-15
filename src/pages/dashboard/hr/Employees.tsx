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

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

const Employees = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
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

  const { staffList, isLoading, statusOptions } = useStaffData(user, organizationInfo);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.userType && staff.userType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (staff.email && staff.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddStaff = () => {
    if (!organizationInfo.organization_id) {
      toast({
        title: "Organization Not Found",
        description: "You need to be associated with an organization to add staff.",
        variant: "destructive",
      });
      return;
    }
    
    const allowedUserTypes = ['tp_admin', 'tp_hr', 'super_admin'];
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast({
        title: "Permission Denied",
        description: "Only TP Admin, HR, and Super Admin users can add staff members.",
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
        setStaffList((prevStaff) => [{
          id: newStaff.id,
          name: newStaff.name || newStaff.fullname,
          email: newStaff.work_email || newStaff.email,
          userType: newStaff.userType,
          employDate: newStaff.join_date || new Date().toISOString().split("T")[0],
          status: newStaff.is_active ? "Active" : "Inactive",
          phone_number: newStaff.mobile_no || newStaff.phone_number,
          ic_number: newStaff.ic_no || newStaff.ic_number,
        }, ...prevStaff]);
        
        toast({
          title: "Staff Added",
          description: `${newStaff.name || newStaff.fullname} has been added successfully as ${(newStaff.userType || "").replace(/_/g, ' ')}.`,
        });
      } else {
        const result = await createStaffMember(newStaff);
        
        setStaffList((prevStaff) => [{
          id: result.data.id,
          name: newStaff.name,
          email: newStaff.email,
          userType: newStaff.userType,
          employDate: newStaff.employDate,
          status: newStaff.status,
          phone_number: newStaff.phone_number,
          ic_number: newStaff.ic_number,
        }, ...prevStaff]);
        
        toast({
          title: "Staff Added",
          description: `${newStaff.name} has been added successfully as ${newStaff.userType.replace(/_/g, ' ')}.`,
        });
      }
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member. Please try again.",
        variant: "destructive",
      });
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
          organizationName={organizationInfo.organization_name || "Your Organization"}
          onStaffAdded={handleStaffAdded}
          siteLocations={[]}
        />
      )}
    </DashboardLayout>
  );
};

export default Employees;
