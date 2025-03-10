
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, MoreVertical } from "lucide-react";

export const StackedListExamples = () => {
  const notifications = [
    {
      id: 1,
      title: "New comment on your post",
      description: "John Smith commented on your post",
      time: "2 hours ago",
      read: false,
      user: {
        name: "John Smith",
        image: "",
        initials: "JS"
      }
    },
    {
      id: 2,
      title: "Project update",
      description: "Website redesign is now 75% complete",
      time: "5 hours ago",
      read: true,
      user: {
        name: "Project Bot",
        image: "",
        initials: "PB"
      }
    },
    {
      id: 3,
      title: "New message",
      description: "You have a new message from Sarah",
      time: "1 day ago",
      read: true,
      user: {
        name: "Sarah Johnson",
        image: "",
        initials: "SJ"
      }
    }
  ];

  const tasks = [
    {
      id: 1,
      title: "Review homepage design",
      status: "In Progress",
      dueDate: "Today",
      priority: "High",
      assignees: ["AS", "JD"]
    },
    {
      id: 2,
      title: "Create component library",
      status: "To Do",
      dueDate: "Tomorrow",
      priority: "Medium",
      assignees: ["AS"]
    },
    {
      id: 3,
      title: "Update documentation",
      status: "Completed",
      dueDate: "Yesterday",
      priority: "Low",
      assignees: ["JD", "RK", "MT"]
    }
  ];

  return (
    <div className="grid gap-6">
      {/* Notification List */}
      <div className="space-y-1">
        <h3 className="font-medium text-lg">Notifications</h3>
        <div className="rounded-md border divide-y">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 flex items-start space-x-4 ${!notification.read ? 'bg-muted/40' : ''}`}
            >
              <Avatar>
                {notification.user.image ? (
                  <AvatarImage src={notification.user.image} alt={notification.user.name} />
                ) : null}
                <AvatarFallback>{notification.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge className="ml-2" variant="secondary">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <div className="flex items-center pt-1">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-1">
        <h3 className="font-medium text-lg">Tasks</h3>
        <Card>
          <div className="divide-y">
            {tasks.map((task) => (
              <div key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge 
                        variant={
                          task.status === "Completed" 
                            ? "success" 
                            : task.status === "In Progress" 
                              ? "default" 
                              : "secondary"
                        }
                        className="ml-2"
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Due {task.dueDate}</span>
                      </div>
                      <div>
                        Priority: <span className={
                          task.priority === "High" 
                            ? "text-red-500" 
                            : task.priority === "Medium" 
                              ? "text-yellow-500" 
                              : "text-green-500"
                        }>{task.priority}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee, i) => (
                        <Avatar key={i} className="border-2 border-background h-6 w-6">
                          <AvatarFallback className="text-xs">{assignee}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export const stackedListCode = `{/* Notification List */}
<div className="rounded-md border divide-y">
  {notifications.map((notification) => (
    <div 
      key={notification.id} 
      className={\`p-4 flex items-start space-x-4 \${!notification.read ? 'bg-muted/40' : ''}\`}
    >
      <Avatar>
        <AvatarFallback>{notification.user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{notification.title}</p>
          {!notification.read && (
            <Badge className="ml-2" variant="secondary">New</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {notification.description}
        </p>
        <div className="flex items-center pt-1">
          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {notification.time}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  ))}
</div>

{/* Task List */}
<Card>
  <div className="divide-y">
    {tasks.map((task) => (
      <div key={task.id} className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <h4 className="font-medium text-sm">{task.title}</h4>
              <Badge className="ml-2">{task.status}</Badge>
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>Due {task.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</Card>`;
