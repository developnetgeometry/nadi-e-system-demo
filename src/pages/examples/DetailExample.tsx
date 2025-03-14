
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Edit, Heart, MessageSquare, MoreHorizontal, Share, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DetailExample = () => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center">
            <Link to="/examples/home" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link to="/examples/home" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2 text-muted-foreground">/</span>
                      <Link to="/examples/home" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Projects
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <span className="mx-2 text-muted-foreground">/</span>
                      <span className="text-sm font-medium">
                        Website Redesign
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-6">
          {/* Project Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Website Redesign Project</h1>
                <Badge className="ml-2">In Progress</Badge>
              </div>
              <p className="text-muted-foreground">
                Complete overhaul of the company website with new design system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsLiked(!isLiked)} variant="outline" size="icon" className={isLiked ? "text-red-500" : ""}>
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
            </div>
          </div>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Project Lead</h3>
                    <div className="flex items-center mt-1.5 space-x-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@lead" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Jane Doe</p>
                        <p className="text-xs text-muted-foreground">Lead Designer</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
                    <div className="flex mt-1.5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((_, i) => (
                          <Avatar key={i} className="border-2 border-background">
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-background bg-muted">
                          <span className="text-xs font-medium">+3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
                    <div className="grid grid-cols-2 gap-4 mt-1.5">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Start Date</p>
                          <p className="text-sm">Oct 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">End Date</p>
                          <p className="text-sm">Dec 31, 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="mt-1.5 flex space-x-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 border-yellow-200">
                        In Progress
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>45 days left</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                    <div className="mt-1.5">
                      <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
                        High Priority
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <Badge variant="outline">Design</Badge>
                      <Badge variant="outline">Frontend</Badge>
                      <Badge variant="outline">UI/UX</Badge>
                      <Badge variant="outline">Responsive</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    This project involves a complete redesign of our company website to improve user experience,
                    modernize the visual design, and optimize for conversions. The new website will be fully responsive,
                    follow the latest accessibility standards, and implement our new design system.
                  </p>
                  <p className="mt-2">
                    Key deliverables include:
                  </p>
                  <ul className="mt-2 ml-6 list-disc space-y-1">
                    <li>Information architecture and user flows</li>
                    <li>Wireframes and high-fidelity mockups</li>
                    <li>Interactive prototypes</li>
                    <li>Development of all new pages</li>
                    <li>Integration with CMS</li>
                    <li>Testing and optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="w-full border-b pb-0 rounded-none bg-transparent">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Project Tasks</CardTitle>
                    <Button size="sm">Add Task</Button>
                  </div>
                  <CardDescription>
                    5 of 12 tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Research competitor websites", completed: true },
                      { title: "Create wireframes for homepage", completed: true },
                      { title: "Design style guide and component library", completed: true },
                      { title: "Develop homepage and navigation", completed: true },
                      { title: "Create responsive layouts for all pages", completed: true },
                      { title: "Implement contact form with validation", completed: false },
                      { title: "Design and develop blog templates", completed: false },
                      { title: "Optimize images and assets", completed: false },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${task.completed ? "bg-primary border-primary" : "border-gray-300"}`}>
                          {task.completed && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </div>
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="files" className="pt-4">
              <div className="text-center py-12 text-muted-foreground">
                <p>No files have been uploaded yet.</p>
                <Button className="mt-2">Upload Files</Button>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>{`U${i}`}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Alex Johnson</h3>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-sm">I really like the new homepage design! The call-to-action buttons are much more visible now.</p>
                          <div className="flex gap-2 pt-1">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Heart className="h-4 w-4 mr-1" />
                              <span className="text-xs">4</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span className="text-xs">Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mt-6 pt-6 border-t">
                    <Avatar>
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea 
                        className="w-full p-2 border rounded-md min-h-[100px] text-sm" 
                        placeholder="Add your comment..."
                      ></textarea>
                      <Button className="mt-2">Post Comment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "created the project", time: "3 days ago" },
                      { action: "added 3 team members", time: "3 days ago" },
                      { action: "completed task: Research competitor websites", time: "2 days ago" },
                      { action: "uploaded wireframes document", time: "yesterday" },
                      { action: "updated project description", time: "5 hours ago" },
                      { action: "commented on the project", time: "1 hour ago" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full border flex items-center justify-center">
                          <span className="text-xs font-medium">AJ</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Alex Johnson</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DetailExample;
