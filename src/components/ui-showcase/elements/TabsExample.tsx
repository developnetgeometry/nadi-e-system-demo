
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tabs</h3>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-4 border rounded-b-md mt-2">
          <p>Manage your account settings and preferences.</p>
        </TabsContent>
        <TabsContent value="password" className="p-4 border rounded-b-md mt-2">
          <p>Change your password here.</p>
        </TabsContent>
        <TabsContent value="settings" className="p-4 border rounded-b-md mt-2">
          <p>Edit your notification settings.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const tabsCode = `<Tabs defaultValue="account" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account" className="p-4 border rounded-b-md mt-2">
    <p>Manage your account settings and preferences.</p>
  </TabsContent>
  <TabsContent value="password" className="p-4 border rounded-b-md mt-2">
    <p>Change your password here.</p>
  </TabsContent>
  <TabsContent value="settings" className="p-4 border rounded-b-md mt-2">
    <p>Edit your notification settings.</p>
  </TabsContent>
</Tabs>`;
