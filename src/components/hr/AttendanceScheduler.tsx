
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAttendanceScheduler } from "@/hooks/hr/use-attendance-scheduler";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Trash2,
  Globe,
  Server,
  Zap
} from "lucide-react";
import { format } from "date-fns";

const AttendanceScheduler: React.FC = () => {
  const [config, setConfig] = useState({
    enabled: false,
    timezone: 'Asia/Kuala_Lumpur',
    hour: 0,
    minute: 0
  });

  const { toast } = useToast();
  const [isManualRunning, setIsManualRunning] = useState(false);

  const { 
    stats, 
    startScheduler, 
    stopScheduler, 
    manualRun, 
    clearErrors,
    isEnabled,
    nextRunLocalTime
  } = useAttendanceScheduler(config);

  const handleToggle = (enabled: boolean) => {
    setConfig(prev => ({ ...prev, enabled }));
  };

  const handleTimeChange = (field: 'hour' | 'minute', value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleManualRun = async () => {
    setIsManualRunning(true);
    try {
      await manualRun();
      toast({
        title: "Success",
        description: "Attendance tracking completed successfully. Check the Daily Attendance tab to see the results.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Manual run error:', error);
      toast({
        title: "Error",
        description: "Failed to run attendance tracking. Please check the console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsManualRunning(false);
    }
  };

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    return format(new Date(isoString), 'MMM dd, yyyy HH:mm:ss');
  };

  const formatLocalTime = (localTimeString: string | null) => {
    if (!localTimeString) return 'Never';
    return localTimeString;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Daily Attendance Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Important Notice */}
        <Alert>
          <Server className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Scheduler Implementation Note:</p>
              <p className="text-sm">
                The scheduler now uses an Edge Function approach due to Supabase Cloud limitations with pg_cron. 
                This provides the same functionality with better reliability. The system will track attendance 
                for staff_manager and staff_assistant_manager users daily at your configured time.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Manual Test Section */}
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium">Test Attendance Tracking:</p>
              <p className="text-sm">
                Click the button below to run the attendance tracking once and see the data appear in the Daily Attendance tab.
              </p>
              <Button 
                onClick={handleManualRun}
                disabled={isManualRunning || stats.isRunning}
                className="w-full"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isManualRunning || stats.isRunning ? 'Running Attendance Tracking...' : 'Run Attendance Tracking Now'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Scheduler Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="scheduler-enabled">Enable Daily Scheduler</Label>
              <Switch
                id="scheduler-enabled"
                checked={config.enabled}
                onCheckedChange={handleToggle}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Schedule Time (GMT+8)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="hour">Hour (24h)</Label>
                  <Input
                    id="hour"
                    type="number"
                    min="0"
                    max="23"
                    value={config.hour}
                    onChange={(e) => handleTimeChange('hour', parseInt(e.target.value) || 0)}
                    disabled={config.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minute">Minute</Label>
                  <Input
                    id="minute"
                    type="number"
                    min="0"
                    max="59"
                    value={config.minute}
                    onChange={(e) => handleTimeChange('minute', parseInt(e.target.value) || 0)}
                    disabled={config.enabled}
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Scheduled for: {config.hour.toString().padStart(2, '0')}:{config.minute.toString().padStart(2, '0')} Asia/Kuala_Lumpur (GMT+8)
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={manualRun}
                disabled={stats.isRunning || isManualRunning}
                size="sm"
                variant="outline"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Now
              </Button>
              
              {stats.errors.length > 0 && (
                <Button
                  onClick={clearErrors}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Errors
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isEnabled ? "default" : "secondary"}>
                {isEnabled ? "Scheduled" : "Stopped"}
              </Badge>
              {(stats.isRunning || isManualRunning) && (
                <Badge variant="outline" className="animate-pulse">
                  Processing...
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Scheduler Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Run</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(stats.lastRun)}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Next Run (GMT+8)</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatLocalTime(nextRunLocalTime)}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Run Count</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.runCount} executions
            </p>
          </div>
        </div>

        {/* Error Display */}
        {stats.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Recent Errors:</p>
                {stats.errors.slice(-3).map((error, index) => (
                  <p key={index} className="text-sm">
                    • {error}
                  </p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Information */}
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Daily Scheduler Information:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Runs daily at the configured time in GMT+8 timezone using Edge Functions</li>
                <li>• Tracks staff_manager and staff_assistant_manager users</li>
                <li>• Only monitors active users (is_active = true, is_deleted = false)</li>
                <li>• References nd_staff_profile for staff data</li>
                <li>• Generates daily attendance reports and tracking logs</li>
                <li>• Automatically reschedules for the next day after execution</li>
                <li>• Uses Supabase Edge Functions for better reliability and monitoring</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AttendanceScheduler;
