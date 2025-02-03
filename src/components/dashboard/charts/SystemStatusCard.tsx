import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SystemStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">System Status</span>
            <span className="text-sm font-medium text-green-500">Operational</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Last Backup</span>
            <span className="text-sm font-medium">Today, 03:00 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Server Load</span>
            <span className="text-sm font-medium">23%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};