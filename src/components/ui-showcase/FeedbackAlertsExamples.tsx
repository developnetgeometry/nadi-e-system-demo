
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle, Info, FileSearch, Inbox, ShoppingCart } from "lucide-react";

export const FeedbackAlertsExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Alerts */}
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            This is an informational message for the user.
          </AlertDescription>
        </Alert>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        
        <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500" />
          <div>
            <h3 className="font-medium">Warning</h3>
            <div className="mt-1 text-sm">
              Your subscription will expire in 3 days. Please renew to avoid service interruption.
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
          <div>
            <h3 className="font-medium">Success</h3>
            <div className="mt-1 text-sm">
              Your profile has been updated successfully.
            </div>
          </div>
        </div>
      </div>

      {/* Toast/Notification Examples */}
      <div className="space-y-4">
        <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Successfully saved!</p>
              <p className="mt-1 text-sm text-muted-foreground">Your changes have been saved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty States */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col items-center text-center p-6">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl">No messages</CardTitle>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              You don't have any messages in your inbox. When you receive messages, they'll appear here.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Compose Message</Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6">
          <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl">No results found</CardTitle>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              We couldn't find any results matching your search. Try adjusting your search terms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Clear Filters</Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col items-center text-center p-6 md:col-span-2">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl">Your cart is empty</CardTitle>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet. Browse our products and find something you like.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Start Shopping</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export const feedbackAlertsCode = `{/* Information Alert */}
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational message for the user.
  </AlertDescription>
</Alert>

{/* Error Alert */}
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>

{/* Warning Alert */}
<div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4 flex items-start">
  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500" />
  <div>
    <h3 className="font-medium">Warning</h3>
    <div className="mt-1 text-sm">
      Your subscription will expire in 3 days.
    </div>
  </div>
</div>

{/* Empty State */}
<Card className="flex flex-col items-center text-center p-6">
  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
  <CardTitle className="text-xl">No messages</CardTitle>
  <CardContent className="pt-4">
    <p className="text-sm text-muted-foreground">
      You don't have any messages in your inbox.
    </p>
  </CardContent>
  <CardFooter>
    <Button>Compose Message</Button>
  </CardFooter>
</Card>`;

