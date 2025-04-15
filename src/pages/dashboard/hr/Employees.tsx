
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, UserCog, Users } from "lucide-react";
import { StaffFormDialog } from "@/components/hr/StaffFormDialog";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const Employees = () => {
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const { toast } = useToast();
  const { userMetadata, isLoading: isMetadataLoading } = useUserMetadata();
  const [userType, setUserType] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (userMetadata) {
      try {
        const metadata = JSON.parse(userMetadata);
        setUserType(metadata?.user_type);
        setOrganizationId(metadata?.organization_id);
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadata]);

  useEffect(() => {
    fetchStaffProfiles();
  }, [organizationId]);

  const fetchStaffProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("nd_staff_profile")
        .select("*")
        .order("created_at", { ascending: false });

      if (organizationId) {
        query = query.eq("dusp_tp_id", organizationId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setStaffMembers(data || []);
      setFilteredStaff(data || []);
    } catch (error) {
      console.error("Error fetching staff profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredStaff(staffMembers);
      return;
    }

    const filtered = staffMembers.filter(
      (staff) =>
        staff.fullname?.toLowerCase().includes(term) ||
        staff.work_email?.toLowerCase().includes(term) ||
        staff.mobile_no?.toLowerCase().includes(term)
    );

    setFilteredStaff(filtered);
  };

  const handleStaffCreated = () => {
    fetchStaffProfiles();
    toast({
      title: "Success",
      description: "Staff member created successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage staff members in your organization
            </p>
          </div>
          <Button onClick={() => setIsStaffFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                <h3 className="text-2xl font-bold">{staffMembers.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <UserCog className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
                <h3 className="text-2xl font-bold">
                  {staffMembers.filter((s) => s.is_active).length}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Searchable Staff
                </p>
                <h3 className="text-2xl font-bold">{staffMembers.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>
              Manage staff members in your organization
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>IC Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Loading staff data...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <p className="text-muted-foreground">No staff members found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.fullname}</TableCell>
                      <TableCell>{staff.work_email}</TableCell>
                      <TableCell>{staff.mobile_no}</TableCell>
                      <TableCell>{staff.ic_no}</TableCell>
                      <TableCell>
                        {staff.is_active ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <StaffFormDialog
        open={isStaffFormOpen}
        onOpenChange={setIsStaffFormOpen}
        onSuccess={handleStaffCreated}
      />
    </DashboardLayout>
  );
};

export default Employees;
