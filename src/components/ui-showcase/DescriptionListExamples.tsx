
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const DescriptionListExamples = () => {
  return (
    <div className="grid gap-4">
      {/* Basic Description List */}
      <div className="grid gap-1">
        <h3 className="text-lg font-medium">Basic Description List</h3>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
            <dd className="text-sm font-semibold">Alex Johnson</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
            <dd className="text-sm font-semibold">alex.johnson@example.com</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Position</dt>
            <dd className="text-sm font-semibold">UI/UX Designer</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Department</dt>
            <dd className="text-sm font-semibold">Design Team</dd>
          </div>
        </dl>
      </div>

      <Separator />

      {/* Styled Description List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <div className="flex justify-between py-3">
              <dt className="font-medium">Product Name</dt>
              <dd className="text-muted-foreground">Premium Headphones</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="font-medium">SKU</dt>
              <dd className="text-muted-foreground">HDX-200</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="font-medium">Price</dt>
              <dd className="font-semibold text-green-600">$199.99</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="font-medium">Status</dt>
              <dd>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                  In Stock
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export const descriptionListCode = `{/* Basic Description List */}
<dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  <div className="space-y-1">
    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
    <dd className="text-sm font-semibold">Alex Johnson</dd>
  </div>
  <div className="space-y-1">
    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
    <dd className="text-sm font-semibold">alex.johnson@example.com</dd>
  </div>
</dl>

{/* Styled Description List */}
<Card>
  <CardHeader>
    <CardTitle>Product Details</CardTitle>
  </CardHeader>
  <CardContent>
    <dl className="divide-y">
      <div className="flex justify-between py-3">
        <dt className="font-medium">Product Name</dt>
        <dd className="text-muted-foreground">Premium Headphones</dd>
      </div>
      <div className="flex justify-between py-3">
        <dt className="font-medium">Status</dt>
        <dd>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
            In Stock
          </span>
        </dd>
      </div>
    </dl>
  </CardContent>
</Card>`;
