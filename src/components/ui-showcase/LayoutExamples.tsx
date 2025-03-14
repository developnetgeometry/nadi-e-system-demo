
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const LayoutExamples = () => {
  return (
    <div className="grid gap-8">
      {/* Containers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Containers</h3>
        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <p className="text-center text-muted-foreground">Default container with border and shadow</p>
        </div>
        
        <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-center text-muted-foreground">Centered container with max-width</p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Invite and manage team members.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <button className="text-sm text-muted-foreground">Cancel</button>
              <button className="text-sm text-primary">Save Changes</button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <CardHeader>
              <CardTitle>Featured Content</CardTitle>
              <CardDescription>Card with image background.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a gradient header image.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* List Containers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">List Containers</h3>
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 font-medium">Recent Activity</div>
          <ul className="divide-y">
            <li className="px-4 py-3 hover:bg-muted/50">List item one</li>
            <li className="px-4 py-3 hover:bg-muted/50">List item two</li>
            <li className="px-4 py-3 hover:bg-muted/50">List item three</li>
          </ul>
          <div className="bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            Showing 3 of 10 items
          </div>
        </div>
      </div>

      {/* Media Objects */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Media Objects</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">John Doe</h4>
              <p className="text-muted-foreground text-sm">
                This is a simple media object with an avatar on the left and content on the right.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border rounded-md">
            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <div>
              <h4 className="font-medium">Media with border</h4>
              <p className="text-muted-foreground text-sm">
                A media object with a border and padding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dividers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dividers</h3>
        <div className="space-y-4">
          <Separator />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                Text with divider
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Separator />
            </div>
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="flex-grow">
              <Separator />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div>Left content</div>
            <Separator orientation="vertical" className="h-6" />
            <div>Right content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const layoutCode = `{/* Containers */}
<div className="p-4 border rounded-lg bg-card shadow-sm">
  <p className="text-center text-muted-foreground">Default container with border and shadow</p>
</div>

<div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
  <p className="text-center text-muted-foreground">Centered container with max-width</p>
</div>

{/* Cards */}
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Invite and manage team members.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <button className="text-sm text-muted-foreground">Cancel</button>
    <button className="text-sm text-primary">Save Changes</button>
  </CardFooter>
</Card>

{/* List Containers */}
<div className="border rounded-md overflow-hidden">
  <div className="bg-muted/50 px-4 py-3 font-medium">Recent Activity</div>
  <ul className="divide-y">
    <li className="px-4 py-3 hover:bg-muted/50">List item one</li>
    <li className="px-4 py-3 hover:bg-muted/50">List item two</li>
    <li className="px-4 py-3 hover:bg-muted/50">List item three</li>
  </ul>
</div>

{/* Media Objects */}
<div className="flex items-start space-x-4">
  <Avatar>
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <div>
    <h4 className="font-medium">John Doe</h4>
    <p className="text-muted-foreground text-sm">
      This is a simple media object with an avatar on the left and content.
    </p>
  </div>
</div>

{/* Dividers */}
<Separator />

<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <Separator className="w-full" />
  </div>
  <div className="relative flex justify-center">
    <span className="bg-background px-2 text-muted-foreground text-sm">
      Text with divider
    </span>
  </div>
</div>`;
