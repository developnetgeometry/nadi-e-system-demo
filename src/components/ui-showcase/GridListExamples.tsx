
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, MoreVertical, Star } from "lucide-react";

export const GridListExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              <img
                src="/placeholder.svg"
                alt={`Product ${item}`}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-2 right-2">New</Badge>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Product Name {item}</CardTitle>
              <CardDescription>Short product description</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <span className="font-bold">$29.99</span>
              <Button size="sm">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* User/Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={`User ${item}`} />
                  <AvatarFallback>U{item}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-base mt-3">User Name {item}</CardTitle>
              <CardDescription>Product Designer</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                <span>4.{item} Rating</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full">View Profile</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base">Project {item}</CardTitle>
                <Badge variant={item === 1 ? "default" : item === 2 ? "secondary" : "outline"}>
                  {item === 1 ? "Active" : item === 2 ? "In Progress" : "Completed"}
                </Badge>
              </div>
              <CardDescription>Client: Company {item}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Brief description of the project and its current status or relevant information.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>Last updated: {item} day{item !== 1 ? "s" : ""} ago</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="ghost" size="sm">Details</Button>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((avatar) => (
                  <Avatar key={avatar} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/placeholder.svg" alt={`Contributor ${avatar}`} />
                    <AvatarFallback className="text-xs">U{avatar}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const gridListCode = `{/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="overflow-hidden">
    <div className="aspect-square relative bg-muted">
      <img
        src="/placeholder.svg"
        alt="Product"
        className="object-cover w-full h-full"
      />
      <Badge className="absolute top-2 right-2">New</Badge>
    </div>
    <CardHeader className="p-4">
      <CardTitle className="text-base">Product Name</CardTitle>
      <CardDescription>Short product description</CardDescription>
    </CardHeader>
    <CardFooter className="p-4 pt-0 flex justify-between">
      <span className="font-bold">$29.99</span>
      <Button size="sm">Add to Cart</Button>
    </CardFooter>
  </Card>
</div>

{/* User Card */}
<Card className="overflow-hidden">
  <CardHeader className="p-4 pb-2">
    <div className="flex justify-between items-start">
      <Avatar className="h-12 w-12">
        <AvatarImage src="/placeholder.svg" alt="User" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
    <CardTitle className="text-base mt-3">User Name</CardTitle>
    <CardDescription>Product Designer</CardDescription>
  </CardHeader>
  <CardFooter className="p-4 pt-0">
    <Button variant="outline" size="sm" className="w-full">
      View Profile
    </Button>
  </CardFooter>
</Card>`;

