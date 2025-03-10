
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const FeedbackAlertsExamples = () => {
  return (
    <div className="grid gap-4">
      {/* Standard Alerts */}
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            This action has been completed successfully.
          </AlertDescription>
        </Alert>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem with your request. Please try again.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-yellow-500/50 text-yellow-800 dark:text-yellow-300">
          <AlertTriangle className="h-4 w-4 text-yellow-800 dark:text-yellow-300" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your subscription will expire in 7 days. Please renew now.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-green-500/50 text-green-800 dark:text-green-300">
          <CheckCircle className="h-4 w-4 text-green-800 dark:text-green-300" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your profile has been updated successfully.
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Empty States */}
      <div className="space-y-4">
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              We couldn't find any items matching your search criteria.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button>Clear Search</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <XCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              You haven't created any projects yet. Get started by creating your first project.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button>Create Project</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export const feedbackAlertsCode = `{/* Standard Alert */}
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This action has been completed successfully.
  </AlertDescription>
</Alert>

{/* Error Alert */}
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    There was a problem with your request. Please try again.
  </AlertDescription>
</Alert>

{/* Empty State */}
<Card className="border-dashed">
  <CardHeader className="text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
      <Info className="h-6 w-6 text-muted-foreground" />
    </div>
    <CardTitle>No Results Found</CardTitle>
    <CardDescription>
      We couldn't find any items matching your search criteria.
    </CardDescription>
  </CardHeader>
  <CardFooter className="flex justify-center">
    <Button>Clear Search</Button>
  </CardFooter>
</Card>`;
