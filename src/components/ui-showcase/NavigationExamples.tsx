
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Home } from "lucide-react";

export const NavigationExamples = () => {
  return (
    <div className="grid gap-8">
      {/* Breadcrumbs */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Breadcrumbs</h3>
        <nav className="flex items-center space-x-1 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </a>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Products
          </a>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Categories
          </a>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Electronics</span>
        </nav>
        
        <nav className="flex items-center space-x-2 rounded-md bg-muted p-2 text-sm">
          <a href="#" className="hover:text-foreground flex items-center gap-1 text-muted-foreground">
            <Home className="h-4 w-4" />
          </a>
          <span className="text-muted-foreground">/</span>
          <a href="#" className="hover:text-foreground text-muted-foreground">
            Dashboard
          </a>
          <span className="text-muted-foreground">/</span>
          <a href="#" className="hover:text-foreground text-muted-foreground">
            Settings
          </a>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Profile</span>
        </nav>
      </div>
      
      {/* Tabs */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Tabs</h3>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4 border rounded-b-md">
            <p>Account settings content here.</p>
          </TabsContent>
          <TabsContent value="password" className="p-4 border rounded-b-md">
            <p>Password settings content here.</p>
          </TabsContent>
          <TabsContent value="settings" className="p-4 border rounded-b-md">
            <p>General settings content here.</p>
          </TabsContent>
        </Tabs>
        
        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <p>Tab content goes here.</p>
          </TabsContent>
          <TabsContent value="analytics" className="pt-4">
            <p>Tab content goes here.</p>
          </TabsContent>
          <TabsContent value="reports" className="pt-4">
            <p>Tab content goes here.</p>
          </TabsContent>
          <TabsContent value="notifications" className="pt-4">
            <p>Tab content goes here.</p>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Pagination */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm">Previous</Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <span className="mx-1">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">10</Button>
          </div>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export const navigationCode = `{/* Breadcrumbs */}
<nav className="flex items-center space-x-1 text-sm">
  <a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
    <Home className="h-4 w-4" />
    <span>Home</span>
  </a>
  <ChevronRight className="h-4 w-4 text-muted-foreground" />
  <a href="#" className="text-muted-foreground hover:text-foreground">
    Products
  </a>
  <ChevronRight className="h-4 w-4 text-muted-foreground" />
  <span className="font-medium">Electronics</span>
</nav>

{/* Tabs */}
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Account settings content here.</p>
  </TabsContent>
</Tabs>

{/* Pagination */}
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`;
