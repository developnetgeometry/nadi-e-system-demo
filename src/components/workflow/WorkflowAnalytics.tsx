
import { useMemo } from "react";
import { Workflow } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface WorkflowAnalyticsProps {
  workflows: Workflow[] | undefined;
  isLoading: boolean;
}

export const WorkflowAnalytics = ({
  workflows,
  isLoading,
}: WorkflowAnalyticsProps) => {
  const statusData = useMemo(() => {
    if (!workflows?.length) return [];
    
    const counts = {
      draft: 0,
      active: 0,
      archived: 0,
    };
    
    workflows.forEach((workflow) => {
      counts[workflow.status as keyof typeof counts] += 1;
    });
    
    return [
      { name: "Draft", value: counts.draft, color: "#94a3b8" },
      { name: "Active", value: counts.active, color: "#22c55e" },
      { name: "Archived", value: counts.archived, color: "#64748b" },
    ];
  }, [workflows]);
  
  const stepsData = useMemo(() => {
    if (!workflows?.length) return [];
    
    return workflows
      .filter((workflow) => workflow.steps.length > 0)
      .slice(0, 8)
      .map((workflow) => ({
        name: workflow.name.length > 15 
          ? workflow.name.substring(0, 15) + '...' 
          : workflow.name,
        steps: workflow.steps.length,
      }));
  }, [workflows]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-pulse h-[300px]" />
        <Card className="animate-pulse h-[300px]" />
      </div>
    );
  }

  if (!workflows?.length) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          No workflows data available for analytics. Create some workflows to see insights.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
              Steps Per Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickMargin={8} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              Workflow Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-xl font-bold">{workflows.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Total Workflows</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-xl font-bold">
              {workflows.reduce((sum, workflow) => sum + workflow.activeInstances, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Active Instances</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-xl font-bold">
              {workflows.reduce((sum, workflow) => sum + workflow.completedInstances, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Completed Instances</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
