
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export const ProgressExamples = () => {
  const [progress, setProgress] = React.useState(13);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-6">
      {/* Basic Progress */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="progress-1" className="text-sm font-medium">Basic Progress</label>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress id="progress-1" value={progress} className="h-2" />
      </div>

      {/* Contextual Progress Bars */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Project Status</label>
            <span className="text-sm text-muted-foreground">75%</span>
          </div>
          <Progress value={75} className="h-2 bg-blue-100">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
          </Progress>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Storage Used</label>
            <span className="text-sm text-muted-foreground">90%</span>
          </div>
          <Progress value={90} className="h-2 bg-yellow-100">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '90%' }} />
          </Progress>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">System Load</label>
            <span className="text-sm text-muted-foreground">35%</span>
          </div>
          <Progress value={35} className="h-2 bg-green-100">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }} />
          </Progress>
        </div>
      </div>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Loading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <div className="space-y-2 flex-1">
              <div className="text-sm">Loading data...</div>
              <Progress value={45} className="h-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
            <div className="text-sm">Processing request...</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm flex justify-between">
              <span>Uploading file</span>
              <span>2.4 MB / 4.8 MB</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const progressCode = `{/* Basic Progress */}
<div className="space-y-2">
  <div className="flex justify-between">
    <label htmlFor="progress-1" className="text-sm font-medium">Progress</label>
    <span className="text-sm text-muted-foreground">50%</span>
  </div>
  <Progress id="progress-1" value={50} className="h-2" />
</div>

{/* Colored Progress */}
<div className="space-y-2">
  <div className="flex justify-between">
    <label className="text-sm font-medium">Project Status</label>
    <span className="text-sm text-muted-foreground">75%</span>
  </div>
  <Progress value={75} className="h-2 bg-blue-100">
    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
  </Progress>
</div>

{/* Loading with Spinner */}
<div className="flex items-center gap-4">
  <RefreshCw className="h-4 w-4 animate-spin" />
  <div className="space-y-2 flex-1">
    <div className="text-sm">Loading data...</div>
    <Progress value={45} className="h-1" />
  </div>
</div>

{/* File Upload Progress */}
<div className="space-y-1">
  <div className="text-sm flex justify-between">
    <span>Uploading file</span>
    <span>2.4 MB / 4.8 MB</span>
  </div>
  <Progress value={50} className="h-2" />
</div>`;

