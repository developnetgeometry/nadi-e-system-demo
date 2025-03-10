
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const ProgressExamples = () => {
  const [progress1, setProgress1] = React.useState(0);
  const [progress2, setProgress2] = React.useState(0);

  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress1(66);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setProgress2(80);
    }, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="grid gap-6">
      {/* Simple Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Project Completion</h3>
          <span className="text-sm font-medium">{progress1}%</span>
        </div>
        <Progress value={progress1} className="h-2" />
      </div>
      
      {/* Progress with Multiple Segments */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Task Progress</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Tasks: 12/15</Badge>
            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">80%</Badge>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: "60%" }}></div>
          <div className="bg-yellow-500 h-full -mt-2" style={{ width: "20%" }}></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Completed (9)</span>
          <span>In Progress (3)</span>
          <span>To Do (3)</span>
        </div>
      </div>
      
      {/* Progress in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Download Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progress2} className="h-2" />
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{progress2}%</span>
                  <span className="text-muted-foreground ml-1">complete</span>
                </div>
                <div className="text-muted-foreground">138.4 MB / 172.8 MB</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Estimated time remaining: 2 minutes
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={33} className="h-2" />
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">5.3 GB</span>
                  <span className="text-muted-foreground ml-1">of 15 GB used</span>
                </div>
                <div className="text-muted-foreground">33%</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">Documents: 2.1 GB</div>
            <div className="text-xs text-muted-foreground">Media: 3.2 GB</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export const progressCode = `{/* Simple Progress Bar */}
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <h3 className="text-sm font-medium">Project Completion</h3>
    <span className="text-sm font-medium">66%</span>
  </div>
  <Progress value={66} className="h-2" />
</div>

{/* Progress with Multiple Segments */}
<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
  <div className="bg-green-500 h-full" style={{ width: "60%" }}></div>
  <div className="bg-yellow-500 h-full -mt-2" style={{ width: "20%" }}></div>
</div>

{/* Progress in Card */}
<Card>
  <CardHeader>
    <CardTitle className="text-lg">Download Progress</CardTitle>
  </CardHeader>
  <CardContent>
    <Progress value={80} className="h-2" />
    <div className="flex justify-between text-sm mt-2">
      <div><span className="font-medium">80%</span> complete</div>
      <div className="text-muted-foreground">138.4 MB / 172.8 MB</div>
    </div>
  </CardContent>
</Card>`;
