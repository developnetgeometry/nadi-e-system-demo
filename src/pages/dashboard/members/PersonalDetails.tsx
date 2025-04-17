
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users } from "lucide-react";

const PersonalDetails = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('user_type', 'member') // Only fetch members
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }

      return data as Profile[];
    },
  });

  if (isLoading) return (
    <DashboardLayout>
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-[200px] bg-gray-200 rounded"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Personal Details</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {members?.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle>{member.full_name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {member.email}</p>
                  <p><span className="font-medium">Phone:</span> {member.phone_number}</p>
                  <p><span className="font-medium">IC Number:</span> {member.ic_number}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PersonalDetails;
