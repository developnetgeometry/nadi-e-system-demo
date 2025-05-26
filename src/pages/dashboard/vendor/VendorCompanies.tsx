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

interface VendorCompany {
  id: number;
  business_name: string;
  registration_number: string;
  business_type: string;
  phone_number: string;
  staff_count: number;
  contract_status: string;
}

const VendorCompanies = () => {
  const [companies, setCompanies] = useState<VendorCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: vendorData, error } = await supabase.from(
        "nd_vendor_profile"
      ).select(`
          id,
          business_name,
          registration_number,
          business_type,
          phone_number
        `);

      if (error) throw error;

      // Get staff count for each vendor
      const companiesWithStats = await Promise.all(
        (vendorData || []).map(async (vendor) => {
          const { count: staffCount } = await supabase
            .from("nd_vendor_staff")
            .select("id", { count: "exact" })
            .eq("registration_number", vendor.registration_number);

          const { data: contractData } = await supabase
            .from("nd_vendor_contract")
            .select("is_active")
            .eq("registration_number", vendor.registration_number)
            .single();

          return {
            ...vendor,
            staff_count: staffCount || 0,
            contract_status: contractData?.is_active ? "Active" : "Inactive",
          };
        })
      );

      setCompanies(companiesWithStats);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.business_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      company.registration_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageContainer>
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Vendor Companies"
            description="Manage all vendor companies and their details"
          />
          <Button asChild>
            <Link to="/vendor/companies/new">
              <Plus className="mr-2 h-4 w-4" />
              Register New Company
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Registration Number</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Staff Count</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading companies...
                    </TableCell>
                  </TableRow>
                ) : filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No companies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.business_name}
                      </TableCell>
                      <TableCell>{company.registration_number}</TableCell>
                      <TableCell>{company.business_type}</TableCell>
                      <TableCell>{company.phone_number}</TableCell>
                      <TableCell>{company.staff_count}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            company.contract_status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {company.contract_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/vendor/companies/${company.id}`}>
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

export default VendorCompanies;
