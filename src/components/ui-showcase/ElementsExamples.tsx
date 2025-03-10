
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Plus, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ElementsExamples = () => {
  return (
    <div className="grid gap-8">
      {/* Avatars */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Avatars</h3>
        <div className="flex flex-wrap gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <Avatar>
            <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
          </Avatar>
          
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-600">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex -space-x-2">
            <Avatar className="border-2 border-background">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          
          <Badge className="gap-1">
            <Check className="h-3.5 w-3.5" />
            Completed
          </Badge>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dropdowns</h3>
        <div className="flex flex-wrap gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Button Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Button Groups</h3>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button className="rounded-r-none">Profile</Button>
          <Button className="rounded-none border-x-0">Settings</Button>
          <Button className="rounded-l-none">Messages</Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
            <Button size="sm" variant="outline">Edit</Button>
            <Button size="sm" variant="outline" className="text-red-500">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const elementsCode = `{/* Avatars */}
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
</Avatar>

{/* Badges */}
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

{/* Dropdowns */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Options <ChevronDown className="ml-1 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

{/* Button Groups */}
<div className="inline-flex rounded-md shadow-sm" role="group">
  <Button className="rounded-r-none">Profile</Button>
  <Button className="rounded-none border-x-0">Settings</Button>
  <Button className="rounded-l-none">Messages</Button>
</div>`;
