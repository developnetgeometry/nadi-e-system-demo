
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import { Users, UserPlus, Clock, Activity, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRowNumber } from "@/components/ui/TableRowNumber";

const MemberManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const pageSize = 20;

  // Fetch members data
  const { data: membersData, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('user_type', 'member')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }

      return data as Profile[];
    },
  });

  // Mock data for statistics
  const stats = {
    totalMembers: membersData?.length || 0,
    premiumMembers: 0,
    activeMembers: membersData?.filter(m => m.user_type === 'member').length || 0,
    lastRegistration: membersData && membersData.length > 0 
      ? new Date(membersData[0].created_at).toLocaleString() 
      : "N/A"
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort members
  const filteredMembers = membersData
    ? membersData
        .filter(member => 
          !searchTerm || 
          member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (!sortField || !sortDirection) return 0;
          
          let valA = (a as any)[sortField];
          let valB = (b as any)[sortField];
          
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        })
    : [];

  // Calculate pagination
  const totalPages = Math.ceil((filteredMembers?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="text-gray-500 mt-1">View and manage all members in the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg text-gray-600">Total Members</h3>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
              <p className="text-sm text-green-500">↑ 8% vs last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg text-gray-600">Premium Members</h3>
              <p className="text-3xl font-bold">{stats.premiumMembers}</p>
              <p className="text-sm text-green-500">↑ 12% vs last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg text-gray-600">Active Members</h3>
              <p className="text-3xl font-bold">{stats.activeMembers}</p>
              <p className="text-sm text-green-500">↑ 5% vs last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg text-gray-600">Recent Activity</h3>
              <p className="text-3xl font-bold">3 min ago</p>
              <p className="text-sm text-gray-500">Last registration: 15 minutes ago</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </Card>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-1/2">
            <Input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add New Member
            </Button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Site
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Phase
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              State
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Date Registered
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"></path>
              </svg>
              Reset
            </Button>
          </div>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Apply Filters
          </Button>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("full_name")}>
                    Name
                    {sortField === "full_name" && (
                      <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                    Email
                    {sortField === "email" && (
                      <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Reg. Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Loading members...</p>
                    </TableCell>
                  </TableRow>
                ) : paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-10">
                      <p className="text-gray-500">No members found matching your criteria</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">
                        {`M${String(index + startIndex + 1).padStart(3, '0')}`}
                      </TableCell>
                      <TableCell>{member.full_name || "N/A"}</TableCell>
                      <TableCell>{member.email || "N/A"}</TableCell>
                      <TableCell>{member.phone_number || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>Main Center</TableCell>
                      <TableCell>Advanced</TableCell>
                      <TableCell>California</TableCell>
                      <TableCell>{formatDate(member.created_at)}</TableCell>
                      <TableCell>{formatDate(member.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {filteredMembers.length > 0 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredMembers.length}
            pageSize={pageSize}
            startItem={startIndex + 1}
            endItem={Math.min(endIndex, filteredMembers.length)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberManagement;
