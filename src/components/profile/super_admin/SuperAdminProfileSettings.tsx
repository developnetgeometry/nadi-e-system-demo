import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDUSPID from "@/hooks/use-dusp-id";
import usePositionData from "@/hooks/use-position-data"; // Import the hook

const SuperAdminProfileSettings = () => {

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardContent className="p-6">
        <h1 className="text-5xl font-bold">YOU ARE SUPER ADMIN 🦹</h1>
      </CardContent>
    </Card>
  );
};

export default SuperAdminProfileSettings;