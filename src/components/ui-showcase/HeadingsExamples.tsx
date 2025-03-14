
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const HeadingsExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Page Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Page Heading</h1>
        <p className="text-muted-foreground">
          Page description goes here to provide context about this page.
        </p>
        <Separator className="my-2" />
      </div>

      {/* Section Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Section Heading</h2>
        <p className="text-muted-foreground">
          Section description to provide context about this section of content.
        </p>
      </div>

      {/* Card Heading */}
      <Card>
        <CardHeader>
          <CardTitle>Card Heading</CardTitle>
          <CardDescription>
            Card description explaining the card's purpose or content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>

      {/* Alternative Section Heading with Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-medium tracking-tight">Alternative Section</h3>
          <p className="text-sm text-muted-foreground">
            Another style of section heading with actions on the right.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">New</Badge>
          <Button variant="outline" size="sm">Action</Button>
        </div>
      </div>
    </div>
  );
};

export const headingsCode = `{/* Page Heading */}
<div className="space-y-2">
  <h1 className="text-3xl font-bold tracking-tight">Page Heading</h1>
  <p className="text-muted-foreground">
    Page description goes here to provide context.
  </p>
  <Separator className="my-2" />
</div>

{/* Section Heading */}
<div className="space-y-2">
  <h2 className="text-2xl font-semibold tracking-tight">Section Heading</h2>
  <p className="text-muted-foreground">
    Section description to provide context.
  </p>
</div>

{/* Card Heading */}
<Card>
  <CardHeader>
    <CardTitle>Card Heading</CardTitle>
    <CardDescription>
      Card description explaining the card's purpose.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>

{/* Alternative Section with Actions */}
<div className="flex items-center justify-between mb-4">
  <div className="space-y-1">
    <h3 className="text-xl font-medium tracking-tight">Alternative Section</h3>
    <p className="text-sm text-muted-foreground">Section with actions</p>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant="outline">New</Badge>
    <Button variant="outline" size="sm">Action</Button>
  </div>
</div>`;

