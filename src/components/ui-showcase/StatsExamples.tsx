
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BadgePercent, Users, CreditCard, Activity } from "lucide-react";

export const StatsExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Basic Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +4.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats with Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$74,958.49</div>
            <div className="mt-1 flex items-center text-sm">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="font-medium text-green-500">12.5%</span>
              <span className="ml-1 text-muted-foreground">compared to last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,482</div>
            <div className="mt-1 flex items-center text-sm">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              <span className="font-medium text-red-500">-2.3%</span>
              <span className="ml-1 text-muted-foreground">compared to last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const statsCode = `{/* Basic Stats Grid */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      <CreditCard className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">$45,231.89</div>
      <p className="text-xs text-muted-foreground">
        +20.1% from last month
      </p>
    </CardContent>
  </Card>
  
  {/* More stat cards... */}
</div>

{/* Stats with Indicators */}
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-base">Monthly Sales</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$74,958.49</div>
    <div className="mt-1 flex items-center text-sm">
      <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
      <span className="font-medium text-green-500">12.5%</span>
      <span className="ml-1 text-muted-foreground">compared to last month</span>
    </div>
  </CardContent>
</Card>`;

