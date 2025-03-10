
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const NavigationExamples = () => {
  return (
    <div className="grid gap-8">
      {/* Breadcrumbs */}
      <div>
        <h3 className="text-lg font-medium mb-2">Breadcrumbs</h3>
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2"
                >
                  Products
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="ml-1 text-sm font-medium md:ml-2">
                  Product Details
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Tabs */}
        <h3 className="text-lg font-medium mb-2 mt-6">Tabs</h3>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 border rounded-b-md mt-2">
            This is the overview tab content.
          </TabsContent>
          <TabsContent value="analytics" className="p-4 border rounded-b-md mt-2">
            This is the analytics tab content.
          </TabsContent>
          <TabsContent value="reports" className="p-4 border rounded-b-md mt-2">
            This is the reports tab content.
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <h3 className="text-lg font-medium mb-2 mt-6">Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Button Navigation */}
        <h3 className="text-lg font-medium mb-2 mt-6">Button Navigation</h3>
        <div className="flex justify-between">
          <Button variant="outline">
            Previous
          </Button>
          <Button>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const navigationCode = `{/* Breadcrumbs */}
<nav className="flex" aria-label="Breadcrumb">
  <ol className="inline-flex items-center space-x-1 md:space-x-3">
    <li className="inline-flex items-center">
      <a href="#" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <Home className="w-4 h-4 mr-2" />
        Home
      </a>
    </li>
    <li>
      <div className="flex items-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <a href="#" className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2">
          Products
        </a>
      </div>
    </li>
    <li aria-current="page">
      <div className="flex items-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="ml-1 text-sm font-medium md:ml-2">
          Product Details
        </span>
      </div>
    </li>
  </ol>
</nav>

{/* Tabs */}
<Tabs defaultValue="overview" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="p-4 border rounded-b-md mt-2">
    This is the overview tab content.
  </TabsContent>
</Tabs>

{/* Pagination */}
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`;

