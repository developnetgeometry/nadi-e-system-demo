
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, ShoppingCart, CreditCard, Activity } from "lucide-react";

export const StatsExamples = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Simple Stats Card */}
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

      {/* Stats with Indicator */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <div className="flex items-center pt-1">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">12%</span>
            <span className="ml-1 text-xs text-muted-foreground">
              vs. last week
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats with Negative Change */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">149</div>
          <div className="flex items-center pt-1">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-500">4.3%</span>
            <span className="ml-1 text-xs text-muted-foreground">
              vs. last week
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats with Chart Indicator */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <div className="h-3 w-full flex space-x-1 mt-2">
            {[40, 30, 70, 50, 90, 60, 75].map((h, i) => (
              <div
                key={i}
                className="bg-primary/80 rounded-full"
                style={{ height: '100%', width: '14%', opacity: h / 100 }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const statsCode = `<Card>
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
    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
    <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">+2350</div>
    <div className="flex items-center pt-1">
      <ArrowUp className="h-4 w-4 text-green-500" />
      <span className="text-xs font-medium text-green-500">12%</span>
      <span className="ml-1 text-xs text-muted-foreground">
        vs. last week
      </span>
    </div>
  </CardContent>
</Card>`;
