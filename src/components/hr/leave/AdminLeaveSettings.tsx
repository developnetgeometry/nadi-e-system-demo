
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { Plus } from "lucide-react";

export function AdminLeaveSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editedEntitlements, setEditedEntitlements] = useState<Record<string, Record<string, number>>>({});

  const { data: leaveSettings } = useQuery({
    queryKey: ["leave-settings"],
    queryFn: async () => {
      // In a real app, this would fetch from the database
      // For now, returning mock data
      return {
        leaveTypes: [
          { id: 1, name: "Annual", description: "Yearly paid leave allocation" },
          { id: 2, name: "Medical", description: "Sick leave with medical certificate" },
          { id: 3, name: "Emergency", description: "Urgent personal matters" },
          { id: 4, name: "Replacement", description: "For working on off days" },
        ],
        entitlements: {
          "Staff": {
            "Annual": 14,
            "Medical": 14,
            "Emergency": 3,
            "Replacement": 5,
          },
          "Manager": {
            "Annual": 18,
            "Medical": 14,
            "Emergency": 5,
            "Replacement": 5,
          },
          "Senior Manager": {
            "Annual": 21,
            "Medical": 14,
            "Emergency": 7,
            "Replacement": 5,
          },
        }
      };
    },
  });

  const handleEntitlementChange = (role: string, leaveType: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditedEntitlements(prev => ({
      ...prev,
      [role]: {
        ...(prev[role] || {}),
        [leaveType]: numValue
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would send an API request to update settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      toast({
        title: "Settings saved",
        description: "Leave entitlement settings have been updated.",
      });

      // Reset edited values after successful save
      setEditedEntitlements({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save leave settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Types Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Leave Types</span>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Type
            </Button>
          </CardTitle>
          <CardDescription>
            Manage available leave types in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveSettings?.leaveTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Entitlement Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Entitlements</CardTitle>
          <CardDescription>
            Configure leave day allocations by staff role and leave type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {leaveSettings?.leaveTypes.map((type) => (
                  <TableHead key={type.id}>{type.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveSettings?.entitlements && Object.entries(leaveSettings.entitlements).map(([role, entitlements]) => (
                <TableRow key={role}>
                  <TableCell>{role}</TableCell>
                  {leaveSettings.leaveTypes.map((type) => {
                    const currentValue = editedEntitlements[role]?.[type.name] !== undefined
                      ? editedEntitlements[role][type.name]
                      : entitlements[type.name];
                      
                    return (
                      <TableCell key={`${role}-${type.id}`}>
                        <Input
                          type="number"
                          min="0"
                          className="w-16"
                          value={currentValue}
                          onChange={(e) => handleEntitlementChange(role, type.name, e.target.value)}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
