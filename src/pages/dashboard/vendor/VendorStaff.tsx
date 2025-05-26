import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface VendorStaffMember {
  id: number;
  fullname: string;
  ic_no: string;
  mobile_no: string;
  work_email: string;
  position_id: number;
  is_active: boolean;
  registration_number: number;
  vendor_company?: string;
}

const VendorStaff = () => {
  const [staff, setStaff] = useState<VendorStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data: staffData, error } = await supabase.from("nd_vendor_staff")
        .select(`
          id,
          fullname,
          ic_no,
          mobile_no,
          work_email,
          position_id,
          is_active,
          registration_number
        `);

      if (error) throw error;

      // Get vendor company names
      const staffWithCompanies = await Promise.all(
        (staffData || []).map(async (member) => {
          const { data: companyData } = await supabase
            .from("nd_vendor_profile")
            .select("business_name")
            .eq("registration_number", member.registration_number)
            .single();

          return {
            ...member,
            vendor_company: companyData?.business_name || "Unknown",
          };
        })
      );

      setStaff(staffWithCompanies);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.work_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.vendor_company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Vendor Staff"
            description="Manage all vendor staff members"
          />
          <Button asChild>
            <Link to="/vendor/staff/new">
              <Plus className="mr-2 h-4 w-4" />
              Register New Staff
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IC Number</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading staff...
                    </TableCell>
                  </TableRow>
                ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No staff found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.fullname}
                      </TableCell>
                      <TableCell>{member.ic_no}</TableCell>
                      <TableCell>{member.mobile_no}</TableCell>
                      <TableCell>{member.work_email}</TableCell>
                      <TableCell>{member.vendor_company}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.is_active ? "default" : "secondary"}
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/vendor/staff/${member.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default VendorStaff;
