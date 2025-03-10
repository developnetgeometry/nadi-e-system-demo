
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Key, Lock, Mail, Shield, User } from "lucide-react";

const SettingsExample = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center">
            <Link to="/examples/home" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <Tabs defaultValue="account" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-start h-auto bg-transparent p-0 space-y-1">
                      <TabsTrigger value="account" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </TabsTrigger>
                      <TabsTrigger value="security" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="w-full justify-start">
                        <Lock className="h-4 w-4 mr-2" />
                        Privacy
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your profile and account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 pb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          JPG, GIF or PNG. Max size of 800K
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <Button size="sm" variant="outline">Upload</Button>
                          <Button size="sm" variant="outline" className="text-red-500">Remove</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <form className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            defaultValue="Sarah"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            defaultValue="Johnson"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          defaultValue="sarah.johnson@example.com"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          defaultValue="UI/UX Designer with 5+ years of experience working on design systems and responsive web applications."
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          Brief description for your profile.
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="text-sm font-medium">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium">
                              New Password
                            </label>
                            <input
                              id="newPassword"
                              type="password"
                              placeholder="••••••••"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirm New Password
                            </label>
                            <input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button>
                            <Key className="mr-2 h-4 w-4" />
                            Update Password
                          </Button>
                        </div>
                      </form>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium">Sessions</h3>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-muted-foreground">
                                Chrome on macOS - San Francisco, CA
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Started 2 hours ago · Last active now
                              </p>
                            </div>
                            <div className="text-green-500 text-xs font-medium py-1 px-2 bg-green-50 rounded-full">
                              Active Now
                            </div>
                          </div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Mobile App</p>
                              <p className="text-sm text-muted-foreground">
                                iPhone 13 - Los Angeles, CA
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Started 1 day ago · Last active 3 hours ago
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Choose how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        {[
                          { title: "Comments", description: "Receive emails when someone comments on your posts" },
                          { title: "Account Activity", description: "Get important notifications about your account" },
                          { title: "Project Updates", description: "Receive updates on projects you're part of" },
                          { title: "Marketing", description: "Receive tips, product updates and offers" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            <Switch defaultChecked={i < 2} />
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Push Notifications</h3>
                        {[
                          { title: "Everything", description: "Receive all push notifications" },
                          { title: "Direct Messages", description: "Receive notifications for direct messages" },
                          { title: "Mentions", description: "Receive notifications when you're mentioned" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            <Switch defaultChecked={i === 1} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your privacy and data settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Profile Privacy</h3>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Make profile public</h4>
                              <p className="text-sm text-muted-foreground">
                                Allow others to see your profile information
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Show email address</h4>
                              <p className="text-sm text-muted-foreground">
                                Display your email to other users
                              </p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Show activity status</h4>
                              <p className="text-sm text-muted-foreground">
                                Show when you're active on the platform
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Data Usage</h3>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Analytics</h4>
                              <p className="text-sm text-muted-foreground">
                                Allow us to collect anonymous usage data to improve services
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Personalization</h4>
                              <p className="text-sm text-muted-foreground">
                                Use your data to personalize your experience
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Data Management</h3>
                        <div className="grid gap-4">
                          <Button variant="outline" className="justify-start w-full md:w-auto">
                            <Mail className="mr-2 h-4 w-4" />
                            Request Data Export
                          </Button>
                          <Button variant="outline" className="text-red-500 justify-start w-full md:w-auto">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Save Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsExample;
