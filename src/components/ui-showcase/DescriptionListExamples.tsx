
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const DescriptionListExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Simple Description List */}
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Description List</h3>
        <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="text-sm font-semibold">Jane Smith</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="text-sm font-semibold">jane@example.com</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
            <dd className="text-sm font-semibold">+1 (555) 123-4567</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="text-sm font-semibold">Active</dd>
          </div>
        </dl>
      </div>

      {/* Card Description List */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Full name</dt>
              <dd className="mt-1">Jane Smith</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Email address</dt>
              <dd className="mt-1">jane@example.com</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Role</dt>
              <dd className="mt-1">Administrator</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Company</dt>
              <dd className="mt-1">Acme Inc.</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Inline Description List */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-3">Inline Description List</h3>
        <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Created by</dt>
            <dd className="mt-1 text-sm">John Doe</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Created on</dt>
            <dd className="mt-1 text-sm">Jan 10, 2023</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Last updated</dt>
            <dd className="mt-1 text-sm">Mar 23, 2023</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1 text-sm">Published</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const descriptionListCode = `{/* Simple Description List */}
<dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
  <div className="flex justify-between py-1">
    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
    <dd className="text-sm font-semibold">Jane Smith</dd>
  </div>
  <div className="flex justify-between py-1">
    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
    <dd className="text-sm font-semibold">jane@example.com</dd>
  </div>
</dl>

{/* Card Description List */}
<Card>
  <CardHeader>
    <CardTitle>User Information</CardTitle>
  </CardHeader>
  <CardContent>
    <dl className="grid grid-cols-1 gap-3 text-sm">
      <div>
        <dt className="font-medium text-muted-foreground">Full name</dt>
        <dd className="mt-1">Jane Smith</dd>
        <Separator className="mt-2" />
      </div>
      <div>
        <dt className="font-medium text-muted-foreground">Email address</dt>
        <dd className="mt-1">jane@example.com</dd>
        <Separator className="mt-2" />
      </div>
    </dl>
  </CardContent>
</Card>

{/* Inline Description List */}
<div className="p-4 border rounded-lg">
  <h3 className="text-lg font-medium mb-3">Inline Description List</h3>
  <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="sm:col-span-1">
      <dt className="text-sm font-medium text-muted-foreground">Created by</dt>
      <dd className="mt-1 text-sm">John Doe</dd>
    </div>
    <div className="sm:col-span-1">
      <dt className="text-sm font-medium text-muted-foreground">Created on</dt>
      <dd className="mt-1 text-sm">Jan 10, 2023</dd>
    </div>
  </dl>
</div>`;

