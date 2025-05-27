import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PaginationComponent } from "@/components/ui/PaginationComponent";
import {
  Users,
  UserPlus,
  Search,
  Download,
  Filter,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Registration from "./Registration";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const MemberManagement = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const pageSize = 20;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch members data from nd_member_profile
  const { data: membersData, isLoading } = useQuery({
    queryKey: ["members", searchTerm, sortField, sortDirection, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("nd_member_profile")
        .select(
          `
          id,
          ref_id (id, fullname),
          community_status,
          fullname,
          email,
          status_membership (id, name),
          status_entrepreneur,
          user_id
        `,
          { count: "exact" }
        )
        .not("user_id", "is", null); // Ensure user_id is not null

      if (searchTerm) {
        query = query.or(
          `fullname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      if (sortField && sortDirection) {
        query = query.order(sortField, { ascending: sortDirection === "asc" });
      } else {
        query = query.order("id", { ascending: false });
      }

      query = query.range(
        (currentPage - 1) * pageSize,
        currentPage * pageSize - 1
      );

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }

      return { data, count: count || 0 };
    },
  });

  // Statistics
  const stats = {
    totalMembers: membersData?.count || 0,
    premiumMembers: membersData?.data?.filter((member) => member.community_status).length || 0,
    activeMembers:
      membersData?.data?.filter(
        (member) => member.status_membership?.name === "Active"
      ).length || 0,
    lastRegistration:
      membersData?.data?.filter((member) => member.status_entrepreneur).length || 0,
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil((membersData?.count || 0) / pageSize);
  const paginatedMembers = membersData?.data || [];

  const handleAddNewMember = () => {
     navigate(`/member-management/registration`);
  };

  const handleViewDetailsClick = (userId: string) => {
    navigate(`/member-management/profile?id=${userId}`);
  };

  return (
    <div>
      <div className="space-y-1">
        <div>
          <h1 className="text-xl font-bold">Member Management</h1>
          <p className="text-gray-500 mt-1">
            View and manage all members in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-l text-gray-600">Total Members</h3>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-l text-gray-600">MADANI Members</h3>
              <p className="text-3xl font-bold">{stats.premiumMembers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-l text-gray-600">Active Members</h3>
              <p className="text-3xl font-bold">{stats.activeMembers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 flex items-start justify-between">
            <div>
              <h3 className="text-l text-gray-600">Entrepreneur Members</h3>
              <p className="text-3xl font-bold">{stats.lastRegistration}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-amber-600" />
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
              <Search className="h-4 w-4" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            {userGroup === 9 && (
              <Button
                className="flex items-center gap-2"
                onClick={handleAddNewMember}
              >
                <UserPlus className="h-4 w-4" />
                Add New Member
              </Button>
            )}
          </div>
        </div>


        {/* Members Table */}
        <div className="rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("fullname")}
                  >
                    Name
                    {sortField === "fullname" && (
                      <span className="ml-2">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortField === "email" && (
                      <span className="ml-2">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Loading members...</p>
                    </TableCell>
                  </TableRow>
                ) : paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-gray-500">
                        No members found matching your criteria
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">
                        {`M${String(
                          (currentPage - 1) * pageSize + index + 1
                        ).padStart(3, "0")}`}
                      </TableCell>
                      <TableCell>{member.fullname || "N/A"}</TableCell>
                      <TableCell>{member.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {member.status_membership?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetailsClick(String(member.user_id))}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {membersData?.data?.length > 0 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={membersData?.count || 0}
            pageSize={pageSize}
            startItem={(currentPage - 1) * pageSize + 1}
            endItem={Math.min(currentPage * pageSize, membersData?.count || 0)}
          />
        )}
      </div>
    </div>
  );
};

export default MemberManagement;