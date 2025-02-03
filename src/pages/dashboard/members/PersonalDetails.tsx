import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/auth";

const PersonalDetails = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }

      return data as Profile[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Personal Details</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {members?.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle>{member.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {member.email}</p>
                <p><span className="font-medium">Phone:</span> {member.phone_number}</p>
                <p><span className="font-medium">IC Number:</span> {member.ic_number}</p>
                <p><span className="font-medium">User Type:</span> {member.user_type}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PersonalDetails;