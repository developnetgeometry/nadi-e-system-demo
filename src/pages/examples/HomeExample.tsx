
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowUpRight, Bell, ChevronRight, Home, MessageSquare, Search, Settings, Users } from "lucide-react";

const HomeExample = () => {
  const notifications = [
    { id: 1, title: "New message", message: "You have a new message from Sarah", time: "5m ago" },
    { id: 2, title: "Team meeting", message: "Team meeting scheduled for 3:00 PM", time: "1h ago" },
    { id: 3, title: "New signup", message: "New user registered to the platform", time: "3h ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="relative hidden md:flex items-center gap-4 md:grow">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </button>
            <button className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Upgrade
            </button>
            <Link to="/ui-components" className="flex items-center gap-2 rounded-full border p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Good morning, Sarah</h1>
            <p className="text-muted-foreground">Here's what's happening with your projects.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Invite Team
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+20.1% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+180.1% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>+201 since last hour</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18,592</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+19% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b pb-0 rounded-none">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Projects */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>You have 4 active projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">Website Redesign</h3>
                            <Badge variant="outline" className="text-green-600 bg-green-50">
                              In Progress
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">Update the landing page with new testimonials and features.</p>
                          <div className="mt-2">
                            <div className="flex justify-between mb-1 text-xs">
                              <span>Progress</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((_, i) => (
                                <Avatar key={i} className="border-2 border-background h-6 w-6">
                                  <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">Due in 2 days</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>You have {notifications.length} new notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-muted-foreground text-xs">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View all notifications
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="projects">
            <div className="py-4 text-center text-muted-foreground">
              Projects content would go here.
            </div>
          </TabsContent>
          <TabsContent value="customers">
            <div className="py-4 text-center text-muted-foreground">
              Customers content would go here.
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="py-4 text-center text-muted-foreground">
              Reports content would go here.
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your team's latest actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>A{i}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Alex Johnson</span> commented on <span className="font-medium text-indigo-600">Design System</span></p>
                    <p className="text-xs text-muted-foreground">Great work everyone! The new typography looks amazing.</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2023 Dashboard Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Terms</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Privacy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeExample;
