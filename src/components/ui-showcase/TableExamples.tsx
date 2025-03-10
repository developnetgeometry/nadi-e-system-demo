
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";

export const TableExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Basic Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of recent invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Paid
                </Badge>
              </TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending
                </Badge>
              </TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV003</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Paid
                </Badge>
              </TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Data Table with Sorting */}
      <div className="rounded-md border">
        <div className="p-3 flex justify-between items-center border-b">
          <h3 className="text-base font-medium">Users</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowUpDown className="w-3 h-3 mr-1.5" />
              Sort
            </Button>
            <Button size="sm">
              Add User
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>U{row}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">User Name {row}</div>
                      <div className="text-sm text-muted-foreground hidden md:block">@username{row}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>user{row}@example.com</TableCell>
                <TableCell>{row === 1 ? "Admin" : row === 2 ? "Editor" : "Viewer"}</TableCell>
                <TableCell>
                  <Badge variant={row === 3 ? "secondary" : "default"}>
                    {row === 3 ? "Offline" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Expandable Table Row */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ORD-001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>May 15, 2023</TableCell>
              <TableCell>$120.00</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} className="bg-muted/50 p-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Order Details</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Items</div>
                      <div className="text-sm">3</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Shipping</div>
                      <div className="text-sm">$10.00</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Tax</div>
                      <div className="text-sm">$5.00</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="text-sm">Delivered</div>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const tableCode = `{/* Basic Table */}
<Table>
  <TableCaption>A list of recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Paid
        </Badge>
      </TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
    {/* More rows... */}
  </TableBody>
</Table>

{/* User Table Row */}
<TableRow>
  <TableCell>
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg" alt="User" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">User Name</div>
        <div className="text-sm text-muted-foreground">@username</div>
      </div>
    </div>
  </TableCell>
  <TableCell>user@example.com</TableCell>
  <TableCell>Admin</TableCell>
  <TableCell>
    <Badge>Active</Badge>
  </TableCell>
  <TableCell>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </TableCell>
</TableRow>`;

